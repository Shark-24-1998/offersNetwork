import Link from "next/link";
import { HiSparkles, HiHome } from "react-icons/hi2";
import { MdLocalOffer } from "react-icons/md";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
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
              Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg ml-0 sm:ml-14 pl-0 sm:pl-0">
            Manage your properties and offers from here.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 max-w-full sm:max-w-2xl">
          {/* Properties Card */}
          <Link
            href="/dashboard/properties"
            className="group relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-5 sm:p-6 shadow-lg shadow-pink-500/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/20 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative space-y-2 sm:space-y-3">
              <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 shadow-lg shadow-pink-500/30 transition-transform duration-300 group-hover:rotate-6">
                <HiHome className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              
              <div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
                  Properties
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Create and manage your properties
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span>View properties</span>
                <svg className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Offers Card - Coming Soon */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-lg opacity-60 cursor-not-allowed">
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-100 to-purple-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-purple-700">
                <HiSparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                Coming Soon
              </span>
            </div>
            
            <div className="relative space-y-2 sm:space-y-3">
              <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 shadow-md">
                <MdLocalOffer className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-700">
                  Offers
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Coming next
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}