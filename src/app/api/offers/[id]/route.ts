import { db } from "@/db"
import { offers } from "@/db/schema"
import { requireUser } from "@/lib/auth-server"
import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import "server-only"

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { uid: ownerId } = await requireUser()
        const body = await req.json()

        const title =
            typeof body.title === "string" ? body.title.trim() : "";
        const link =
            typeof body.link === "string" ? body.link.trim() : "";

        if (!title || !link) {
            return NextResponse.json(
                { error: "Title and link are required" },
                { status: 400 }
            );
        }

        if (!Array.isArray(body.tierWiseSteps)) {
            return NextResponse.json(
                { error: "Invalid tier steps" },
                { status: 400 }
            );
        }

        const result = await db
            .update(offers)
            .set({
                title,
                link,
                tierWiseSteps: body.tierWiseSteps,
                includedCountries: body.includedCountries ?? [],
                excludedCountries: body.excludedCountries ?? [],
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(offers.id, id),
                    eq(offers.ownerId, ownerId)
                )
            )
            .returning({ id: offers.id });

        if (result.length === 0) {
            return NextResponse.json(
                { error: "Offer not found or not owned by user" },
                { status: 404 }
            );
        }

        return NextResponse.json({ ok: true });

    } catch (err) {
        console.error("UPDATE OFFER ERROR:", err);
        return NextResponse.json(
            { error: "Failed to update offer" },
            { status: 500 }
        );
    }

}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { uid: ownerId } = await requireUser();

        const result = await db
            .delete(offers)
            .where(
                and(
                    eq(offers.id, id),
                    eq(offers.ownerId, ownerId)
                )
            )
            .returning({ id: offers.id })

        if (result.length === 0) {
            return NextResponse.json(
                { error: "Offer not found or not owned by user" },
                { status: 404 }
            );
        }

        return NextResponse.json({ ok: true });

    } catch (err) {
        console.error("DELETE OFFER ERROR:", err);
        return NextResponse.json(
            { error: "Failed to delete offer" },
            { status: 500 }
        );
    }


}