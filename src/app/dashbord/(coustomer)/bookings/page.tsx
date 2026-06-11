"use client";

import { useRole } from "@/context/RoleContext";
import { ShieldAlert, Search, Calendar, MapPin, User, ChevronRight, Filter } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Booking {
  id: string;
  service: string;
  provider: string;
  providerPhone: string;
  amount: string;
  date: string;
  timeSlot: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  address: string;
}

export default function BookingsPage() {
  const { role } = useRole();
  const [filter, setFilter] = useState<"All" | "Scheduled" | "In Progress" | "Completed" | "Cancelled">("All");

  if (role !== "customer") {
    return <AccessDenied roleRequired="Customer" />;
  }

  const bookingsList: Booking[] = [
    {
      id: "RS-9284",
      service: "Expert AC Gas Refill",
      provider: "Kabir AC Repair",
      providerPhone: "+880 1712 345678",
      amount: "৳1,400",
      date: "Today, June 12",
      timeSlot: "03:00 PM - 05:00 PM",
      status: "Scheduled",
      address: "House 24, Road 4, Sector 12, Mirpur",
    },
    {
      id: "RS-9128",
      service: "Deep Sofa Cleaning",
      provider: "Clean & Bright",
      providerPhone: "+880 1819 876543",
      amount: "৳2,500",
      date: "May 20, 2026",
      timeSlot: "11:00 AM - 01:00 PM",
      status: "Completed",
      address: "House 24, Road 4, Sector 12, Mirpur",
    },
    {
      id: "RS-9014",
      service: "Full Apartment Painting",
      provider: "Dhaka Decorators",
      providerPhone: "+880 1911 112233",
      amount: "৳15,000",
      date: "Apr 12, 2026",
      timeSlot: "09:00 AM - 05:00 PM",
      status: "Completed",
      address: "House 24, Road 4, Sector 12, Mirpur",
    },
  ];

  const filteredBookings = bookingsList.filter(
    (b) => filter === "All" || b.status === filter
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-500 mt-1">Track and manage your scheduled, active, and past home services.</p>
      </div>

      {/* Status Filter Tab Pill Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
        {(["All", "Scheduled", "In Progress", "Completed", "Cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === tab
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-rose-500">{booking.id}</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      booking.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : booking.status === "In Progress"
                        ? "bg-indigo-50 text-indigo-700"
                        : booking.status === "Cancelled"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800">{booking.service}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-slate-400" />
                    <span>Expert: <strong className="text-slate-700">{booking.provider}</strong> ({booking.providerPhone})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{booking.date} • {booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:col-span-2">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{booking.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price Paid</span>
                  <span className="text-xl font-bold text-slate-800">{booking.amount}</span>
                </div>

                {booking.status === "Scheduled" && (
                  <button className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-[0.97]">
                    Reschedule
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 text-center border border-slate-100 rounded-2xl shadow-sm text-slate-400">
            No bookings found in this category.
          </div>
        )}
      </div>
    </div>
  );
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
  );
}
