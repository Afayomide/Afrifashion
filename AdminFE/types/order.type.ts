import {Types} from "mongoose"

type MongoId = Types.ObjectId;


import { ICustomer } from "./customer.type"; 

export interface IProductItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder {
  _id: MongoId;
  user: ICustomer; // Updated to represent a populated customer field
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
  trackingNumber: string;
  notes?: string;
}
