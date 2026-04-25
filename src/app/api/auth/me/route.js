import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    const token = req.cookies.get("userToken")?.value;
    if (!token || !JWT_SECRET) {
      return NextResponse.json({ user: null });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.sub) {
      return NextResponse.json({ user: null });
    }

    await connectDB();
    const user = await User.findById(payload.sub).lean();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        _id: String(user._id),
        phone: user.phone,
        name: user.name || "",
        address: user.address || {},
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ user: null });
  }
}
