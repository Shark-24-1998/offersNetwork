
import { db } from "@/db";
import { callbacks } from "@/db/schema";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const body = await req.json();

    const {
        propertyId,
        offerId,
        userId,
        level
    } = body

    if (!propertyId || !offerId || !userId || typeof level !== "number") {
        return NextResponse.json(
            { error: "Invalid callback payload" },
            { status: 400 }
        );
    }

    try {
        await db.insert(callbacks).values({
            id: randomUUID(),
            propertyId,
            offerId,
            userId,
            level
        })
    }  catch (err: unknown) {
  if (
    err instanceof Error &&
    err.message.includes("duplicate key")
  ) {
    return NextResponse.json(
      { ok: true, duplicate: true },
      { status: 200 }
    );
  }

  console.error("CALLBACK ERROR:", err);
  return NextResponse.json(
    { error: "Callback processing failed" },
    { status: 500 }
  );
}

    return NextResponse.json({ ok: true })
}



