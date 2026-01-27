import { db } from "@/db";
import { offers } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";

// Define a simple interface for the step object to satisfy ESLint
interface Step {
  id?: string | number;
  [key: string]: unknown;
}

export default async function OffersPage() {
  const allOffers = await db.select().from(offers);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            All <span className="text-blue-600">Offers</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {allOffers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-slate-400 font-medium">New offers are arriving soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allOffers.map((offer) => {
              // Cast to unknown then to a Record of Step arrays to satisfy ESLint & TS
              const stepsMap = (offer.tierWiseSteps as unknown) as Record<string, Step[]>;
              
              const tierCount = Object.keys(stepsMap || {}).length;
              const stepCount = Object.values(stepsMap || {}).reduce(
                (acc: number, steps: Step[]) => acc + (steps?.length || 0),
                0
              );

              return (
                <Link
                  key={offer.id}
                  href={`/public/offers/${offer.id}`}
                  className="group relative flex flex-col bg-white rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    {offer.bannerImage ? (
                      <Image
                        src={offer.bannerImage}
                        alt={offer.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-100 text-4xl">
                        🎁
                      </div>
                    )}
                    {/* Floating Reward Badge */}
                    {offer.rewardsValue && (
                      <div className="absolute top-4 left-4 backdrop-blur-md bg-white/90 border border-white/20 px-3 py-1.5 rounded-full shadow-sm">
                        <span className="text-sm font-bold text-blue-600">
                          {offer.rewardsValue}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Title and Square Image Row */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                        {offer.title}
                      </h2>
                      {offer.squareImage && (
                        <div className="relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden shadow-sm border border-slate-100 ring-2 ring-slate-50">
                          <Image
                            src={offer.squareImage}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Tiers</span>
                        <span className="text-sm font-semibold text-slate-700">{tierCount}</span>
                      </div>
                      <div className="h-8 w-[1px] bg-slate-100" />
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Steps</span>
                        <span className="text-sm font-semibold text-slate-700">{stepCount}</span>
                      </div>
                      
                      <div className="ml-auto">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}