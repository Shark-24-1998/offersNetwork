import { db } from "@/db";
import { users } from "@/db/schema";
import { adminAuth } from "@/lib/firebase-admin";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }

    const decoded = await adminAuth.verifyIdToken(body.token);

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, decoded.uid));

    if (existing.length === 0) {
      await db.insert(users).values({
        id: randomUUID(),
        firebaseUid: decoded.uid,
        email: decoded.email ?? "",
        name: decoded.name ?? "",
        avatarUrl: decoded.picture ?? "",
      });
    } else {
      await db
        .update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.firebaseUid, decoded.uid));
    }

    const sessionToken = await new SignJWT({ uid: decoded.uid })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const res = NextResponse.json({ ok: true });

    res.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
