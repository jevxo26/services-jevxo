"use client";

import React from "react";
import { Calendar, Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import AccessDenied from "../components/AccessDenied";
import BookingItem from "./components/BookingItem";
import { useClientBookingsState } from "./hooks/useClientBookingsState";

export default function BookingsPage() {
  const { role, filter, setFilter, isLoading, filteredBookings } = useClientBookingsState();
  const lang = useAppSelector((state) => state.lang.value);

  if (role !== "client") {
    return <AccessDenied roleRequired="Customer" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#1E4E8C]" />
      </div>
    );
  }

  const langFilterName = (f: string) => {
    switch (f) {
      case "All": return lang === "bn" ? "সব" : "All";
      case "Pending": return lang === "bn" ? "পেন্ডিং" : "Pending";
      case "Assigned": return lang === "bn" ? "নিযুক্ত" : "Assigned";
      case "On The Way": return lang === "bn" ? "চলমান" : "On The Way";
      case "Completed": return lang === "bn" ? "সম্পন্ন" : "Completed";
      case "Cancelled": return lang === "bn" ? "বাতিল" : "Cancelled";
      default: return f;
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-8 relative z-10">
        {/* Premium Greeting & Stats Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8 text-white shadow-xl shadow-slate-950/15 animate-in fade-in duration-300">
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#1E4E8C]/25 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-[#1E4E8C] border border-white/10 flex-shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  {lang === "bn" ? "আমার বুকিংস" : "My Bookings"}
                </h1>
                <p className="text-xs md:text-sm text-slate-300 mt-1 font-semibold leading-relaxed">
                  {lang === "bn"
                    ? "রাজসেবায় আপনার সার্ভিস অনুরোধগুলো পরিচালনা ও ট্র্যাক করুন এবং চ্যাট করুন।"
                    : "Manage, track, and chat about your service requests at Rajseba."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter Tab Pill Bar */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="bg-[#EEF2FF]/40 border border-[#E0E7FF]/40 p-1.5 rounded-full flex gap-1 w-max">
            {(["All", "Pending", "Assigned", "On The Way", "Completed", "Cancelled"] as const).map((tab) => {
              const isActive = filter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all focus:outline-none whitespace-nowrap ${
                    isActive
                      ? "bg-[#1E4E8C] text-white shadow-sm shadow-[#1E4E8C]/10"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                  }`}
                >
                  {langFilterName(tab)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking: any) => <BookingItem key={booking.id} booking={booking} />)
          ) : (
            <div className="bg-white p-12 text-center border border-slate-100 rounded-2xl shadow-sm text-slate-400 font-semibold text-xs">
              {lang === "bn"
                ? `${langFilterName(filter)} বুকিং পাওয়া যায়নি।`
                : `No ${filter.toLowerCase()} bookings found.`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
