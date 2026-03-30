import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log("🔍 Middleware triggered for:", pathname);

  // Protect admin routes (except login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("adminToken")?.value;
    
    console.log("🔐 Admin route protection check");
    console.log("🔑 Token found:", !!token);

    if (!token) {
      console.log("❌ No token, redirecting to login");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    console.log("✅ Token exists, allowing access");
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
