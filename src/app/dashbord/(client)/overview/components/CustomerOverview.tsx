"use client";

import React from "react";
import { Sparkles, Plus, Share2, ChevronRight, Calendar, MessageCircle, SlidersHorizontal, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { CustomTable } from "@/components/ui/table";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";

export default function CustomerOverview() {
  const authUser = useAppSelector((state) => state.auth.user);
  const lang = useAppSelector((state) => state.lang.value);
  const { data: bookingsRes, isLoading: loadingBookings } = useGetAllBookingsQuery();

  const allBookings = bookingsRes?.data || [];
  const userId = authUser?.id || authUser?._id;
  const myBookings = allBookings.filter((b: any) => b.user?.id === userId || b.user?.id === Number(userId));
  const activeBookings = myBookings.filter((b: any) => ["assigned", "on_the_way"].includes(b.status));
  const completedBookings = myBookings.filter((b: any) => b.status === "completed");

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return lang === "bn" ? "পেন্ডিং" : "Pending";
      case "assigned":
        return lang === "bn" ? "নিযুক্ত" : "Assigned";
      case "on_the_way":
        return lang === "bn" ? "চলমান" : "On The Way";
      case "completed":
        return lang === "bn" ? "সম্পন্ন" : "Completed";
      case "cancelled":
        return lang === "bn" ? "বাতিল" : "Cancelled";
      default:
        return status;
    }
  };

  const customerColumns = [
    {
      key: "id",
      header: lang === "bn" ? "বুকিং আইডি" : "Booking ID",
      render: (b: any) => <span className="font-bold text-brand-primary">#{b.id}</span>,
    },
    {
      key: "service",
      header: lang === "bn" ? "সার্ভিস" : "Service",
      render: (b: any) => (
        <span className="font-semibold text-slate-900">
          {b.nestedService?.name || b.pkg?.name || (lang === "bn" ? "সার্ভিস" : "Service")}
        </span>
      ),
    },
    {
      key: "vendor",
      header: lang === "bn" ? "অভিজ্ঞ সেবাদাতা" : "Expert Provider",
      render: (b: any) => <span>{b.vendor?.name || "—"}</span>,
    },
    {
      key: "status",
      header: lang === "bn" ? "অবস্থা" : "Status",
      render: (b: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            b.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          {getStatusText(b.status)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: lang === "bn" ? "তারিখ" : "Date",
      render: (b: any) => <span>{new Date(b.createdAt).toLocaleDateString("en-BD")}</span>,
    },
  ];

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-8 relative z-10">
        {/* Premium Greeting & Stats Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8 text-white shadow-xl shadow-slate-950/15">
          {/* Decorative Glow Circles */}
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#4F46E5]/25 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left side: User Profile Greeting */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-[#E0E7FF]">
                <Sparkles className="w-3.5 h-3.5 text-[#4F46E5] animate-pulse" />
                <span>{lang === "bn" ? "গ্রাহক ড্যাশবোর্ড" : "Client Dashboard"}</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  {lang === "bn" ? `হ্যালো, ${authUser?.name || "গ্রাহক"}` : `Hello, ${authUser?.name || "Client"}`}
                </h1>
                <p className="text-xs md:text-sm text-slate-300 mt-1 font-medium">
                  {lang === "bn"
                    ? "রাজসেবার সাথে আপনার ঘর সাজানোর আজ এক চমৎকার দিন।"
                    : "It's a great day to refresh your home with Rajseba."}
                </p>
              </div>
            </div>

            {/* Right side: Modern Counters */}
            <div className="flex items-center gap-3 sm:gap-4 self-stretch md:self-auto">
              <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 min-w-[105px] text-center hover:bg-white/15 transition-all">
                {loadingBookings ? (
                  <Loader2 size={18} className="animate-spin text-[#4F46E5] mx-auto" />
                ) : (
                  <span className="text-2xl md:text-3xl font-black text-[#4F46E5] block leading-tight">
                    {activeBookings.length.toString().padStart(2, "0")}
                  </span>
                )}
                <span className="text-[9px] font-bold text-slate-300 tracking-wider uppercase mt-1 block">
                  {lang === "bn" ? "সক্রিয়" : "Active"}
                </span>
              </div>

              <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 min-w-[105px] text-center hover:bg-white/15 transition-all">
                {loadingBookings ? (
                  <Loader2 size={18} className="animate-spin text-emerald-400 mx-auto" />
                ) : (
                  <span className="text-2xl md:text-3xl font-black text-emerald-400 block leading-tight">
                    {completedBookings.length.toString().padStart(2, "0")}
                  </span>
                )}
                <span className="text-[9px] font-bold text-slate-300 tracking-wider uppercase mt-1 block">
                  {lang === "bn" ? "সম্পন্ন" : "Completed"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Banners Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/services"
            className="relative overflow-hidden bg-[#4F46E5] text-white p-6 rounded-[28px] shadow-lg shadow-[#4F46E5]/10 flex items-center justify-between group hover:opacity-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full border border-white/10">
                <Plus size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight flex items-center gap-1">
                  {lang === "bn" ? "নতুন সার্ভিস বুক করুন" : "Book a New Service"}{" "}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-rose-100 mt-0.5 font-medium">
                  {lang === "bn" ? "আজই পেশাদার সেবা নিন" : "Get professional help today"}
                </p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#EEF2FF] rounded-2xl text-[#4F46E5]">
                <Share2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                  {lang === "bn" ? "বন্ধুকে রেফার করুন" : "Refer a Friend"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-semibold">
                  {lang === "bn" ? "শেয়ার করে ক্রেডিট জিতুন" : "Earn credits for sharing"}
                </p>
              </div>
            </div>
            <button className="p-2.5 bg-[#4F46E5] text-white rounded-full hover:bg-[#4338CA] transition-colors shadow-sm focus:outline-none cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Active Bookings Section */}
        {activeBookings.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {lang === "bn" ? "সক্রিয় বুকিংস" : "Active Bookings"}
              </h2>
              <Link href="/dashbord/bookings" className="text-xs font-bold text-[#4F46E5] hover:underline">
                {lang === "bn" ? "সব দেখুন" : "View All"} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeBookings.slice(0, 2).map((booking: any) => (
                <div
                  key={booking.id}
                  className="bg-white p-6 rounded-[28px] border border-slate-100/80 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-[#4F46E5] text-base">
                        {booking.nestedService?.name || booking.pkg?.name || (lang === "bn" ? "সার্ভিস বুকিং" : "Service Booking")}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">ID: #{booking.id}</span>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        booking.status === "on_the_way" ? "text-[#4338CA] bg-[#EEF2FF]" : "text-amber-600 bg-amber-50"
                      }`}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center text-[#4338CA] font-bold text-sm">
                        {booking.vendor?.name?.[0] || "V"}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">
                          {booking.vendor?.name || (lang === "bn" ? "নিযুক্ত ভেন্ডর" : "Assigned Vendor")}
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-400">
                          {lang === "bn" ? "যাচাইকৃত স্পেশালিস্ট" : "Verified Specialist"}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 bg-white text-[#4F46E5] rounded-xl hover:bg-[#EEF2FF] border border-slate-100 shadow-sm transition-colors cursor-pointer">
                      <MessageCircle size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={13} />
                    <span>{booking.date ? new Date(booking.date).toLocaleDateString("en-BD") : (lang === "bn" ? "তারিখ নির্ধারিত হবে" : "Date TBD")}</span>
                    <span className="mx-1">•</span>
                    <span className="truncate max-w-[140px]">{booking.location || (lang === "bn" ? "অবস্থান নির্ধারণ করা হয়নি" : "Location not set")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service History */}
        {myBookings.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {lang === "bn" ? "বुकিংয়ের ইতিহাস" : "Booking History"}
              </h2>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 shadow-sm transition-colors cursor-pointer">
                  <SlidersHorizontal size={14} />
                </button>
                <button className="p-2 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 shadow-sm transition-colors cursor-pointer">
                  <Download size={14} />
                </button>
              </div>
            </div>

            <CustomTable
              columns={customerColumns}
              data={myBookings}
              searchKey="id"
              searchPlaceholder={lang === "bn" ? "বুকিং খুঁজুন..." : "Search bookings..."}
              pageSize={5}
            />
          </div>
        )}
      </div>
    </div>
  );
}
