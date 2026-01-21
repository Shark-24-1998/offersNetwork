import { db } from "@/db";
import { properties } from "@/db/schema";
import { requireUser } from "@/lib/auth-server";
import { and, eq } from "drizzle-orm";

import { NextResponse } from "next/server";

import "server-only";


//Update data 
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

       const { uid : ownerId} = await requireUser()
        // 2. Parse body
        const body = await req.json();

        // 3. REQUIRED fields
        const name =
            typeof body.name === "string" ? body.name.trim() : "";
        const link =
            typeof body.link === "string" ? body.link.trim() : "";

        if (!name || !link || name === '""' || link === '""') {
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

//Delete data 
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {

        // 1. Unwrap params (Next.js 16)
        const { id } = await params

        const { uid : ownerId } = await requireUser()




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