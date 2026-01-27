"use client";

import { countriesData } from "@/lib/countries-data";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { MdLocalOffer, MdAdd } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { HiGlobeAlt, HiSparkles } from "react-icons/hi2";
import { BiLinkExternal } from "react-icons/bi";

/* ================= TYPES ================= */

type TierStep = {
  title: string;
  coins: number;
};

type TierWiseSteps = Record<number, TierStep[]>;
type MaxPerTaskTierWise = Record<number, number>;

/* ================= COMPONENT ================= */

export default function NewOfferPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic fields
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [squareImage, setSquareImage] = useState("");
  const [rewardsValue, setRewardsValue] = useState("");

  // Tier logic
  const [tierWiseSteps, setTierWiseSteps] = useState<TierWiseSteps>({});
  const [maxPerTaskTierWise, setMaxPerTaskTierWise] =
    useState<MaxPerTaskTierWise>({});

  // Countries
  const [includedCountries, setIncludedCountries] = useState<string[]>([]);
  const [excludedCountries, setExcludedCountries] = useState<string[]>([]);
  const [countryMode, setCountryMode] =
    useState<"included" | "excluded">("included");

  // Memoized country entries for performance
  const countryEntries = useMemo(() => Object.entries(countriesData), []);

  /* ================= TIER HANDLERS ================= */

  const addTier = useCallback(() => {
    const nextTier = Object.keys(tierWiseSteps).length + 1;
    setTierWiseSteps((prev) => ({ ...prev, [nextTier]: [] }));
    setMaxPerTaskTierWise((prev) => ({ ...prev, [nextTier]: 0 }));
  }, [tierWiseSteps]);

  const removeTier = useCallback(
    (tier: number) => {
      const newSteps: TierWiseSteps = {};
      const newMax: MaxPerTaskTierWise = {};

      Object.entries(tierWiseSteps)
        .filter(([t]) => Number(t) !== tier)
        .forEach(([oldTier, steps], index) => {
          const newTier = index + 1;
          newSteps[newTier] = steps;
          newMax[newTier] = maxPerTaskTierWise[Number(oldTier)] ?? 0;
        });

      setTierWiseSteps(newSteps);
      setMaxPerTaskTierWise(newMax);
    },
    [tierWiseSteps, maxPerTaskTierWise]
  );

  const addStep = useCallback((tier: number) => {
    setTierWiseSteps((prev) => ({
      ...prev,
      [tier]: [...(prev[tier] || []), { title: "", coins: 0 }],
    }));
  }, []);

  const updateStep = useCallback(
    (tier: number, index: number, key: "title" | "coins", value: string | number) => {
      setTierWiseSteps((prev) => {
        const copy = [...prev[tier]];
        copy[index] = { ...copy[index], [key]: value };
        return { ...prev, [tier]: copy };
      });
    },
    []
  );

  const removeStep = useCallback((tier: number, index: number) => {
    setTierWiseSteps((prev) => ({
      ...prev,
      [tier]: prev[tier].filter((_, i) => i !== index),
    }));
  }, []);

  /* ================= COUNTRY HANDLERS ================= */

  const toggleCountry = useCallback(
    (code: string) => {
      if (countryMode === "included") {
        setIncludedCountries((prev) =>
          prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
        );
        setExcludedCountries((prev) => prev.filter((c) => c !== code));
      } else {
        setExcludedCountries((prev) =>
          prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
        );
        setIncludedCountries((prev) => prev.filter((c) => c !== code));
      }
    },
    [countryMode]
  );

  const isCountrySelected = useCallback(
    (code: string) => {
      return countryMode === "included"
        ? includedCountries.includes(code)
        : excludedCountries.includes(code);
    },
    [countryMode, includedCountries, excludedCountries]
  );

  /* ================= VALIDATION ================= */

  const validateForm = useCallback((): string | null => {
    const cleanTitle = title.trim();
    const cleanLink = link.trim();

    if (!cleanTitle || !cleanLink) {
      return "Title and link are required";
    }

    if (Object.keys(tierWiseSteps).length === 0) {
      return "At least one tier is required";
    }

    for (const [tier, steps] of Object.entries(tierWiseSteps)) {
      if (steps.length === 0) {
        return `Tier ${tier} has no steps`;
      }

      for (const step of steps) {
        if (!step.title.trim() || step.coins <= 0) {
          return `Invalid step in Tier ${tier}`;
        }
      }

      if (!maxPerTaskTierWise[Number(tier)] || maxPerTaskTierWise[Number(tier)] <= 0) {
        return `Max per task missing or invalid for Tier ${tier}`;
      }
    }

    if (includedCountries.length === 0 && excludedCountries.length === 0) {
      return "Select at least one country";
    }

    return null;
  }, [title, link, tierWiseSteps, maxPerTaskTierWise, includedCountries, excludedCountries]);

  /* ================= SUBMIT ================= */

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      setError(null);

      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            link: link.trim(),
            bannerImage: bannerImage.trim() || null,
            squareImage: squareImage.trim() || null,
            rewardsValue: rewardsValue.trim() || null,
            tierWiseSteps,
            maxPerTaskTierWise,
            includedCountries,
            excludedCountries,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "Failed to create offer");
        }

        router.push("/dashboard/offers");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [
      validateForm,
      title,
      link,
      bannerImage,
      squareImage,
      rewardsValue,
      tierWiseSteps,
      maxPerTaskTierWise,
      includedCountries,
      excludedCountries,
      router,
    ]
  );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-5xl text-black mx-auto"
      >
        {/* Back Button */}
        <Link
          href="/dashboard/offers"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors group"
        >
          <IoArrowBack className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Offers
        </Link>

        {/* Header Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-lg blur-md opacity-50" />
            <div className="relative bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 p-2 sm:p-2.5 rounded-lg shadow-lg">
              <MdAdd className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Create New Offer
          </h1>
        </div>

        {/* Basic Information Card */}
        <div className="rounded-2xl border border-purple-100 bg-white p-5 sm:p-6 shadow-md shadow-purple-500/5">
          <div className="flex items-center gap-2 mb-5">
            <HiSparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter offer title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Link <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BiLinkExternal className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  placeholder="https://example.com/offer"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Images Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/banner.jpg"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/square.jpg"
                  value={squareImage}
                  onChange={(e) => setSquareImage(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Rewards Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rewards Value
              </label>
              <input
                type="text"
                placeholder="e.g., $50 Cash Back"
                value={rewardsValue}
                onChange={(e) => setRewardsValue(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Tiers Card */}
        <div className="rounded-2xl border border-purple-100 bg-white p-5 sm:p-6 shadow-md shadow-purple-500/5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <MdLocalOffer className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Tier Configuration</h2>
            </div>
            <button
              type="button"
              onClick={addTier}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-50 text-purple-600 text-sm font-medium hover:bg-purple-100 transition-colors"
            >
              <MdAdd className="h-4 w-4" />
              Add Tier
            </button>
          </div>

          {Object.keys(tierWiseSteps).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MdLocalOffer className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No tiers added yet. Click `&quot`Add Tier`&quot` to create one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(tierWiseSteps).map(([tierStr, steps]) => {
                const tier = Number(tierStr);

                return (
                  <div
                    key={tier}
                    className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-purple-50/30 via-indigo-50/30 to-blue-50/30"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-900">Tier {tier}</h3>
                      <button
                        type="button"
                        onClick={() => removeTier(tier)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                      >
                        Remove Tier
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max per Task <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g., 5"
                        value={maxPerTaskTierWise[tier] ?? ""}
                        onChange={(e) =>
                          setMaxPerTaskTierWise((prev) => ({
                            ...prev,
                            [tier]: Number(e.target.value),
                          }))
                        }
                        className="w-full sm:w-48 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Steps</label>
                      {steps.map((step, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Step title"
                            value={step.title}
                            onChange={(e) => updateStep(tier, i, "title", e.target.value)}
                            className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                          <input
                            type="number"
                            min="1"
                            placeholder="Coins"
                            value={step.coins || ""}
                            onChange={(e) =>
                              updateStep(tier, i, "coins", Number(e.target.value))
                            }
                            className="w-28 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeStep(tier, i)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Remove step"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addStep(tier)}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        + Add Step
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Countries Card */}
        <div className="rounded-2xl border border-purple-100 bg-white p-5 sm:p-6 shadow-md shadow-purple-500/5">
          <div className="flex items-center gap-2 mb-5">
            <HiGlobeAlt className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Country Selection</h2>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setCountryMode("included")}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                countryMode === "included"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Include Countries
            </button>
            <button
              type="button"
              onClick={() => setCountryMode("excluded")}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                countryMode === "excluded"
                  ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Exclude Countries
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
            {countryEntries.map(([code, country]) => (
              <label
                key={code}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isCountrySelected(code)}
                  onChange={() => toggleCountry(code)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">
                  {country.flag} {country.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative z-10">{loading ? "Creating..." : "Create Offer"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}