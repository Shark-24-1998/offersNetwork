import { db } from "@/db";
import { visitors } from "@/db/schema";
import { requireUser } from "@/lib/auth-server";
import { desc } from "drizzle-orm";
import { HiUserGroup, HiEye, HiClock, HiFingerPrint } from "react-icons/hi2";

export default async function VisitorsPage() {
  await requireUser();

  const rows = await db
    .select()
    .from(visitors)
    .orderBy(desc(visitors.createdAt));

  // Calculate stats at server render time (pure function)
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last24HoursCount = rows.filter(r => 
    new Date(r.createdAt) > twentyFourHoursAgo
  ).length;
  
  const uniqueUids = new Set(rows.filter(r => r.uid).map(r => r.uid)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50/30">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-lg blur-md opacity-50" />
              <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 p-2.5 rounded-lg shadow-lg">
                <HiUserGroup className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 bg-clip-text text-transparent">
                Visitors
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Track all visitor interactions and clicks
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <HiEye className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{rows.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-teal-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <HiFingerPrint className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unique UIDs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {uniqueUids}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-green-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <HiClock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last 24 Hours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {last24HoursCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visitors Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
            <h2 className="text-lg font-semibold text-gray-900">
              All Visitors
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Complete list of visitor interactions
            </p>
          </div>

          {rows.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <HiUserGroup className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No visitors yet
              </h3>
              <p className="text-sm text-gray-500">
                Visitor data will appear here once someone clicks your offers
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Click ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      UID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      PID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Offer ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row) => (
                    <tr 
                      key={row.clickId}
                      className="hover:bg-emerald-50/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <code className="text-xs font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded">
                            {row.clickId}
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {row.uid ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 text-sm font-medium">
                            {row.uid}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {row.pid ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium">
                            {row.pid}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">
                          {row.offerId}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <HiClock className="h-4 w-4 text-gray-400" />
                          {row.createdAt.toLocaleString('en-US', {
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

        {/* Pagination hint for future */}
        {rows.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing all {rows.length} visitor{rows.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}