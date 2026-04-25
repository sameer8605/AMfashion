import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Check if user is authenticated
    const token = req.cookies.get("userToken")?.value;
    if (!token || !JWT_SECRET) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.sub) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const order = await Order.findOne({ _id: id, user: payload.sub }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Unable to fetch order details" },
      { status: 500 }
    );
  }
}
