import mongoose, { Document } from "mongoose";

export enum ProductGender {
  MALE = "Male",
  FEMALE = "Female",
  UNISEX = "Unisex",
}
export enum ProductCategory {
  ANKARA = "ankara",
  ASO_OKE = "aso-oke",
  DANSIKI = "dansiki",
  LACE = "lace",
}
export enum ProductType {
  FABRIC = "fabric",
  CLOTHING = "clothing",
  ACCESSORY = "accessory",
  FOOTWEAR = "footwear",
}
export enum AfricanTribe {
  YORUBA = "yoruba",
  IGBO = "igbo",
  HAUSA = "hausa",
  FULANI = "fulani",
  EFIK = "efik",
  IBIBIO = "ibibio",
  TIVS = "tivs",
  OTHER = "other",
}
interface IProduct extends Document {
  name: string;
  category: ProductCategory;
  color: string;
  type: ProductType;
  gender: ProductGender;
  images: string[];
  new: boolean;
  tribe: AfricanTribe;
  price: number;
  quantity: number;
  description: string[];
  instructions: string[];
  reviews: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema(
  {
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
        values: Object.values(ProductCategory),
        message: `Category must be one of: ${Object.values(
          ProductCategory
        ).join(", ")}`,
      },
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["in stock", "low stock", "out of stock"],
        message: "Status must be either: in stock, low stock, or out of stock",
      },
      default: "in stock",
    },
    color: {
      type: String,
      trim: true,
      lowercase: true, // Standardize color values
      index: true, // Add index for color filtering
    },
    type: {
      type: String,
      enum: {
        values: Object.values(ProductType),
        message: `Type must be one of: ${Object.values(ProductType).join(
          ", "
        )}`,
      },
      index: true,
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(ProductGender),
        message: `Gender must be one of: ${Object.values(ProductGender).join(
          ", "
        )}`,
      },
      default: ProductGender.UNISEX,
      index: true,
    },
    images: {
      type: [String],
    },
    new: {
      type: Boolean,
    },
    tribe: {
      type: String,
      enum: {
        values: Object.values(AfricanTribe),
        message: `Tribe must be one of: ${Object.values(AfricanTribe).join(
          ", "
        )}`,
      },
      default: AfricanTribe.OTHER,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Product = mongoose.model<IProduct>("Product", ProductSchema);

module.exports = Product;
