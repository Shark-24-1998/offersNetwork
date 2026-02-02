import { db } from "@/db";
import { offers, visitors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ offerId: string }> }
) {
  const { offerId } = await params;

  const url = new URL(req.url);
  const referrer = url.searchParams.get("referrer") || "";
  const [uid, pid] = referrer.split("-");

  const [offer] = await db
    .select()
    .from(offers)
    .where(eq(offers.id, offerId))
    .limit(1);

  if (!offer) {
    redirect("/404");
  }

  await db.insert(visitors).values({
    clickId: randomUUID(),
    offerId: offer.id,
    uid: uid || "unknown",
    pid: pid || "unknown",
  });

  redirect(offer.link);
}


