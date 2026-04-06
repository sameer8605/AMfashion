import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Admin from "@/lib/models/Admin";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();

    const { userName, password } = await req.json();
     console.log("Login attempt:", password );
    //  Find admin in DB
    const admin = await Admin.findOne({ userName });
    console.log("Admin found:", admin);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 401 }
      );
    }

    //  Check password
    if (admin.password !== password) {
      return NextResponse.json(
        { success: false, error: "Wrong password" },
        { status: 401 }
      );
    }

    //  Create JWT
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //  Set cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 86400,
    });

    return response;

  } catch (err) {
    console.log("Login error:", err);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}