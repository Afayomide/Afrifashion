import { checkAuth, login, logOut, signUp } from "../../controllers/customer/auth";
import {verifyToken} from "../../verifyToken"

const express = require("express");
const router = express.Router()





router.route('/checkAuth').get(verifyToken, checkAuth);
   
router.route('/login').post(login);
  
  
  
  router.route('/signup').post(signUp);
  
  router.route('/logout').post(logOut);

  module.exports = router