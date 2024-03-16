const mongoose = require("mongoose");

const Clothes = require("./clothesData");


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
       cart:{
          type: [String]
       }
       
    }
)

const Customer = mongoose.model('Customers profile data', CustomerSchema)

module.exports = Customer