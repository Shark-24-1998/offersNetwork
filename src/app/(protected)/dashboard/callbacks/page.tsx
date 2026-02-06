import { HiArrowPath, HiCheckCircle, HiClock, HiChartBar } from "react-icons/hi2";
import CallbacksTable from "@/components/CallbacksTable";
import { fetchCallbacks, getCallbacksStats } from "@/actions/callbacks.actions";

export default async function CallbacksPage() {
  // Fetch initial data and stats
  const [initialResult, stats] = await Promise.all([
    fetchCallbacks({ limit: 100, offset: 0 }),
    getCallbacksStats(),
  ]);

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
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Callbacks Table */}
        <CallbacksTable 
          initialData={initialResult.data}
          initialHasMore={initialResult.hasMore}
          initialTotal={initialResult.total}
        />
      </div>
    </div>
  );
}