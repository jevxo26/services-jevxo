"use client"

import * as React from "react"
import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import {
  ShieldAlert,
  Heart,
  Star,
  Plus,
  ArrowRight,
  History,
  ChevronRight
} from "lucide-react"
import Link from "next/link"

export default function SavedServicesPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  const [savedServices, setSavedServices] = React.useState([
    {
      id: "1",
      title: "Advanced AC Servicing",
      rating: 4.9,
      desc: "Deep cleaning, gas refill, and electrical inspection.",
      price: "৳1,200",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "2",
      title: "Home Deep Cleaning",
      rating: 4.8,
      desc: "Complete sanitation for 2-3 BHK apartments.",
      price: "৳3,500",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "3",
      title: "Master Plumbing",
      rating: 4.7,
      desc: "Leak detection, pipe repair, and fitting installation.",
      price: "৳800",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80",
    },
  ])

  const [recentlyViewed, setRecentlyViewed] = React.useState([
    {
      id: "r1",
      title: "Fridge Repair",
      provider: "Pro Techs",
      price: "৳1,500",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "r2",
      title: "Smart Lock Pro",
      provider: "Security Hub",
      price: "৳2,200",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=100&auto=format&fit=crop&q=80",
    },
  ])

  const handleUnsave = (id: string) => {
    setSavedServices(savedServices.filter((item) => item.id !== id))
  }

  const handleClearHistory = () => {
    setRecentlyViewed([])
  }

  if (role !== "client") {
    return <AccessDenied roleRequired="Customer" />
  }

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-10 relative z-10">
        
        {/* Title Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Saved Services</h1>
          <p className="text-slate-500 mt-2 font-semibold text-sm max-w-3xl leading-relaxed">
            Manage your collection of preferred home services. Rebook your favorites or find new professionals for your next home project.
          </p>
        </div>

        {/* Services Grid (Saved list + Discover card) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
            >
              {/* Image with Filled Heart overlay */}
              <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleUnsave(service.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full text-[#FF464C] hover:scale-110 transition-transform shadow-md focus:outline-none"
                >
                  <Heart size={14} className="fill-current" />
                </button>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-800 text-sm">{service.title}</h3>
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                      <Star size={11} className="fill-current" /> {service.rating}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">{service.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Starts From</span>
                    <span className="text-sm font-black text-[#FF464C]">{service.price}</span>
                  </div>
                  <Link
                    href="/dashbord/quick-booking"
                    className="bg-[#FF5B60] hover:bg-[#FF464C] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-rose-500/10 active:scale-[0.98]"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Discover More Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-slate-200 p-6 flex flex-col justify-between items-center text-center shadow-sm">
            <div className="my-auto space-y-4">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-[#FF464C] mx-auto border border-rose-100">
                <Plus size={20} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-slate-800 text-sm">Discover More</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-[200px] mx-auto">
                  Want to explore more options? Check out our trending services this month.
                </p>
              </div>
            </div>
            
            <Link
              href="/dashbord/quick-booking"
              className="mt-6 w-full bg-white hover:bg-slate-50 border border-slate-100 text-[#FF464C] text-xs font-bold py-2.5 rounded-2xl transition-colors text-center"
            >
              Find More Services
            </Link>
          </div>
        </div>

        {/* Recently Viewed Section */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recently Viewed</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold">Services you explored in the last 24 hours.</p>
            </div>
            <Link href="/dashbord/quick-booking" className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-0.5">
              View All <ChevronRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentlyViewed.map((view) => (
              <div
                key={view.id}
                className="bg-white p-3 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={view.image}
                  alt={view.title}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">{view.title}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{view.provider}</span>
                  <span className="text-xs font-black text-slate-800 block mt-1">{view.price}</span>
                </div>
              </div>
            ))}

            {/* Clear History Card */}
            {recentlyViewed.length > 0 ? (
              <button
                onClick={handleClearHistory}
                className="bg-white/80 p-3 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 hover:bg-rose-50/20 group transition-all text-left focus:outline-none w-full"
              >
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-[#FF464C] group-hover:scale-105 transition-transform shrink-0">
                  <History size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Clear History</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Remove recent views</p>
                </div>
              </button>
            ) : (
              <div className="bg-slate-50/50 p-4 rounded-[24px] border border-dashed border-slate-200 text-center text-xs text-slate-400 flex items-center justify-center min-h-[88px] col-span-3">
                No recent history.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

function AccessDenied({ roleRequired }: { roleRequired: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
      <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 mb-4">
        <ShieldAlert size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        This subpage is only accessible to users with the <strong className="text-slate-800">{roleRequired}</strong> role. 
        Please toggle your preview role using the selector at the top.
      </p>
    </div>
  )
}
