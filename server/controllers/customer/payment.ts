import { Request, Response } from "express";
const axios = require("axios");
require("dotenv").config();
const Customer = require("../../models/customer");
const Product = require("../../models/product");
const Order = require("../../models/order");
const nodemailer = require("nodemailer");
const PAYSTACK_SECRET_KEY = process.env.paystack_secret_key;
import { SalesStats } from "../../models/stats";

export const pay = async (req: Request, res: Response) => {
  const {
    email,
    fullName,
    amount,
    itemsData,
    redirectUrl,
    selectedCountry,
    city,
    postalCode,
    selectedState,
    address,
    street,
    currency,
  } = req.body;


  if (!Array.isArray(itemsData)) {
    var arrayItemsData = [itemsData];
  } else {
    arrayItemsData = itemsData;
  }

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: email,
        currency: currency,
        amount: amount * 100,
        metadata: {
          productData: arrayItemsData,
          email,
          name: fullName,
          country: selectedCountry,
          city: city,
          postalCode: postalCode,
          state: selectedState,
          address,
          street,
          currency: currency,
        },
        callback_url: redirectUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      status: "success",
      message: "Payment initialized successfully",
      data: response.data.data,
    });
  } catch (error: any) {
    console.error(error)
    res.status(500).json({
      status: "error",
      message: "An error occurred while initializing payment",
      error: error.message,
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { reference } = req.params;
  const userId = req.user.userId;
  const user = await Customer.findById(userId);

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const { status, data } = response.data;
    const metaData = data.metadata;
    const productData = data.metadata.productData;

    if (status && data.status === "success") {
      const products = productData.map((data: any) => ({
        productId: data.productId,
        quantity: data.quantity,
        price: data.amount,
      }));
      const newPayment = new Order({
        user: userId,
        email: metaData.email,
        name: metaData.name,
        currency: metaData.currency,
        shippingAddress: {
          country: metaData.country.label,
          city: metaData.city,
          state: metaData.state.label,
          address: metaData.address,
          street: metaData.street,
          postalCode: metaData.postalCode,
        },
        item: products,
        totalAmount: data.amount / 100,
        paymentReference: reference,
        paymentStatus: "successful",
        paymentGateway: "Paystack",
        transactionDate: new Date(),
        callbackUrl: data.callback_url || "",
      });
      if (metaData.currency == 'NGN'){
    await SalesStats.findOneAndUpdate(
        {},
        {
          $inc: {
            totalNairaRevenue: data.amount / 100,
            totalOrders: 1,
          },
        },
        { upsert: true }
      );       
      }
      else if (metaData.currency == 'USD'){
         await SalesStats.findOneAndUpdate(
        {},
        {
          $inc: {
            totalDollarRevenue: data.amount / 100,
            totalOrders: 1,
          },
        },
        { upsert: true }
      );    
      }
   

      await newPayment.save();

      for (const product of products) {
        const item = await Product.findById(product.productId);
        if (item) {
          item.quantity -= product.quantity;

          if (item.quantity <= 0) {
            item.quantity = 0;
            item.status = "out of stock";
          } else if (item.quantity <= 20) {
            item.status = "low stock";
          }
          await item.save();
        }
        else{
          console.error("Product not found:", product.productId);
        }
      }

      user.cart = [];
      await user.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false, // Disable strict certificate validation
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user?.email,
        subject: "Payment Successful",
        text: `Your payment with reference ${reference} has been verified successfully.`,
        html: `<p>Your payment with reference <strong>${reference}</strong> has been verified successfully.</p>`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        status: "success",
        message: "Payment verified and saved successfully, check email",
        payment: newPayment,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Payment verification failed",
        data: data,
      });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while verifying payment",
      error: error.message,
    });
  }
};
