import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

console.log(ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET);

export async function POST(req) {
  
  try {
    const { userName, password } = await req.json();
console.log("INPUT:", userName, password);
    if (userName !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      console.log("credentials invalid");
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("credentials valid, creating token");

    const token = jwt.sign(
      { role: "admin" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("🎫 Token created successfully");

    const response = NextResponse.json({ 
      success: true, 
      message: "Login successful" 
    });

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 86400, // 1 day
    });

    console.log("🍪 Cookie set, returning response");
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
