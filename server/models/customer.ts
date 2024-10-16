import mongoose from "mongoose";

const Clothes = require("./clothesSchema");


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
         ref: 'Clothes', // Reference Clothes model     
       }]
    }
)

const Customer = mongoose.model('Customers profile data', CustomerSchema)

module.exports = Customer