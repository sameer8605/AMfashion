import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Otp from "@/lib/models/Otp";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { phone, otp, name } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: "Phone number and OTP are required." },
        { status: 400 }
      );
    }

    if (!JWT_SECRET) {
      return NextResponse.json(
        { success: false, error: "Server not configured for authentication." },
        { status: 500 }
      );
    }

    await connectDB();

    const otpRecord = await Otp.findOne({
      phone: phone.trim(),
      code: otp.trim(),
      consumed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP." },
        { status: 401 }
      );
    }

    otpRecord.consumed = true;
    await otpRecord.save();

    const user = await User.findOneAndUpdate(
      { phone: phone.trim() },
      {
        phone: phone.trim(),
        name: name?.trim() || undefined,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const token = jwt.sign({ sub: String(user._id), phone: user.phone }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        _id: String(user._id),
        phone: user.phone,
        name: user.name || "",
      },
    });

    response.cookies.set("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Auth verify error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to verify OTP." },
      { status: 500 }
    );
  }
}
