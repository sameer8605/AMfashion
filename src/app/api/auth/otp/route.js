import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Otp from "@/lib/models/Otp";

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone || typeof phone !== "string" || !/^[0-9]{10}$/.test(phone.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    await connectDB();

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      phone: phone.trim(),
      code,
      expiresAt,
      consumed: false,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent for verification.",
      debugOtp: code,
    });
  } catch (error) {
    console.error("OTP generation error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to generate OTP right now." },
      { status: 500 }
    );
  }
}
