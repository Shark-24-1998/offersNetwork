import { db } from "@/db";
import { properties } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EditPropertyForm from "./EditPropertyForm";


const secret = new TextEncoder().encode(process.env.SESSION_SECRET!)

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }){
    const { id } = await params;
    const session = (await cookies()).get("session");
    if(!session){
        redirect("/login")
    }
    const {payload} = await jwtVerify(session.value, secret)
    const ownerId = payload.uid as string

    const result = await db
    .select()
    .from(properties)
    .where(
        and(
             eq(properties.id , id),
             eq(properties.ownerId, ownerId)
        )
       
).limit(1)

if (result.length === 0) {
    redirect("/dashboard/properties");
  }
 return <EditPropertyForm property={result[0]} />

}
