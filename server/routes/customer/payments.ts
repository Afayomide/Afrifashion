const express = require("express");
const router = express.Router();
require("dotenv").config();
const { verifyToken } = require("../../verifyToken");

import { pay, verifyPayment } from "../../controllers/customer/payment";

router.post("/pay").get(verifyToken, pay);

router.route("/verify/:reference").get(verifyToken, verifyPayment);

module.exports = router;
