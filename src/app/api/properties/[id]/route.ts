import { db } from "@/db";
import { properties } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import "server-only";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // 1. Session
        const session = (await cookies()).get("session");
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(session.value, secret);
        const ownerId = payload.uid as string;

        // 2. Parse body
        const body = await req.json();

        // 3. REQUIRED fields
        const name =
            typeof body.name === "string" ? body.name.trim() : "";
        const link =
            typeof body.link === "string" ? body.link.trim() : "";

        if (!name || !link) {
            return NextResponse.json(
                { error: "Name and link are required" },
                { status: 400 }
            );
        }

        // 4. OPTIONAL fields
        const imageLink =
            typeof body.imageLink === "string" && body.imageLink.trim() !== ""
                ? body.imageLink.trim()
                : null;

        const postbackUrl =
            typeof body.postbackUrl === "string" && body.postbackUrl.trim() !== ""
                ? body.postbackUrl.trim()
                : null;

        // 5. Update
        console.log("PUT imageLink RAW:", body.imageLink);
        console.log("PUT imageLink NORMALIZED:", imageLink);

        const result = await db
            .update(properties)
            .set({
                name,
                link,
                imageLink,
                postbackUrl,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(properties.id, id),
                    eq(properties.ownerId, ownerId)
                )
            )
            .returning({ id: properties.id });

        if (result.length === 0) {
            return NextResponse.json(
                { error: "Property not found or not owned by user" },
                { status: 404 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("UPDATE PROPERTY ERROR:", err);
        return NextResponse.json(
            { error: "Failed to update property" },
            { status: 500 }
        );
    }
}


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {

        // 1. Unwrap params (Next.js 16)
        const { id } = await params

        //2.Get Session
        const cookieStore = await cookies();
        const session = cookieStore.get("session");
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        //3.Verify session

        const { payload } = await jwtVerify(session.value, secret)

        const ownerId = payload.uid as string




        // 4. Delete only if owned by user
        const result = await db
            .delete(properties)
            .where(
                and(
                    eq(properties.id, id),
                    eq(properties.ownerId, ownerId)
                )
            )
            .returning({ id: properties.id });

        if (result.length === 0) {
            return NextResponse.json(
                { error: "Property not found or not owned by user" },
                { status: 404 }
            );
        }

        // 5. Respond
        return NextResponse.json({ ok: true });

    } catch (err) {
        console.error("DELETE PROPERTY ERROR:", err);
        return NextResponse.json(
            { error: "Failed to delete property" },
            { status: 500 }
        );
    }

}