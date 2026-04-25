import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  // Optional descriptive specs
  color: String,
  fabric: String,
  sizes: {
    type: [String],
    default: [],
  },
  productDetails: String,
  // Legacy primary URL; mirrors images[0] for new products
  image: String,
  images: {
    type: [String],
    default: [],
    validate: {
      validator(arr) {
        return !arr || arr.length <= 4;
      },
      message: "A product can have at most 4 images",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// In development, Next.js hot reload can keep a cached Mongoose model from an
// older schema so new paths like `images` never get saved — only `image` works.
if (process.env.NODE_ENV === "development" && mongoose.models?.Product) {
  try {
    mongoose.deleteModel("Product");
  } catch {
    /* ignore */
  }
}

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);