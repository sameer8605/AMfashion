import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const { amount, currency = "INR", items, contactPhone } = await req.json();

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: "A valid amount is required for Razorpay checkout." },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, error: "Razorpay credentials are not configured." },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      payment_capture: 1,
      notes: {
        contactPhone: contactPhone || "",
        items: JSON.stringify(items || []),
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay order create error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to create Razorpay order." },
      { status: 500 }
    );
  }
}
