import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

if (process.env.NODE_ENV === "development" && mongoose.models?.User) {
  try {
    mongoose.deleteModel("User");
  } catch {
    // ignore
  }
}

export default mongoose.models.User || mongoose.model("User", UserSchema);
