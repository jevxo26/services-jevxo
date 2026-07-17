"use client";

import React from "react";
import { Briefcase, Calendar, MapPin, MessageCircle, Loader2, Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { printBookingInvoice } from "@/utils/invoicePrint";

interface BookingItemProps {
  booking: any;
}

export default function BookingItem({ booking }: BookingItemProps) {
  const router = useRouter();
  const lang = useAppSelector((state) => state.lang.value);

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

  return (
    <div className="bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      {/* Top Row: Service Name, Status, Price */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#EEF2FF] border border-[#E0E7FF] rounded-2xl flex items-center justify-center text-[#4F46E5]">
            <Briefcase size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              {booking.nestedService?.name || booking.pkg?.name || (lang === "bn" ? "সার্ভিস বুকিং" : "Service Booking")}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#4338CA]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4338CA] animate-pulse" />
                {getStatusText(booking.status)}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {lang === "bn" ? `অর্ডার #${booking.id}` : `Order #${booking.id}`}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
            {new Date(booking.createdAt).toLocaleDateString("en-BD")}
          </span>
        </div>
      </div>

      {/* Middle Row: Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
        {/* Column 1: Assigned Personnel */}
        <div>
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">
            {lang === "bn" ? "নিযুক্ত কর্মী/ভেন্ডর" : "Assigned To"}
          </span>
          <div className="flex flex-col gap-2">
            {booking.vendor && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E0E7FF] flex items-center justify-center text-[#4338CA] font-bold text-xs border border-[#4F46E5]/30">
                  {booking.vendor?.name?.[0] || "V"}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {booking.vendor?.name || (lang === "bn" ? "নিযুক্ত ভেন্ডর" : "Assigned Vendor")}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {lang === "bn" ? "সার্ভিস প্রোভাইডার" : "Service Provider"}
                  </span>
                </div>
              </div>
            )}

            {booking.employees &&
              booking.employees.length > 0 &&
              booking.employees.map((emp: any) => (
                <div key={emp.id} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100">
                    {emp.name?.[0] || "E"}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{emp.name}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {lang === "bn" ? "টেকনিশিয়ান" : "Technician"}
                    </span>
                  </div>
                </div>
              ))}

            {!booking.vendor && (!booking.employees || booking.employees.length === 0) && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-200">
                  ?
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {lang === "bn" ? "এখনো নিযুক্ত করা হয়নি" : "Not assigned yet"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Date & Time */}
        <div>
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">
            {lang === "bn" ? "তারিখ" : "Date"}
          </span>
          <div className="flex items-start gap-2.5">
            <Calendar size={16} className="text-slate-400 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                {booking.date
                  ? new Date(booking.date).toLocaleDateString("en-BD", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "TBD"}
              </h4>
            </div>
          </div>
        </div>

        {/* Column 3: Service Location */}
        <div>
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">
            {lang === "bn" ? "সার্ভিসের স্থান" : "Service Location"}
          </span>
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="text-slate-400 mt-0.5" />
            <span className="text-xs font-bold text-slate-800 leading-relaxed max-w-[200px]">
              {booking.location || (lang === "bn" ? "অবস্থান দেওয়া হয়নি" : "Location not provided")}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2 flex-wrap">
          {booking.vendor && (
            <button
              onClick={() =>
                router.push(
                  `/dashbord/live-chat?receiverId=${booking.vendor.id}&receiverName=${encodeURIComponent(
                    booking.vendor.name
                  )}`
                )
              }
              className="flex items-center gap-1.5 text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              <MessageCircle size={14} />
              <span>{lang === "bn" ? "ভেন্ডরের সাথে চ্যাট" : "Chat Vendor"}</span>
            </button>
          )}
          {booking.employees?.map((emp: any) => (
            <button
              key={emp.id}
              onClick={() =>
                router.push(
                  `/dashbord/live-chat?receiverId=${emp.id}&receiverName=${encodeURIComponent(emp.name)}`
                )
              }
              className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              <MessageCircle size={14} />
              <span>
                {lang === "bn"
                  ? `${emp.name?.split(" ")[0]} এর সাথে চ্যাট`
                  : `Chat ${emp.name?.split(" ")[0]}`}
              </span>
            </button>
          ))}
          {!booking.vendor && (!booking.employees || booking.employees.length === 0) && (
            <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />{" "}
              {lang === "bn" ? "সেবাদাতার জন্য অপেক্ষা করা হচ্ছে" : "Waiting for provider"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <button
            onClick={() => printBookingInvoice(booking)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#EEF2FF] border border-[#4F46E5]/20 hover:bg-[#4F46E5] hover:text-white text-[#4F46E5] text-xs font-bold py-2.5 px-4 rounded-2xl transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <Download size={14} />
            <span>{lang === "bn" ? "ইনভয়েস" : "Invoice"}</span>
          </button>
          <button
            onClick={() => router.push(`/dashbord/bookings/${booking.id}`)}
            className="flex-1 sm:flex-none bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 sm:px-6 rounded-2xl transition-colors active:scale-[0.98] cursor-pointer"
          >
            {lang === "bn" ? "বিস্তারিত দেখুন" : "View Details"}
          </button>
          <Link
            href={`/dashbord/bookings/track/${booking.id}`}
            className="flex-1 sm:flex-none bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold py-2.5 px-4 sm:px-6 rounded-2xl transition-all shadow-sm shadow-[#4F46E5]/10 active:scale-[0.98] inline-block text-center"
          >
            {lang === "bn" ? "অর্ডার ট্র্যাক করুন" : "Track Order"}
          </Link>
        </div>
      </div>
    </div>
  );
}
