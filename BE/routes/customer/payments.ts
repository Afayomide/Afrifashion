import express from "express";
import "dotenv/config";
import { verifyToken } from "../../middleware/customer/auth";
import { pay, verifyPayment } from "../../controllers/customer/payment";

const router = express.Router();

router.route("/pay").post(verifyToken, pay);

router.route("/verify/:reference").get(verifyToken, verifyPayment);

export default router;
