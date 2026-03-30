import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default function middleware(request) {
  const token = request.cookies.get("adminToken")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }
}

export const config = {
  matcher: ["/admin"],
};