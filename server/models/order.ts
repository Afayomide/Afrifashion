import mongoose, { Document, Schema } from "mongoose";

interface IProductItem {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  name?: string;
  items: IProductItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: "Credit Card" | "PayPal" | "Bank Transfer";
  totalAmount: number;
  paymentReference: string;
  paymentStatus: "pending" | "successful" | "failed" | "refunded";
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentGateway?: string;
  transactionDate?: Date;
  callbackUrl?: string;
  trackingNumber?: string;
  notes?: string;
}

const OrderSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  shippingAddress: {
    street: {
      type: String,
      required: [true, "Shipping address must have a street"],
    },
    city: {
      type: String,
      required: [true, "Shipping address must have a city"],
    },
    state: {
      type: String,
      required: [true, "Shipping address must have a state"],
    },
    postalCode: {
      type: String,
      required: [true, "Shipping address must have a postal code"],
    },
    country: {
      type: String,
      required: [true, "Shipping address must have a country"],
    },
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "PayPal", "Bank Transfer"],
    required: [false, "Order must have a payment method"],
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentReference: {
    type: String,
    required: true,
    unique: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "successful", "failed"],
    default: "pending",
  },
  paymentGateway: {
    type: String,
    default: "Paystack",
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  callbackUrl: {
    type: String,
  },
  trackingNumber: String,
  notes: String,
});

const Order = mongoose.model<IOrder>("Order", OrderSchema);

module.exports = Order
