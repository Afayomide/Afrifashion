import express from "express";
import {
  getDashboardStats,
  updateSalesStats,
  updateProductStats,
  updateCustomerStats,
  updateMonthlySales,
  updateAllStats,
} from "../../controllers/admin/stats";
import { protect, restrictToAdmin } from "../../middleware/admin/auth";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);
router.use(restrictToAdmin);

// Get dashboard statistics
router.get("/", getDashboardStats);

// Update individual statistics
router.post("/sales", updateSalesStats);
router.post("/products", updateProductStats);
router.post("/customers", updateCustomerStats);
router.post("/monthly-sales", updateMonthlySales);

// Update all statistics at once
router.post("/update-all", updateAllStats);

export default router;
