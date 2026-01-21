"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { LogoutButton } from "./Logout";
import { HiSparkles } from "react-icons/hi2";
import { RiDashboardFill } from "react-icons/ri";

export type NavbarUser = {
    email: string | null;
    avatarUrl: string | null;
    name: string | null;
};

export default function Navbar({
    user,
}: {
    user: NavbarUser | null;
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const initials =
        user?.name
            ?.split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() ??
        user?.email?.[0]?.toUpperCase();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            {/* Logo Section */}
            <Link 
                href="/" 
                className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 p-2 rounded-lg shadow-lg">
                        <HiSparkles className="h-5 w-5 text-white" />
                    </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
                    Offers Network
                </span>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        {/* Dashboard Button */}
                        <Link
                            href="/dashboard"
                            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40 active:scale-95"
                        >
                            <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <RiDashboardFill className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                            <span className="relative z-10 font-semibold tracking-wide">
                                Dashboard
                            </span>
                        </Link>

                        {/* User Avatar Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setOpen(!open)}
                                className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-pink-200 hover:ring-pink-400 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-400 to-purple-500" />
                                {user.avatarUrl ? (
                                    <Image
                                        src={user.avatarUrl}
                                        alt="avatar"
                                        width={40}
                                        height={40}
                                        className="relative rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="relative z-10 text-sm font-bold text-white flex items-center justify-center h-full">
                                        {initials}
                                    </span>
                                )}
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-pink-100 bg-white shadow-2xl shadow-pink-500/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-5 py-4 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-b border-pink-100">
                                        <p className="text-xs font-medium text-gray-500 mb-1">Signed in as : {user.name}</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="p-3">
                                        <LogoutButton />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <Link 
                        href="/login"
                        className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40 active:scale-95"
                    >
                        <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <span className="relative z-10 font-semibold tracking-wide">
                            Login
                        </span>
                    </Link>
                )}
            </div>
        </nav>
    );
}