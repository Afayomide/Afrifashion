import express from "express";
import "dotenv/config";
import { verifyToken } from "../../middleware/customer/auth";
import {
  addToCart,
  cartList,
  deleteFromCart,
  getCart,
} from "../../controllers/customer/cart";

const router = express.Router();

router.route("/list").get(verifyToken, cartList);

router.route("/").get(verifyToken, getCart);

router.route("/add").post(verifyToken, addToCart);

router.route("/delete").delete(verifyToken, deleteFromCart);

export default router;
