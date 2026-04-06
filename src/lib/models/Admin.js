import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

export default mongoose.models.Admin ||
  mongoose.model("Admin", AdminSchema);