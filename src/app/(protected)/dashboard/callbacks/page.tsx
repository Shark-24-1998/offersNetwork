import { db } from "@/db";
import { callbacks } from "@/db/schema";
import { desc } from "drizzle-orm";
import { HiArrowPath, HiCheckCircle, HiClock, HiChartBar } from "react-icons/hi2";

export default async function CallbacksPage() {
  const list = await db
    .select()
    .from(callbacks)
    .orderBy(desc(callbacks.createdAt));

  // Calculate stats
  const completedCount = list.filter(cb => cb.status === 1).length;
  const pendingCount = list.filter(cb => cb.status === 0).length;
  const uniqueOffers = new Set(list.map(cb => cb.offerId)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-orange-50/30">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 rounded-lg blur-md opacity-50" />
              <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 p-2.5 rounded-lg shadow-lg">
                <HiArrowPath className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-700 bg-clip-text text-transparent">
                Callbacks
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Monitor and manage all callback events
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-orange-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <HiChartBar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Callbacks</p>
                <p className="text-2xl font-bold text-gray-900">{list.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-green-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <HiCheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-amber-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <HiClock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Callbacks Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50/50 to-amber-50/50">
            <h2 className="text-lg font-semibold text-gray-900">
              All Callbacks
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Complete history of callback events
            </p>
          </div>

          {list.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <HiArrowPath className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No callbacks yet
              </h3>
              <p className="text-sm text-gray-500">
                Callback data will appear here once events are triggered
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Offer ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Property ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {list.map((cb) => (
                    <tr 
                      key={cb.id}
                      className="hover:bg-orange-50/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <code className="text-xs font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded">
                          {cb.offerId}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">
                          {cb.propertyId}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">
                          {cb.userId}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-sm font-medium">
                          Level {cb.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {cb.status === 1 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                            <HiCheckCircle className="h-4 w-4" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
                            <HiClock className="h-4 w-4" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <HiClock className="h-4 w-4 text-gray-400" />
                          {cb.createdAt.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        {list.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing all {list.length} callback{list.length !== 1 ? 's' : ''} • {uniqueOffers} unique offer{uniqueOffers !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}