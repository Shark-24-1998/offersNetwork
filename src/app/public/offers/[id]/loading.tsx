export default function OfferDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="h-4 bg-gray-200 rounded w-32 mb-6 animate-pulse" />

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="h-64 md:h-80 bg-gray-200 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-40 animate-pulse" />
            <div className="h-12 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}