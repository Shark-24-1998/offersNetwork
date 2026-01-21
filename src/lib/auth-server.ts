import { jwtVerify } from "jose";
import { cookies } from "next/headers";


const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function requireUser() {
    const cookieStore = cookies();
    const session = (await cookieStore).get("session")

    if (!session) {
        throw new Error("UNAUTHORIZED");
    }

    try {

        const { payload } = await jwtVerify(session.value, secret);
        const uid = payload.uid;

        if (typeof uid !== "string") {
            throw new Error("INVALID_SESSION");
        }

        return {
            uid,
        };

    } catch {
        throw new Error("UNAUTHORIZED");
    }

}