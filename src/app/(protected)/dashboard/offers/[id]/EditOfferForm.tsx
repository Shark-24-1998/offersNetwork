"use client"

import { countriesData } from "@/lib/countries-data";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdLocalOffer, MdAdd, MdClose } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { HiGlobeAlt, HiLink } from "react-icons/hi2";
import { BiDollar } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";

type TierStep = {
  tier: number;
  event: string;
  payout: number;
};

type Offer = {
  id: string;
  title: string;
  link: string;
  tierWiseSteps: TierStep[];
  includedCountries: string[];
  excludedCountries: string[];
};

export default function EditOfferForm({ offer }: { offer: Offer }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(offer.title);
  const [link, setLink] = useState(offer.link);
  const [tierSteps, setTierSteps] = useState<TierStep[]>(offer.tierWiseSteps);
  const [includedCountries, setIncludedCountries] = useState<string[]>(
    offer.includedCountries
  );
  const [excludedCountries, setExcludedCountries] = useState<string[]>(
    offer.excludedCountries
  );
  const [countryMode, setCountryMode] = useState<"included" | "excluded">(
    offer.includedCountries.length > 0 ? "included" : "excluded"
  );

  function toggleCountry(code: string) {
    if (countryMode === "included") {
      setIncludedCountries(prev =>
        prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
      );
      // Remove from excluded if adding to included
      setExcludedCountries(prev => prev.filter(c => c !== code));
    } else {
      setExcludedCountries(prev =>
        prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
      );
      // Remove from included if adding to excluded
      setIncludedCountries(prev => prev.filter(c => c !== code));
    }
  }

  function isCountrySelected(code: string) {
    if (countryMode === "included") {
      return includedCountries.includes(code);
    }
    return excludedCountries.includes(code);
  }

  function removeTierStep(index: number) {
    const updated = tierSteps.filter((_, i) => i !== index);
    // Recalculate tier numbers
    setTierSteps(updated.map((step, i) => ({ ...step, tier: i + 1 })));
  }

  async function handleSubmit() {
    setError(null);

    const cleanTitle = title.trim();
    const cleanLink = link.trim();

    if (!cleanTitle) {
      setError("Title is required");
      return;
    }
    if (!cleanLink) {
      setError("Link is required");
      return;
    }
    if (tierSteps.length === 0) {
      setError("At least one tier step is required");
      return;
    }

    // Validate tier steps
    for (const step of tierSteps) {
      if (!step.event.trim()) {
        setError("All tier steps must have an event name");
        return;
      }
      if (step.payout <= 0) {
        setError("All tier steps must have a payout greater than 0");
        return;
      }
    }

    if (includedCountries.length === 0 && excludedCountries.length === 0) {
      setError("Select at least one country");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/offers/${offer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          link: cleanLink,
          tierWiseSteps: tierSteps.map((s) => ({
            tier: s.tier,
            event: s.event.trim(),
            payout: s.payout,
          })),
          includedCountries,
          excludedCountries,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to update offer");
      }

      router.push("/dashboard/offers");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard/offers")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors group"
        >
          <IoArrowBack className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Offers
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-lg blur-md opacity-50" />
            <div className="relative bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 p-2 sm:p-2.5 rounded-lg shadow-lg">
              <FiEdit2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Edit Offer
          </h1>
        </div>

        {/* Form Container */}
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="rounded-2xl border border-purple-100 bg-white p-5 sm:p-6 shadow-md shadow-purple-500/5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 flex items-center justify-center">
                <MdLocalOffer className="h-4 w-4 text-white" />
              </div>
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter offer title..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100"
                />
              </div>

              {/* Link Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Link *
                </label>
                <div className="relative">
                  <HiLink className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com/offer"
                    className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tier Steps Card */}
          <div className="rounded-2xl border border-purple-100 bg-white p-5 sm:p-6 shadow-md shadow-purple-500/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 flex items-center justify-center">
                  <BiDollar className="h-4 w-4 text-white" />
                </div>
                Tier Wise Steps *
              </h2>
              <button
                type="button"
                onClick={() =>
                  setTierSteps([
                    ...tierSteps,
                    { tier: tierSteps.length + 1, event: "", payout: 0 },
                  ])
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <MdAdd className="h-4 w-4" />
                Add Step
              </button>
            </div>

            <div className="space-y-3">
              {tierSteps.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No tier steps added yet. Click &quot;Add Step&quot; to create one.
                </div>
              ) : (
                tierSteps.map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start p-3 rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50/30 to-blue-50/30 hover:border-purple-200 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 text-white font-semibold text-sm flex-shrink-0 mt-1">
                      {step.tier}
                    </div>
                    <div className="flex-1 grid grid-cols-1 text-black sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Event name (e.g., Install)"
                        value={step.event}
                        onChange={(e) => {
                          const copy = [...tierSteps];
                          copy[i].event = e.target.value;
                          setTierSteps(copy);
                        }}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Payout amount"
                        value={step.payout || ""}
                        onChange={(e) => {
                          const copy = [...tierSteps];
                          copy[i].payout = Number(e.target.value);
                          setTierSteps(copy);
                        }}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTierStep(i)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0 mt-1"
                    >
                      <MdClose className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Countries Card */}
          <div className="rounded-2xl border border-purple-100 bg-white p-5 sm:p-6 shadow-md shadow-purple-500/5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 flex items-center justify-center">
                <HiGlobeAlt className="h-4 w-4 text-white" />
              </div>
              Geographic Targeting *
            </h2>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setCountryMode("included")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  countryMode === "included"
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Include Countries
              </button>
              <button
                type="button"
                onClick={() => setCountryMode("excluded")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  countryMode === "excluded"
                    ? "bg-white text-red-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Exclude Countries
              </button>
            </div>

            {/* Selected Countries Summary */}
            {(includedCountries.length > 0 || excludedCountries.length > 0) && (
              <div className="mb-4 space-y-2">
                {includedCountries.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-medium text-green-700 mt-1">
                      Included:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {includedCountries.map((code) => {
                        const country = countriesData[code as keyof typeof countriesData];
                        return (
                          <span
                            key={code}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 border border-green-200 text-xs"
                          >
                            {country?.flag || code}
                            <button
                              type="button"
                              onClick={() =>
                                setIncludedCountries((prev) =>
                                  prev.filter((c) => c !== code)
                                )
                              }
                              className="text-green-700 hover:text-green-900"
                            >
                              <MdClose className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                {excludedCountries.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-medium text-red-700 mt-1">
                      Excluded:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {excludedCountries.map((code) => {
                        const country = countriesData[code as keyof typeof countriesData];
                        return (
                          <span
                            key={code}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 border border-red-200 text-xs"
                          >
                            {country?.flag || code}
                            <button
                              type="button"
                              onClick={() =>
                                setExcludedCountries((prev) =>
                                  prev.filter((c) => c !== code)
                                )
                              }
                              className="text-red-700 hover:text-red-900"
                            >
                              <MdClose className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Countries Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-3 bg-gray-50 rounded-xl border border-gray-200">
              {Object.entries(countriesData).map(([code, country]) => {
                const selected = isCountrySelected(code);

                return (
                  <label
                    key={code}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                      selected
                        ? countryMode === "included"
                          ? "bg-green-50 border-2 border-green-300"
                          : "bg-red-50 border-2 border-red-300"
                        : "bg-white border-2 border-transparent hover:border-purple-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleCountry(code)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-xl">{country.flag}</span>
                    <span className="text-xs font-medium text-gray-700">
                      {code}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/offers")}
              className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="group relative flex-1 inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10 tracking-wide">
                {loading ? "Saving Changes..." : "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}