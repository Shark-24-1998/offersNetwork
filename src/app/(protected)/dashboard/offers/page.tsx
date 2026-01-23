import { DeleteOfferIcon } from "@/components/DeleteOfferIcon";
import { db } from "@/db";
import { offers } from "@/db/schema";
import { requireUser } from "@/lib/auth-server";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { MdLocalOffer, MdAdd } from "react-icons/md";
import { BiLinkExternal } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { HiGlobeAlt } from "react-icons/hi2";
import { countriesData } from "@/lib/countries-data";

export default async function OffersPage() {
  const { uid: ownerId } = await requireUser();

  const list = await db
    .select()
    .from(offers)
    .where(eq(offers.ownerId, ownerId))
    .orderBy(desc(offers.createdAt));

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors group"
        >
          <IoArrowBack className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-lg blur-md opacity-50" />
              <div className="relative bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 p-2 sm:p-2.5 rounded-lg shadow-lg">
                <MdLocalOffer className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              Offers
            </h1>
          </div>

          <Link
            href="/dashboard/offers/new"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 px-5 sm:px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 active:scale-95 w-full sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <MdAdd className="relative z-10 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:rotate-90" />
            <span className="relative z-10 font-semibold tracking-wide">
              New Offer
            </span>
          </Link>
        </div>

        {/* Content Section */}
        {list.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50/50 via-indigo-50/50 to-blue-50/50 p-8 sm:p-12 text-center">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
              <MdLocalOffer className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No offers yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Create your first offer to get started
            </p>
            <Link
              href="/dashboard/offers/new"
              className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              <MdAdd className="h-4 w-4" />
              Create Offer
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {list.map((offer) => {
              const includedCountries = offer.includedCountries 
                ? (offer.includedCountries as string[]) 
                : [];
              const excludedCountries = offer.excludedCountries 
                ? (offer.excludedCountries as string[]) 
                : [];

              return (
                <div
                  key={offer.id}
                  className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-4 sm:p-5 shadow-md shadow-purple-500/5 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-indigo-50/30 to-blue-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex flex-col gap-4">
                    {/* Top Section: Title, Link, Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                      {/* LEFT: info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <MdLocalOffer className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                            {offer.title}
                          </h3>
                        </div>
                        {offer.link && (
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 ml-10 sm:ml-12">
                            <BiLinkExternal className="h-3.5 w-3.5 flex-shrink-0" />
                            <Link
                              href={offer.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-purple-600 transition-colors truncate"
                            >
                              {offer.link}
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* RIGHT: actions */}
                      <div className="flex items-center gap-2 sm:gap-3 ml-10 sm:ml-0">
                        {/* Edit */}
                        <Link
                          href={`/dashboard/offers/${offer.id}`}
                          title="Edit offer"
                          className="group/edit inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 hover:scale-110 active:scale-95"
                        >
                          <FiEdit2 className="h-4 w-4 transition-transform duration-200 group-hover/edit:rotate-12" />
                        </Link>

                        {/* Delete */}
                        <DeleteOfferIcon offerId={offer.id} />
                      </div>
                    </div>

                    {/* Bottom Section: Country Flags */}
                    {(includedCountries.length > 0 || excludedCountries.length > 0) && (
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 ml-0 sm:ml-12 pt-2 border-t border-gray-100">
                        {/* Included Countries */}
                        {includedCountries.length > 0 && (
                          <div className="flex items-start gap-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 flex-shrink-0">
                              <HiGlobeAlt className="h-3.5 w-3.5" />
                              <span>Included:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {includedCountries.map((code) => {
                                const country = countriesData[code as keyof typeof countriesData];
                                return (
                                  <span
                                    key={code}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 border border-green-200 text-sm"
                                    title={country?.name || code}
                                  >
                                    {country?.flag || code}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Excluded Countries */}
                        {excludedCountries.length > 0 && (
                          <div className="flex items-start gap-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-red-700 flex-shrink-0">
                              <HiGlobeAlt className="h-3.5 w-3.5" />
                              <span>Excluded:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {excludedCountries.map((code) => {
                                const country = countriesData[code as keyof typeof countriesData];
                                return (
                                  <span
                                    key={code}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-50 border border-red-200 text-sm"
                                    title={country?.name || code}
                                  >
                                    {country?.flag || code}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}