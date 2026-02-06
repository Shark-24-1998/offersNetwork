'use client';

import { useState, useEffect, useTransition } from 'react';
import { HiArrowPath, HiCheckCircle, HiClock, HiMagnifyingGlass } from 'react-icons/hi2';
import CopyButton from '@/components/CopyButton';
import { fetchCallbacks, CallbackWithRelations } from '@/actions/callbacks.actions';

interface CallbacksTableProps {
  initialData: CallbackWithRelations[];
  initialHasMore: boolean;
  initialTotal: number;
}

export default function CallbacksTable({ 
  initialData, 
  initialHasMore,
  initialTotal 
}: CallbacksTableProps) {
  const [callbacks, setCallbacks] = useState<CallbackWithRelations[]>(initialData);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const [offset, setOffset] = useState(initialData.length);
  
  const [propertyFilter, setPropertyFilter] = useState('');
  const [offerFilter, setOfferFilter] = useState('');
  const [debouncedPropertyFilter, setDebouncedPropertyFilter] = useState('');
  const [debouncedOfferFilter, setDebouncedOfferFilter] = useState('');
  
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Debounce filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPropertyFilter(propertyFilter);
      setDebouncedOfferFilter(offerFilter);
    }, 500);

    return () => clearTimeout(timer);
  }, [propertyFilter, offerFilter]);

  // Fetch data when filters change
  useEffect(() => {
    startTransition(async () => {
      try {
        const result = await fetchCallbacks({
          limit: 100,
          offset: 0,
          propertyFilter: debouncedPropertyFilter,
          offerFilter: debouncedOfferFilter,
        });
        setCallbacks(result.data);
        setHasMore(result.hasMore);
        setTotal(result.total);
        setOffset(result.data.length);
      } catch (error) {
        console.error('Error fetching callbacks:', error);
      }
    });
  }, [debouncedPropertyFilter, debouncedOfferFilter]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const result = await fetchCallbacks({
        limit: 20,
        offset,
        propertyFilter: debouncedPropertyFilter,
        offerFilter: debouncedOfferFilter,
      });
      
      setCallbacks(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setOffset(prev => prev + result.data.length);
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const truncateId = (id: string, length = 8) => {
    if (id.length <= length) return id;
    return `${id.slice(0, length)}...`;
  };

  const clearFilters = () => {
    setPropertyFilter('');
    setOfferFilter('');
  };

  const hasActiveFilters = propertyFilter || offerFilter;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-black">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="property-filter" className="block text-xs font-medium text-gray-700 mb-1.5">
              Filter by Property
            </label>
            <div className="relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="property-filter"
                type="text"
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                placeholder="Search property name..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <label htmlFor="offer-filter" className="block text-xs font-medium text-gray-700 mb-1.5">
              Filter by Offer
            </label>
            <div className="relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="offer-filter"
                type="text"
                value={offerFilter}
                onChange={(e) => setOfferFilter(e.target.value)}
                placeholder="Search offer name..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-3 text-xs text-gray-500">
            {isPending ? (
              <span className="flex items-center gap-2">
                <HiArrowPath className="h-3 w-3 animate-spin" />
                Filtering...
              </span>
            ) : (
              <span>
                Showing {callbacks.length} of {total} results
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50/50 to-amber-50/50">
          <h2 className="text-lg font-semibold text-gray-900">
            All Callbacks
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete history of callback events
          </p>
        </div>

        {callbacks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <HiArrowPath className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {isPending ? 'Loading...' : hasActiveFilters ? 'No matching callbacks found' : 'No callbacks yet'}
            </h3>
            <p className="text-sm text-gray-500">
              {hasActiveFilters 
                ? 'Try adjusting your filters' 
                : 'Callback data will appear here once events are triggered'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Offer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Property
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
                  {callbacks.map((cb) => (
                    <tr 
                      key={cb.id}
                      className="hover:bg-orange-50/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {cb.offerName || 'Unknown Offer'}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <code className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded" title={cb.offerId}>
                              {truncateId(cb.offerId)}
                            </code>
                            <CopyButton text={cb.offerId} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {cb.propertyName || 'Unknown Property'}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <code className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded" title={cb.propertyId}>
                              {truncateId(cb.propertyId)}
                            </code>
                            <CopyButton text={cb.propertyId} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <code className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded" title={cb.userId}>
                            {truncateId(cb.userId, 10)}
                          </code>
                          <CopyButton text={cb.userId} />
                        </div>
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

            {/* Load More Button */}
            {hasMore && (
              <div className="p-6 border-t border-gray-200 bg-gray-50/50 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isLoadingMore ? (
                    <>
                      <HiArrowPath className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        +20
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer info */}
      {callbacks.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {callbacks.length} of {total} callback{total !== 1 ? 's' : ''}
          {hasMore && ' • Click "Load More" to see more'}
        </div>
      )}
    </div>
  );
}