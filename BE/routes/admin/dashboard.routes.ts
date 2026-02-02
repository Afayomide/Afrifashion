import express from "express";
import {
  getSalesStats,
  getProductStats,
  getOrderStats,
  getCustomerStats,
  getRecentOrders,
  getTopSellingProducts,
} from "../../controllers/admin/dashboard";
import { protect, restrictToAdmin } from "../../middleware/admin/auth";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);
router.use(restrictToAdmin);

// Dashboard statistics routes
router.get("/sales", getSalesStats);
router.get("/products", getProductStats);
router.get("/orders", getOrderStats);
router.get("/customers", getCustomerStats);
router.get("/recent-orders", getRecentOrders);
router.get("/top-products", getTopSellingProducts);

export default router;
