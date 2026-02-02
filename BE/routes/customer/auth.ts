import express from "express";
import { checkAuth, login, logOut, signUp,resetPassword, forgotPassword} from "../../controllers/customer/auth";
import {verifyToken} from "../../middleware/customer/auth"

const router = express.Router()

router.route('/checkAuth').get(verifyToken, checkAuth);
   
router.route('/login').post(login);
  
  router.route('/signup').post(signUp);
  
  router.route('/logout').post(logOut);
  router.route("/reset-password/:token").post(resetPassword);
  router.route("/forgot-password").post(forgotPassword);
  
  export default router;