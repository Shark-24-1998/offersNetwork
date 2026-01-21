import { db } from "@/db";
import { properties } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import { DeletePropertyIcon } from "@/components/DeletePropertyIcon";
import { HiHome, HiPlus } from "react-icons/hi2";
import { BiLinkExternal } from "react-icons/bi";
import { IoArrowBack } from "react-icons/io5";
import Image from "next/image";
import { requireUser } from "@/lib/auth-server";



export default async function PropertiesPage() {
  const session = (await cookies()).get("session");

  if (!session) redirect("/login");

 const {uid : ownerId } = await requireUser()

  const list = await db
    .select()
    .from(properties)
    .where(eq(properties.ownerId, ownerId))
    .orderBy(desc(properties.createdAt));

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
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 rounded-lg blur-md opacity-50" />
              <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 p-2 sm:p-2.5 rounded-lg shadow-lg">
                <HiHome className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
              Properties
            </h1>
          </div>

          <Link
            href="/dashboard/properties/new"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-5 sm:px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40 active:scale-95 w-full sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <HiPlus className="relative z-10 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:rotate-90" />
            <span className="relative z-10 font-semibold tracking-wide">
              New Property
            </span>
          </Link>
        </div>

        {/* Content Section */}
        {list.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-pink-200 bg-gradient-to-br from-rose-50/50 via-pink-50/50 to-purple-50/50 p-8 sm:p-12 text-center">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center mb-4">
              <HiHome className="h-8 w-8 sm:h-10 sm:w-10 text-pink-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No properties yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Create your first property to get started
            </p>
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors"
            >
              <HiPlus className="h-4 w-4" />
              Create Property
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {list.map((p) => (
              <div
                key={p.id}
                className="group relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-4 sm:p-5 shadow-md shadow-pink-500/5 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 hover:border-pink-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 via-pink-50/30 to-purple-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  {/* LEFT: info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0 overflow-hidden">
                        {p.imageLink ? (
                          <Image
                            src={p.imageLink}
                            alt={p.name || "Property"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <HiHome className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        )}
                      </div>
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                        {p.name}
                      </h3>
                    </div>
                    {p.link && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 ml-10 sm:ml-12">
                        <BiLinkExternal className="h-3.5 w-3.5 flex-shrink-0" />
                        <a 
                          href={p.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-pink-600 transition-colors truncate"
                        >
                          {p.link}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: actions */}
                  <div className="flex items-center gap-2 sm:gap-3 ml-10 sm:ml-0">
                    {/* Edit */}
                    <Link
                      href={`/dashboard/properties/${p.id}`}
                      title="Edit property"
                      className="group/edit inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 hover:scale-110 active:scale-95"
                    >
                      <FiEdit2 className="h-4 w-4 transition-transform duration-200 group-hover/edit:rotate-12" />
                    </Link>

                    {/* Delete */}
                    <DeletePropertyIcon propertyId={p.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}