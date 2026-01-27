"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase-client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";


export function EmailAuthForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      let cred;

      try {
        cred = await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
  if (err instanceof FirebaseError) {
    if (err.code === "auth/user-not-found") {
      cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    } else {
      throw err;
    }
  } else {
    throw err;
  }
}

      const token = await cred.user.getIdToken();

      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      router.refresh();
    } catch (err) {
      console.error("Auth failed", err);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full rounded border px-3 py-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full rounded border px-3 py-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
      >
        {loading ? "Please wait..." : "Continue"}
      </button>
    </form>
  );
}
