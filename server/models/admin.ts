import mongoose from "mongoose"


const AdminSchema = new mongoose.Schema(
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
  
    }
)

const Admin = mongoose.model('Admins profile data', AdminSchema)

module.exports = Admin