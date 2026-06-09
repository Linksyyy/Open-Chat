import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(token ? "/chats" : "/home", request.url));
  }

  if (pathname.startsWith("/chats")) {
    if (!token) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
    } catch {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}
