import mongoose, { Document, Types } from "mongoose";
import Product from "./product";

export interface ICustomer extends Document {
  fullname?: string;
  username?: string;
  email?: string;
  password?: string;
  cart: Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const CustomerSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference Clothes model
    },
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const Customer = mongoose.model<ICustomer>('Customers', CustomerSchema)

export default Customer;