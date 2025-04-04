import mongoose, { Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  color: string;
  type: string;
  gender: string;
  image: string;
  new: boolean;
  tribe: string;
  price: number;
  quantity: number;
  description: string[];
  instructions: string[];
  reviews: string[];
  outOfStock: boolean;
  material: string;
}

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A product must have a name"],
    trim: true,
    maxlength: [100, "A product name cannot be more than 100 characters"],
  },
  category: {
    type: String,
    required: [true, "A product must have a category"],
    enum: {
      values: ["Ankara", "Aso Oke", "Dansiki", "Lace"],
      message: "Category must be either: Ankara, Aso Oke, Dansiki, or Lace",
    },
  },
  outOfStock: {
    type: Boolean,
    default: "false",
  },
  color: {
    type: String,
  },
  type: {
    type: String,
  },
  gender: {
    type: String,
  },
  image: {
    type: String,
  },
  new: {
    type: Boolean,
  },
  tribe: {
    type: String,
  },
  material: {
    type: String,
    default: "cotton"
  },
  price: {
    type: Number,
    required: [true, "A product must have a price"],
    min: [0, "Price must be above 0"],
  },
  quantity: {
    type: Number,
  },
  description: {
    type: [String],
  },
  instructions: {
    type: [String],
  },
  reviews: {
    type: [String],
  },
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);

module.exports = Product;
