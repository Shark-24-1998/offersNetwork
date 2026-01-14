"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function logout() {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.refresh();
    } catch  {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={logout}
      disabled={isLoading}
      className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {isLoading ? (
        <AiOutlineLoading3Quarters className="relative z-10 h-4 w-4 animate-spin" />
      ) : (
        <BiLogOut className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      )}
      
      <span className="relative z-10 font-semibold tracking-wide">
        {isLoading ? "Logging out..." : "Logout"}
      </span>
    </button>
  );
}