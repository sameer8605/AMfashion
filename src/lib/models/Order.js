import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      selectedSize: String,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "RAZORPAY"],
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  contactPhone: {
    type: String,
    required: true,
  },
  address: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

if (process.env.NODE_ENV === "development" && mongoose.models?.Order) {
  try {
    mongoose.deleteModel("Order");
  } catch {
    // ignore
  }
}

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
