import { db } from "@/db";
import { offers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { countriesData } from "@/lib/countries-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

// Satisfying ESLint/TS by defining a step shape
interface OfferStep {
  title: string;
  coins: number | string;
}

export default async function OfferDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [offer] = await db
    .select()
    .from(offers)
    .where(eq(offers.id, id))
    .limit(1);

  if (!offer) {
    notFound();
  }

  // Casting for type safety
  const tierWiseSteps = (offer.tierWiseSteps as unknown) as Record<string, OfferStep[]>;
  const maxPerTaskMap = (offer.maxPerTaskTierWise as unknown) as Record<string, number | string>;

  const getCountryNames = (codes: string[]) => {
    return codes
      .map((code) => countriesData[code]?.name || code)
      .sort()
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans pb-20">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 py-4 max-w-5xl flex items-center justify-between">
          <Link
            href="/public/offers"
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-semibold text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Offers
          </Link>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Offer Overview</div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header / Hero Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-sm">
              {offer.bannerImage && (
                <div className="relative h-64 md:h-96 w-full">
                  <Image
                    src={offer.bannerImage}
                    alt={offer.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}

              <div className="p-8 md:p-10">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                    {offer.title}
                  </h1>
                  {offer.squareImage && (
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
                      <Image src={offer.squareImage} alt="" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  {offer.rewardsValue && (
                    <div className="bg-blue-50 text-blue-700 px-5 py-2 rounded-2xl text-sm font-bold border border-blue-100">
                      💰 Total Rewards: {offer.rewardsValue}
                    </div>
                  )}
                  <div className="bg-slate-50 text-slate-600 px-5 py-2 rounded-2xl text-sm font-bold border border-slate-100">
                    📂 {Object.keys(tierWiseSteps).length} Tiers Available
                  </div>
                </div>

                <Link
                  href={offer.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full md:w-auto bg-blue-600 text-white font-bold px-10 py-4 rounded-2xl hover:bg-blue-700 transition-all hover:shadow-[0_10px_30px_-5px_rgba(37,99,235,0.4)]"
                >
                  Start Task Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Tiers Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 pl-2">Step-by-Step Tiers</h2>
              {Object.entries(tierWiseSteps).map(([tierStr, steps]) => {
                const tier = Number(tierStr);
                const maxPerTask = maxPerTaskMap[tier];

                return (
                  <div key={tier} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-black text-slate-800 uppercase tracking-wide text-sm">Tier {tier}</h3>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter bg-white px-3 py-1 rounded-full border border-slate-100">
                        Max Per Task: <span className="text-blue-600">{maxPerTask}</span>
                      </span>
                    </div>

                    <div className="p-2">
                      {steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-2xl transition-colors hover:bg-slate-50 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:border-blue-200 group-hover:text-blue-600 transition-all">
                              {index + 1}
                            </div>
                            <span className="font-bold text-slate-700">{step.title}</span>
                          </div>
                          <div className="text-right">
                            <span className="bg-green-50 text-green-700 font-black px-4 py-1.5 rounded-xl text-xs border border-green-100">
                              +{step.coins} COINS
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 sticky top-24">
              <h2 className="text-xl font-black mb-6 text-slate-900">Availability</h2>
              
              {offer.includedCountries.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest">Global Support</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-green-50/50 border border-green-100">
                    <p className="text-sm font-medium text-green-800 leading-relaxed">
                      {getCountryNames(offer.includedCountries)}
                    </p>
                  </div>
                </div>
              ) : offer.excludedCountries.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-600">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Regional Restrictions</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100">
                    <p className="text-sm font-medium text-rose-800 leading-relaxed">
                      Available everywhere except: <span className="font-bold">{getCountryNames(offer.excludedCountries)}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <p className="text-sm font-bold text-blue-700">Open to all regions</p>
                </div>
              )}

             
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}