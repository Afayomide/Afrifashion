import mongoose from "mongoose";
import Product from "../models/product";
import "dotenv/config";

const dburl = process.env.dburl || "";

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

async function generateSlugs() {
  try {
    await mongoose.connect(dburl);
    console.log("Connected to Database");

    const products = await Product.find({ slug: { $exists: false } });
    console.log(`Found ${products.length} products without slugs`);

    for (const product of products) {
      let baseSlug = generateSlug(product.name);
      let slug = baseSlug;
      let count = 1;

      // Ensure uniqueness
      while (await Product.findOne({ slug, _id: { $ne: product._id } })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }

      product.slug = slug;
      await product.save();
      console.log(`Generated slug for ${product.name}: ${slug}`);
    }

    console.log("Slug generation complete");
    process.exit(0);
  } catch (error) {
    console.error("Error generating slugs:", error);
    process.exit(1);
  }
}

generateSlugs();
