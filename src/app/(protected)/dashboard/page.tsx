import Link from "next/link";
import { HiSparkles, HiHome } from "react-icons/hi2";
import { MdLocalOffer } from "react-icons/md";
import { HiUserGroup, HiArrowPath } from "react-icons/hi2";

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
            Manage your properties, offers, visitors, and callbacks from here.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Properties Card - Pink */}
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

          {/* Offers Card - Blue */}
          <Link
            href="/dashboard/offers"
            className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 sm:p-6 shadow-lg shadow-blue-500/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative space-y-2 sm:space-y-3">
              <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:rotate-6">
                <MdLocalOffer className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              
              <div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                  Offers
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Create and manage your offers
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span>View offers</span>
                <svg className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Visitors Card - Green */}
          <Link
            href="/dashboard/visitors"
            className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative space-y-2 sm:space-y-3">
              <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:rotate-6">
                <HiUserGroup className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              
              <div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 bg-clip-text text-transparent">
                  Visitors
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Track and manage your visitors
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span>View visitors</span>
                <svg className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Callbacks Card - Orange */}
          <Link
            href="/dashboard/callbacks"
            className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-5 sm:p-6 shadow-lg shadow-orange-500/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative space-y-2 sm:space-y-3">
              <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 shadow-lg shadow-orange-500/30 transition-transform duration-300 group-hover:rotate-6">
                <HiArrowPath className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              
              <div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-700 bg-clip-text text-transparent">
                  Callbacks
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Monitor and manage callbacks
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-orange-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span>View callbacks</span>
                <svg className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}