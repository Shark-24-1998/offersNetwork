"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiSparkles, HiHome } from "react-icons/hi2";
import { BiLinkExternal, BiImageAlt } from "react-icons/bi";
import { MdOutlineHttp } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";

/**
 * Normalize input:
 * - trims whitespace
 * - blocks empty, whitespace-only, quotes-only
 * - returns null for optional fields
 * - throws error for required fields
 */
function normalizeField(
  value: FormDataEntryValue | null,
  options: { required: boolean; label: string }
): string | null {
  if (typeof value !== "string") {
    if (options.required) {
      throw new Error(`${options.label} is required`);
    }
    return null;
  }

  const trimmed = value.trim();

  // block empty, whitespace, quotes-only
  if (
    trimmed === "" ||
    trimmed === '""'
  ) {
    if (options.required) {
      throw new Error(`${options.label} cannot be empty or quotes only`);
    }
    return null;
  }

  return trimmed;
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    let payload: {
      name: string;
      link: string;
      imageLink: string | null;
      postbackUrl: string | null;
    };

    try {
      payload = {
        name: normalizeField(formData.get("name"), {
          required: true,
          label: "Name",
        }) as string,

        link: normalizeField(formData.get("link"), {
          required: true,
          label: "Link",
        }) as string,

        imageLink: normalizeField(formData.get("imageLink"), {
          required: false,
          label: "Image URL",
        }),

        postbackUrl: normalizeField(formData.get("postbackUrl"), {
          required: false,
          label: "Postback URL",
        }),
      };
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid input");
      }
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to create property");
      }

      router.push("/dashboard/properties");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 sm:space-y-8">
        {/* Back Button */}
        <Link
          href="/dashboard/properties"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors group"
        >
          <IoArrowBack className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Properties
        </Link>

        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 rounded-lg blur-md opacity-50" />
              <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 p-2 sm:p-2.5 rounded-lg shadow-lg">
                <HiSparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
              New Property
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base ml-0 sm:ml-14">
            Create a new property for your offers network
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 sm:p-8 shadow-lg shadow-pink-500/10">
          <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
            {/* Property Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <HiHome className="h-4 w-4 text-pink-600" />
                Property Name
                <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                placeholder="Enter property name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100 hover:border-pink-200"
              />
            </div>

            {/* Property URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BiLinkExternal className="h-4 w-4 text-pink-600" />
                Property URL
                <span className="text-red-500">*</span>
              </label>
              <input
                name="link"
                placeholder="https://example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100 hover:border-pink-200"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BiImageAlt className="h-4 w-4 text-gray-500" />
                Image URL
                <span className="text-xs font-normal text-gray-500">(optional)</span>
              </label>
              <input
                name="imageLink"
                placeholder="https://example.com/image.png"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100 hover:border-pink-200"
              />
            </div>

            {/* Postback URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MdOutlineHttp className="h-4 w-4 text-gray-500" />
                Postback URL
                <span className="text-xs font-normal text-gray-500">(optional)</span>
              </label>
              <input
                name="postbackUrl"
                placeholder="https://example.com/postback"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100 hover:border-pink-200"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold">!</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 py-3.5 text-sm sm:text-base font-medium text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              {loading ? (
                <AiOutlineLoading3Quarters className="relative z-10 h-5 w-5 animate-spin" />
              ) : (
                <HiSparkles className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              )}
              
              <span className="relative z-10 font-semibold tracking-wide">
                {loading ? "Creating..." : "Create Property"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}