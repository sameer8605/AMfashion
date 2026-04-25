import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

function verifySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  return expected === razorpay_signature;
}

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      total,
      contactPhone,
      address,
      name,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Incomplete Razorpay response." },
        { status: 400 }
      );
    }

    if (!RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret is not configured." },
        { status: 500 }
      );
    }

    if (!verifySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature })) {
      return NextResponse.json(
        { success: false, error: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    if (!address || !address.name || !address.street || !address.city || !address.state || !address.pincode) {
      return NextResponse.json(
        { success: false, error: "Complete address details are required." },
        { status: 400 }
      );
    }

    await connectDB();

    let userId = null;
    const token = req.cookies.get("userToken")?.value;
    if (token && JWT_SECRET) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        userId = payload?.sub || null;
      } catch (error) {
        console.warn("Unable to decode user token:", error);
      }
    }

    if (!Array.isArray(items) || items.length === 0 || !total) {
      return NextResponse.json(
        { success: false, error: "Order details are missing." },
        { status: 400 }
      );
    }

    const order = await Order.create({
      user: userId,
      items: items.map((item) => ({
        _id: item._id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0,
      })),
      total: Number(total),
      paymentMethod: "RAZORPAY",
      status: "paid",
      contactPhone: contactPhone || name || "",
      address: {
        name: address.name.trim(),
        street: address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
      },
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    // Update user's address if user is logged in
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $set: {
          address: {
            street: address.street.trim(),
            city: address.city.trim(),
            state: address.state.trim(),
            pincode: address.pincode.trim(),
          },
          name: address.name.trim() || undefined,
        }
      }, { upsert: false });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay confirm error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to complete payment confirmation." },
      { status: 500 }
    );
  }
}
