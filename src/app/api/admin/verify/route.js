import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("adminToken")?.value;
    const JWT_SECRET = process.env.JWT_SECRET;

   
    if (!token) {
      console.log("No token found");
      return NextResponse.json(
        { success: false, message: "No token" },
        { status: 401 }
      );
    }

    if (!JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    jwt.verify(token, JWT_SECRET);
    console.log("Token verified successfully");

    return NextResponse.json({ success: true, message: "Token valid" });
  } catch (error) {
    console.error("Token verification error:", error.message);
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}
