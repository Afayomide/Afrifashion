const axios = require('axios')
require('dotenv').config();
const Customer =  require("../../models/customer");
const Clothes = require("../../models/clothesSchema")
const Payment = require("../../models/payment")
const nodemailer = require("nodemailer")
const PAYSTACK_SECRET_KEY = process.env.paystack_secret_key;
import { Request,Response } from "express";

export const pay = async (req:Request, res:Response) => {
    const { email,fullName, amount,clothesData, redirectUrl, selectedCountry, selectedState, address } = req.body;
  
    if (!Array.isArray(clothesData)) {
        var arrayClothesData = [clothesData];
    }
    else{
        arrayClothesData = clothesData
    }
    
    try {
        const response = await axios.post('https://api.paystack.co/transaction/initialize', 
        {
            email: email,
            amount: amount * 100,
            metadata: {
                clothesData: arrayClothesData,                
                email,
                name: fullName,
                country: selectedCountry, 
                state: selectedState, 
                address
            },
            callback_url: redirectUrl
        }, 
        {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });
  
        res.status(200).json({
            status: 'success',
            message: 'Payment initialized successfully',
            data: response.data.data
        });
        console.log(response)
  
    } catch (error:any) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while initializing payment',
            error: error.message
        });
    }
  }


export const verifyPayment = async (req:Request, res:Response) => {
    const { reference } = req.params;
    const userId = req.user.userId;
          const user = await Customer.findById(userId)

    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, 
        {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            }
        });
        const { status, data } = response.data;
        const metaData = data.metadata 
        const clothesData = data.metadata.clothesData;
        console.log(clothesData)

        if (status && data.status === 'success') {
            const fabrics = clothesData.map((data:any)=> ({
                fabricId: data.clothesId,
                quantity: data.quantity,
                price: data.amount 
            }))
            const newPayment = new Payment({
                user: userId,
                email: metaData.email,
                name: metaData.name,
                country: metaData.country.label,
                state: metaData.state.label,
                address: metaData.address,
                clothes: fabrics,
                totalAmount: data.amount / 100, 
                paymentReference: reference,
                paymentStatus: 'successful',
                paymentGateway: 'Paystack',
                transactionDate: new Date(),
                callbackUrl: data.callback_url || ''
            });

            await newPayment.save();

            for (const fabric of fabrics) {
                const fabricItem = await Clothes.findById(fabric.fabricId);
                if (fabricItem) {
                    fabricItem.quantity -= fabric.quantity;
                    
                    if (fabricItem.quantity <= 0) {
                        fabricItem.quantity = 0;
                        fabricItem.outOfStock = true
                    }        
                    await fabricItem.save();
                }
            }

            user.cart = []
            await user.save()



            const transporter = nodemailer.createTransport({
                service: 'gmail', 
                auth: {
                    user: process.env.EMAIL_USER, 
                    pass: process.env.EMAIL_PASS, 
                },
                tls: {
                    rejectUnauthorized: false // Disable strict certificate validation
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER, 
                to: user?.email, 
                subject: 'Payment Successful',
                text: `Your payment with reference ${reference} has been verified successfully.`,
                html: `<p>Your payment with reference <strong>${reference}</strong> has been verified successfully.</p>`,
            };

            await transporter.sendMail(mailOptions);
            
 res.status(200).json({
                status: 'success',
                message: 'Payment verified and saved successfully, check email',
                payment: newPayment
            });

           


        } else {
            res.status(400).json({
                status: 'error',
                message: 'Payment verification failed',
                data: data
            });
        }
  
    } catch (error:any) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while verifying payment',
            error: error.message
        });
    }
  }