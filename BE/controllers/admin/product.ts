import type { Request, Response, NextFunction } from "express"
import  Product  from "../../models/product"
import mongoose from "mongoose";
// Custom error class
class AppError extends Error {
  statusCode: number
  status: string
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

// Helper function for API features
class APIFeatures {
  query: any
  queryString: any
  filterObj: any

  constructor(query: any, queryString: any) {
    this.query = query
    this.queryString = queryString
    this.filterObj = {}
  }

  filter() {
    const queryObj = { ...this.queryString }
    const excludedFields = ["page", "sort", "limit", "fields"]
    excludedFields.forEach((el) => delete queryObj[el])

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    this.filterObj = JSON.parse(queryStr)
    this.query = this.query.find(this.filterObj)

    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ")
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort("-createdAt")
    }

    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ")
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select("-__v")
    }

    return this
  }

  paginate() {
    const page = Number.parseInt(this.queryString.page, 10) || 1
    const limit = Number.parseInt(this.queryString.limit, 10) || 100
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// @desc    Get all products
// @route   GET /api/products
// @access  Private/Admin
export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Execute query with features
    const features = new APIFeatures(Product.find(), req.query).filter().sort().limitFields().paginate()

    const products = await features.query
    const total = await Product.countDocuments(features.filterObj)

    // Send response
    res.status(200).json({
      status: "success",
      results: products.length,
      total,
      data: {
        products,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private/Admin
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return next(new AppError("No product found with that ID", 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productData = { ...req.body };
    if (productData.name) {
      productData.slug = generateSlug(productData.name);
      
      // Check if slug already exists and make it unique if necessary
      let slug = productData.slug;
      let count = 1;
      while (await Product.findOne({ slug })) {
        slug = `${productData.slug}-${count}`;
        count++;
      }
      productData.slug = slug;
    }

    const product = await Product.create(productData)
    console.log(productData)

    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

// @desc    Update a product
// @route   PATCH /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productData = { ...req.body };
    if (productData.name) {
      productData.slug = generateSlug(productData.name);
      
      // Check for slug uniqueness, excluding the current product
      let slug = productData.slug;
      let count = 1;
      while (await Product.findOne({ slug, _id: { $ne: new mongoose.Types.ObjectId(req.params.id as string) } })) {
        slug = `${productData.slug}-${count}`;
        count++;
      }
      productData.slug = slug;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true,
    })

    if (!product) {
      return next(new AppError("No product found with that ID", 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return next(new AppError("No product found with that ID", 404))
    }

    res.status(204).json({
      status: "success",
      data: null,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Private/Admin
export const getProductCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
        },
      },
      {
        $sort: { name: 1 },
      },
    ])

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
export const updateProductStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { stock } = req.body

    if (stock === undefined) {
      return next(new AppError("Please provide stock quantity", 400))
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!product) {
      return next(new AppError("No product found with that ID", 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    })
  } catch (error) {
    next(error)
  }
}

