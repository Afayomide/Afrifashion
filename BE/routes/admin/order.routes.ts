import express from "express";
import {
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getOrdersByCustomer,
} from "../../controllers/admin/order";
import { protect, restrictToAdmin } from "../../middleware/admin/auth";
import { validateOrderStatus } from "../../middleware/admin/validation";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);
router.use(restrictToAdmin);

// Get all orders
router.route("/").get(getAllOrders);

// Get orders by customer
router.get("/customer/:customerId", getOrdersByCustomer);

// Get, update, and delete order by ID
router.route("/:id").get(getOrderById).patch(updateOrder).delete(deleteOrder);

// Update order status
router.patch("/:id/status", validateOrderStatus, updateOrderStatus);

export default router;
