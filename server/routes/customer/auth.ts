import { checkAuth, login, logOut, signUp,resetPassword, forgotPassword} from "../../controllers/customer/auth";
import {verifyToken} from "../../verifyToken"

const express = require("express");
const router = express.Router()





router.route('/checkAuth').get(verifyToken, checkAuth);
   
router.route('/login').post(login);
  
  
  
  router.route('/signup').post(signUp);
  
  router.route('/logout').post(logOut);
  router.route("/reset-password/:token").post(resetPassword);
  router.route("/forgot-password").post(forgotPassword);
  
  module.exports = router