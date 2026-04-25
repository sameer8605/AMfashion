import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  consumed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

if (process.env.NODE_ENV === "development" && mongoose.models?.Otp) {
  try {
    mongoose.deleteModel("Otp");
  } catch {
    // ignore
  }
}

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
