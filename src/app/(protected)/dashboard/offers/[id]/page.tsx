import "server-only"
import { db } from "@/db";
import { offers } from "@/db/schema";
import { requireUser } from "@/lib/auth-server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import EditOfferForm from "./EditOfferForm";


export default async function EditOfferPage({
  params,
}: {
  params: { id: string };
}) {
  const {id} =await  params  
  const { uid: ownerId } = await requireUser();
  const result = await db
  .select()
  .from(offers)
  .where(
    and(
        eq(offers.id , id),
        eq(offers.ownerId, ownerId)

    )
  ).limit(1)

  const offer = result[0]


  if (!offer) {
    redirect("/dashboard/offers");
  }

  return <EditOfferForm offer={offer} />;
}
