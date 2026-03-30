import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  categoryId: Number,
  categoryName: String, // used in code (tshirt)
  label: String,        // shown in UI (T-Shirts)
});

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);