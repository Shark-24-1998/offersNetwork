import { db } from "@/db";
import { offers } from "@/db/schema";
import { requireUser } from "@/lib/auth-server"
import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import "server-only"

export async function POST(req: Request) {
    try {
        const { uid: ownerId } = await requireUser();
        const body = await req.json();

        const title =
            typeof body.title === "string" ? body.title.trim() : "";
        const link =
            typeof body.link === "string" ? body.link.trim() : "";

        if (!title || !link) {
            return NextResponse.json(
                { error: "Title and link are required" },
                { status: 400 }
            )
        }

        if (!Array.isArray(body.tierWiseSteps) || body.tierWiseSteps.length === 0) {
            return NextResponse.json(
                { error: "Tier wise steps are required" },
                { status: 400 }
            );
        }

        if (!Array.isArray(body.includedCountries)) {
            return NextResponse.json(
                { error: "Included countries must be an array" },
                { status: 400 }
            );
        }

        const excludedCountries = Array.isArray(body.excludedCountries)
            ? body.excludedCountries
            : [];

        const id = randomUUID();

        await db.insert(offers).values({
            id,
            ownerId,
            title,
            link,
            tierWiseSteps: body.tierWiseSteps,
            includedCountries: body.includedCountries,
            excludedCountries,
        })

        return NextResponse.json({ id }, { status: 201 })
    } catch (err) {
        console.error("CREATE OFFER ERROR:", err);
        return NextResponse.json(
            { error: "Failed to create offer" },
            { status: 500 }
        );
    }
}

export async function GET() {

    try {
        const { uid: ownerId } = await requireUser();

        const list = await db
            .select()
            .from(offers)
            .where(eq(offers.ownerId, ownerId))
            .orderBy(desc(offers.createdAt))

        return NextResponse.json(list)
    } catch (err) {
        console.error("LIST OFFERS ERROR:", err);
        return NextResponse.json(
            { error: "Failed to fetch offers" },
            { status: 500 }
        );
    }

}