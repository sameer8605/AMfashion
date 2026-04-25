import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";

const JWT_SECRET = process.env.JWT_SECRET;

async function verifyAdmin(req) {
  const token = req.cookies.get("adminToken")?.value;
  if (!token || !JWT_SECRET) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
}

export async function GET(req, { params }) {
  try {
    if (!(await verifyAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Admin order detail fetch error:", error);
    return NextResponse.json(
      { error: "Unable to fetch order detail" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    if (!(await verifyAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Admin order status update error:", error);
    return NextResponse.json(
      { error: "Unable to update order status" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    if (!(await verifyAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Admin order delete error:", error);
    return NextResponse.json(
      { error: "Unable to delete order" },
      { status: 500 }
    );
  }
}
