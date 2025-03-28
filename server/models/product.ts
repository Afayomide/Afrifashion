import mongoose from "mongoose"
const ProductSchema = new mongoose.Schema(
    {
       name: {
        type: String
       },
       color: {
        type: String
       },
       type:{
        type: String
       },
       gender:{
        type: String
       },
       image:{
        type: String
       },
       new: {
        type: Boolean
       },
       tribe: {
        type: String
       },
       price: {
        type: Number
       },
       quantity:{
        type: Number
       },
       description:{
        type: [String]
       },
       instructions:{
        type: [String]
       },
       reviews: {
        type: [String]
       },
       outOfStock: {
        type: Boolean
       }
    }
)

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product