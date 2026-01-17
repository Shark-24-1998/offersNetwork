"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase-client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export function GoogleSignInButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function googleSignIn() {
    if (loading) return;

    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      router.refresh();
    } catch (err) {
      console.error("Google login failed", err);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={googleSignIn}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm font-medium text-white transition
      disabled:cursor-not-allowed disabled:opacity-60 hover:bg-neutral-700 active:scale-[0.98]"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Signing in...
        </>
      ) : (
        <>
          <FcGoogle className="text-xl" />
          Continue with Google
        </>
      )}
    </button>
  );
}
