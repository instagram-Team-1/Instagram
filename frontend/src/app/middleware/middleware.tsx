import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;



  const protectedPaths = ["/Home", "/profile", "/Home/*"];


  if (pathname === "/login" && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.redirect(new URL("/Home", request.url));
    } catch (err) {

    }
  }


  if (protectedPaths.some((path) => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/Home", "/profile/:path*", "/settings/:path*"],
};
