import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await connectDB();

    // Check if user is authenticated
    const token = req.cookies.get("userToken")?.value;
    if (!token || !JWT_SECRET) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.sub) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const orders = await Order.find({ user: payload.sub })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { error: "Unable to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { items, total, paymentMethod, contactPhone, address } = await req.json();

    if (!Array.isArray(items) || items.length === 0 || !total) {
      return NextResponse.json(
        { success: false, error: "Please provide cart items and order total." },
        { status: 400 }
      );
    }

    if (!paymentMethod || !["COD", "RAZORPAY"].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, error: "A valid payment method is required." },
        { status: 400 }
      );
    }

    if (!contactPhone || typeof contactPhone !== "string") {
      return NextResponse.json(
        { success: false, error: "A valid contact phone is required." },
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

    const order = await Order.create({
      user: userId,
      items: items.map((item) => ({
        _id: item._id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0,
        selectedSize: item.selectedSize || null,
      })),
      total: Number(total),
      paymentMethod,
      status: paymentMethod === "COD" ? "confirmed" : "pending",
      contactPhone: contactPhone.trim(),
      address: {
        name: address.name.trim(),
        street: address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
      },
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
    console.error("Order create error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to save order." },
      { status: 500 }
    );
  }
}
