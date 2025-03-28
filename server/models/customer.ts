import mongoose from "mongoose";

const Product = require("./product");


const CustomerSchema = new mongoose.Schema(
    {
       fullname: {
        type: String
       },
       username: {
        type: String
       },
       email:{
        type: String
       },
       password:{
        type: String
       },
       cart:[{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Product', // Reference Clothes model     
       }]
    }
)

const Customer = mongoose.model('Customers', CustomerSchema)

module.exports = Customer