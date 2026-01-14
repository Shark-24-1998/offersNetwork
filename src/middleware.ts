import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!login|api/auth|_next|favicon.ico).*)"],
};
