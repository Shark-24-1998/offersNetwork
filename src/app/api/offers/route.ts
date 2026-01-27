import { db } from "@/db";
import { offers } from "@/db/schema";
import { MaxPerTaskTierWise, TierWiseSteps, } from "@/db/types";
import { requireUser } from "@/lib/auth-server"
import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import "server-only"


export async function POST(req: Request) {
  try {
    const { uid: ownerId } = await requireUser();
    const body = await req.json();

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
      ? (body.includedCountries as unknown[]).filter((c) => typeof c === "string")
      : [];

    const excludedCountries = Array.isArray(body.excludedCountries)
      ? (body.excludedCountries as unknown[]).filter((c) => typeof c === "string")
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

    /* ---------------- INSERT ---------------- */

    const id = randomUUID();

    await db.insert(offers).values({
      id,
      ownerId,
      title,
      link,
      bannerImage,
      squareImage,
      rewardsValue,
      tierWiseSteps,
      maxPerTaskTierWise,
      includedCountries,
      excludedCountries,
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("CREATE OFFER ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );
  }
}


export async function GET() {
  const { uid: ownerId } = await requireUser();

  const rows = await db
    .select()
    .from(offers)
    .where(eq(offers.ownerId, ownerId))
    .orderBy(desc(offers.createdAt));

  return NextResponse.json(
    rows.map((o) => ({
      ...o,
      tierWiseSteps: o.tierWiseSteps as TierWiseSteps,
      maxPerTaskTierWise:
        o.maxPerTaskTierWise as MaxPerTaskTierWise | null,
    }))
  );
}
