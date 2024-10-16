import {
  addToCart,
  cartList,
  deleteFromCart,
  getCart,
} from "../../controllers/customer/cart";
const express = require("express");
const router = express.Router();
require("dotenv").config();
const { verifyToken } = require("../../verifyToken");

router.route("/list").get(verifyToken, cartList);

router.route("/").get(verifyToken, getCart);

router.route("/add").post(verifyToken, addToCart);

router.route("/delete").delete(verifyToken, deleteFromCart);

module.exports = router;
