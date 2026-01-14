"use client"
import { BiDollar } from 'react-icons/bi'
import { HiOutlineLightningBolt } from 'react-icons/hi'
import { MdVerified } from 'react-icons/md'
import { HiArrowRight } from 'react-icons/hi'
import { LogoutButton } from '@/components/Logout'

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-100/50 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-100/50 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Main heading */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-block">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient bg-300% mb-4">
              Offers Network
            </h1>
            <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-purple-600 to-transparent rounded-full" />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto">
            Discover exclusive deals and opportunities tailored just for you
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/50 hover:scale-105 hover:border-purple-400">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
                <BiDollar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Best Deals</h3>
              <p className="text-gray-600 text-sm">Curated offers from top brands</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-pink-200/50 hover:scale-105 hover:border-pink-400">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
                <HiOutlineLightningBolt className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Access</h3>
              <p className="text-gray-600 text-sm">Instant deal activation</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/50 hover:scale-105 hover:border-purple-400">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
                <MdVerified className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Verified</h3>
              <p className="text-gray-600 text-sm">100% authentic offers</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12">
          <button className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-300% px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-purple-300/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-400/50 active:scale-95 animate-gradient">
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative z-10">Explore Offers</span>
            <HiArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
        <div className='mt-5'>
          <LogoutButton />
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .bg-300\% {
          background-size: 300% 300%;
        }
      `}</style>
    </div>
  )
}

export default Home