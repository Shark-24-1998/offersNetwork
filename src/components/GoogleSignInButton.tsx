"use client";

import { auth } from "@/lib/firebase-client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export function GoogleSignInButton() {
  const router = useRouter();

  async function googleSignIn() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    router.refresh();
  }

  return (
    <button
      onClick={googleSignIn}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 active:scale-[0.98]"
    >
      <FcGoogle className="text-xl" />
      Continue with Google
    </button>
  );
}
