import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Admin from "@/lib/models/Admin";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { userName, email, password } = await req.json();
    ons
    const loginName =userName|| email;

  if (!loginName || !password) {
    return NextResponse.json(
      { success: false, message: "Username and password are required" },
      { status: 400 }
    );
  }

  if (!JWT_SECRET) {
    console.error("JWT_SECRET not configured");
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  await connectDB();

  const admin = await Admin.findOne({ userName: loginName.trim() });
  if (!admin || admin.password !== password) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { role: "admin", sub: String(admin._id) },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  const response = NextResponse.json({ success: true });

  response.cookies.set("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
