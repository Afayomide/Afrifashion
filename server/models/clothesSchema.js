const mongoose = require("mongoose");
const ClothesSchema = new mongoose.Schema(
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
       }
    }
)

const Clothes = mongoose.model('Clothes data', ClothesSchema)

module.exports = Clothes