import { db } from "@/db";
import { properties } from "@/db/schema";
import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import "server-only";



const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function POST(req: Request) {
    try {
        //1. Get Session Cookie
        const cookieStore = await cookies();
        const session = cookieStore.get("session");

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Verify session and extract user
        const { payload } = await jwtVerify(session.value, secret);
        const ownerId = payload.uid as string;

        // 3. Parse request body
        const body = await req.json();

        if (!body?.name) {
            return NextResponse.json(
                { error: "Property name is required" },
                { status: 400 }
            );
        }
        // 4. REQUIRED fields (validate, do NOT normalize)
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

        // 5. OPTIONAL fields (normalize)
        const imageLink =
            typeof body.imageLink === "string" && body.imageLink.trim() !== ""
                ? body.imageLink.trim()
                : null;

        const postbackUrl =
            typeof body.postbackUrl === "string" && body.postbackUrl.trim() !== ""
                ? body.postbackUrl.trim()
                : null;


        // 6. Insert property
        const id = randomUUID()
        console.log("POST imageLink RAW:", body.imageLink);
        console.log("POST imageLink NORMALIZED:", imageLink);

        await db.insert(properties).values({
            id,
            ownerId,
            name,
            link,
            imageLink,
            postbackUrl,
        });

        // 7. Respond
        return NextResponse.json({ id }, { status: 201 });


    } catch (err) {
        console.error("CREATE PROPERTY ERROR:", err);
        return NextResponse.json(
            { error: "Failed to create property" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        //1.Get Session Cookie
        const cookieStore = await cookies()
        const session = cookieStore.get("session")

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        //2.Verify session and extract user
        const { payload } = await jwtVerify(session.value, secret);
        const ownerId = payload.uid as string

        // 3. Fetch only owner’s properties
        const result = await db
            .select()
            .from(properties)
            .where(eq(properties.ownerId, ownerId))
            .orderBy(desc(properties.createdAt))

        // 4. Respond
        return NextResponse.json(result);

    } catch (err) {
        console.error("LIST PROPERTIES ERROR:", err);
        return NextResponse.json(
            { error: "Failed to fetch properties" },
            { status: 500 }
        );
    }

}