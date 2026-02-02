import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Order from "../../models/order";
import  Product  from "../../models/product";
import  Customer  from "../../models/customer";

// @desc    Get sales statistics
// @route   GET /api/dashboard/sales
// @access  Private/Admin
export const getSalesStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get date range from query params or use default (last 6 months)
    const { startDate, endDate } = req.query;

    let dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        },
      };
    } else {
      // Default to last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      dateFilter = {
        createdAt: { $gte: sixMonthsAgo },
      };
    }

    // Get monthly sales data
    const monthlySales = await Order.aggregate([
      { $match: { ...dateFilter, status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalSales: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalSales: 1,
          count: 1,
        },
      },
    ]);

    // Get total sales
    const totalSales = await Order.aggregate([
      { $match: { ...dateFilter, status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get sales by payment method
    const salesByPaymentMethod = await Order.aggregate([
      { $match: { ...dateFilter, status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: "$paymentMethod",
          totalSales: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          paymentMethod: "$_id",
          totalSales: 1,
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        monthlySales,
        totalSales:
          totalSales.length > 0 ? totalSales[0] : { totalSales: 0, count: 0 },
        salesByPaymentMethod,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product statistics
// @route   GET /api/dashboard/products
// @access  Private/Admin
export const getProductStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get product stats by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalStock: { $sum: "$stock" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
          totalStock: 1,
        },
      },
    ]);

    // Get low stock products
    const lowStockThreshold = 10; // Define what "low stock" means
    const lowStockProducts = await Product.find({
      stock: { $lte: lowStockThreshold },
    })
      .select("name category stock price")
      .sort("stock")
      .limit(10);

    // Get out of stock products count
    const outOfStockCount = await Product.countDocuments({ stock: 0 });

    res.status(200).json({
      status: "success",
      data: {
        productsByCategory,
        lowStockProducts,
        outOfStockCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics
// @route   GET /api/dashboard/orders
// @access  Private/Admin
export const getOrderStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
          totalSales: 1,
        },
      },
    ]);

    // Get average order value
    const averageOrderValue = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: null,
          averageValue: { $avg: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        ordersByStatus,
        averageOrderValue:
          averageOrderValue.length > 0 ? averageOrderValue[0].averageValue : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer statistics
// @route   GET /api/dashboard/customers
// @access  Private/Admin
export const getCustomerStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get total customers
    const totalCustomers = await Customer.countDocuments();

    // Get new customers in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newCustomers = await Customer.countDocuments({
      role: "customer",
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get customers with orders
    const customersWithOrders = await Order.aggregate([
      {
        $group: {
          _id: "$customer",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      {
        $unwind: "$customerInfo",
      },
      {
        $project: {
          _id: 0,
          customerId: "$_id",
          name: "$customerInfo.name",
          email: "$customerInfo.email",
          orderCount: 1,
          totalSpent: 1,
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalCustomers,
        newCustomers,
        customersWithOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent orders
// @route   GET /api/dashboard/recent-orders
// @access  Private/Admin
export const getRecentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

            console.log("called", req.body);

  try {
    const limit = Number.parseInt(req.query.limit as string) || 5;

    // Ensure the query does not attempt to cast invalid values
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort("-createdAt")
      .limit(limit);



    res.status(200).json({
      status: "success",
      results: recentOrders.length,
      data: {
        orders: recentOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    next(error);
  }
};

// @desc    Get top selling products
// @route   GET /api/dashboard/top-products
// @access  Private/Admin
export const getTopSellingProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = Number.parseInt(req.query.limit as string) || 5;

    // Aggregate order items to find top selling products
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$productInfo.name",
          category: "$productInfo.category",
          price: "$productInfo.price",
          totalSold: 1,
          revenue: 1,
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
    ]);

    res.status(200).json({
      status: "success",
      results: topProducts.length,
      data: {
        products: topProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};
