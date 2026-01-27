import { db } from "@/db"
import { offers } from "@/db/schema"
import { MaxPerTaskTierWise, TierWiseSteps } from "@/db/types"
import { requireUser } from "@/lib/auth-server"
import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import "server-only"



export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }>}
) {
  try {

    const { uid: ownerId } = await requireUser(); 
    const { id } = await params;
    const body = await req.json();
    console.log("PUT ownerId:", ownerId);
    console.log("PUT offerId:", id);


    /* ---------------- REQUIRED STRING FIELDS ---------------- */

    const title =
      typeof body.title === "string" ? body.title.trim() : "";
    const link =
      typeof body.link === "string" ? body.link.trim() : "";
    const bannerImage =
      typeof body.bannerImage === "string"
        ? body.bannerImage.trim()
        : "";
    const squareImage =
      typeof body.squareImage === "string"
        ? body.squareImage.trim()
        : "";
    const rewardsValue =
      typeof body.rewardsValue === "string"
        ? body.rewardsValue.trim()
        : "";

    if (
      !title ||
      !link ||
      !bannerImage ||
      !squareImage ||
      !rewardsValue
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------------- TIER WISE STEPS ---------------- */

    const tierWiseSteps = body.tierWiseSteps as TierWiseSteps;

    if (
      !tierWiseSteps ||
      typeof tierWiseSteps !== "object" ||
      Array.isArray(tierWiseSteps)
    ) {
      return NextResponse.json(
        { error: "Invalid tierWiseSteps format" },
        { status: 400 }
      );
    }

    for (const [tier, steps] of Object.entries(tierWiseSteps)) {
      if (!Array.isArray(steps) || steps.length === 0) {
        return NextResponse.json(
          { error: `Tier ${tier} must have steps` },
          { status: 400 }
        );
      }

      for (const step of steps) {
        if (
          typeof step.title !== "string" ||
          !step.title.trim() ||
          typeof step.coins !== "number" ||
          step.coins <= 0
        ) {
          return NextResponse.json(
            { error: `Invalid step in tier ${tier}` },
            { status: 400 }
          );
        }
      }
    }

    /* ---------------- MAX PER TASK ---------------- */

    const maxPerTaskTierWise =
      body.maxPerTaskTierWise as MaxPerTaskTierWise;

    if (
      !maxPerTaskTierWise ||
      typeof maxPerTaskTierWise !== "object" ||
      Array.isArray(maxPerTaskTierWise)
    ) {
      return NextResponse.json(
        { error: "Invalid maxPerTaskTierWise format" },
        { status: 400 }
      );
    }

    for (const [tier, value] of Object.entries(
      maxPerTaskTierWise
    )) {
      if (
        typeof value !== "number" ||
        value <= 0 ||
        Number.isNaN(value)
      ) {
        return NextResponse.json(
          { error: `Invalid maxPerTask for tier ${tier}` },
          { status: 400 }
        );
      }
    }

    /* ---------------- COUNTRIES ---------------- */

    const includedCountries = Array.isArray(body.includedCountries)
      ? (body.includedCountries as unknown[])
        .filter((c): c is string => typeof c === "string")
      : [];

    const excludedCountries = Array.isArray(body.excludedCountries)
      ? (body.excludedCountries as unknown[])
        .filter((c): c is string => typeof c === "string")
      : [];

    if (
      includedCountries.length === 0 &&
      excludedCountries.length === 0
    ) {
      return NextResponse.json(
        { error: "At least one country required" },
        { status: 400 }
      );
    }

    /* ---------------- UPDATE ---------------- */

    const result = await db
      .update(offers)
      .set({
        title,
        link,
        bannerImage,
        squareImage,
        rewardsValue,
        tierWiseSteps,
        maxPerTaskTierWise,
        includedCountries,
        excludedCountries,
        updatedAt: new Date(),
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
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("UPDATE OFFER ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update offer" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  _req: Request,
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


// get for single fetch offer 
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { uid: ownerId } = await requireUser();

  const result = await db
    .select()
    .from(offers)
    .where(
      and(
        eq(offers.id, params.id),
        eq(offers.ownerId, ownerId)
      )
    )
    .limit(1);

  if (!result[0]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const offer = result[0];

  return NextResponse.json({
    ...offer,
    tierWiseSteps: offer.tierWiseSteps as TierWiseSteps,
    maxPerTaskTierWise:
      offer.maxPerTaskTierWise as MaxPerTaskTierWise | null,
  });
}
