"use client"

import * as React from "react"
import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import {
  ShieldAlert,
  Calendar,
  MapPin,
  Briefcase,
  MessageCircle
} from "lucide-react"
import Link from "next/link"

interface Booking {
  id: string;
  service: string;
  provider: string;
  providerAvatar: string;
  amount: string;
  paymentMethod: string;
  date: string;
  timeSlot: string;
  status: "Active" | "Scheduled" | "Completed" | "Cancelled";
  statusText: string;
  address: string;
}

export default function BookingsPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const [filter, setFilter] = React.useState<"Active" | "Scheduled" | "Completed" | "Cancelled">("Active")

  const bookingsList: Booking[] = [
    {
      id: "RS-99210",
      service: "Premium AC Servicing",
      provider: "Kamrul Islam",
      providerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      amount: "৳1,500",
      paymentMethod: "Paid via Nagad",
      date: "Today, 14 Oct 2024",
      timeSlot: "11:00 AM - 12:00 PM",
      status: "Active",
      statusText: "On the way",
      address: "House 24, Road 7, Dhanmondi",
    },
    {
      id: "RS-92844",
      service: "Expert AC Gas Refill",
      provider: "Kabir AC Repair",
      providerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      amount: "৳1,400",
      paymentMethod: "Paid via Bkash",
      date: "Tomorrow, June 13",
      timeSlot: "03:00 PM - 05:00 PM",
      status: "Scheduled",
      statusText: "Confirmed",
      address: "House 24, Road 4, Sector 12, Mirpur",
    },
    {
      id: "RS-91280",
      service: "Deep Sofa Cleaning",
      provider: "Clean & Bright",
      providerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      amount: "৳2,500",
      paymentMethod: "Cash on Delivery",
      date: "May 20, 2026",
      timeSlot: "11:00 AM - 01:00 PM",
      status: "Completed",
      statusText: "Completed",
      address: "House 24, Road 4, Sector 12, Mirpur",
    },
    {
      id: "RS-90140",
      service: "Full Apartment Painting",
      provider: "Dhaka Decorators",
      providerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
      amount: "৳15,000",
      paymentMethod: "Paid via Visa",
      date: "Apr 12, 2026",
      timeSlot: "09:00 AM - 05:00 PM",
      status: "Cancelled",
      statusText: "Cancelled",
      address: "House 24, Road 4, Sector 12, Mirpur",
    },
  ]

  const filteredBookings = bookingsList.filter((b) => b.status === filter)

  if (role !== "client") {
    return <AccessDenied roleRequired="Customer" />
  }

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-8 relative z-10">
        
        {/* Title Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-slate-500 mt-2 font-semibold text-sm">
            Manage and track your service requests at Rajseba.
          </p>
        </div>

        {/* Status Filter Tab Pill Bar */}
        <div className="bg-rose-50/30 border border-rose-100/30 p-1.5 rounded-full flex gap-1 w-fit">
          {(["Active", "Scheduled", "Completed", "Cancelled"] as const).map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all focus:outline-none ${
                  isActive
                    ? "bg-[#FF5B60] text-white shadow-sm shadow-rose-500/10"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                {/* Top Row: Service Name, Status, Price */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-[#FF464C]">
                      <Briefcase size={22} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">{booking.service}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                          {booking.statusText}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Order #{booking.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-[#FF464C]">{booking.amount}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{booking.paymentMethod}</span>
                  </div>
                </div>

                {/* Middle Row: Details (Professional, Date & Time, Service Location) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                  {/* Column 1: Professional */}
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">Professional</span>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={booking.providerAvatar}
                        alt={booking.provider}
                        className="w-9 h-9 rounded-full object-cover border border-slate-100"
                      />
                      <span className="text-xs font-bold text-slate-800">{booking.provider}</span>
                    </div>
                  </div>

                  {/* Column 2: Date & Time */}
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">Date & Time</span>
                    <div className="flex items-start gap-2.5">
                      <Calendar size={16} className="text-slate-400 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{booking.date}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{booking.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Service Location */}
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">Service Location</span>
                    <div className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-slate-400 mt-0.5" />
                      <span className="text-xs font-bold text-slate-800 leading-relaxed max-w-[200px]">{booking.address}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Contact Professional Link & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <button className="flex items-center gap-2 text-rose-500 hover:text-rose-600 text-xs font-bold transition-colors focus:outline-none">
                    <MessageCircle size={16} />
                    <span>Contact Professional</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-6 rounded-2xl transition-colors active:scale-[0.98]">
                      View Details
                    </button>
                    <Link
                      href="/dashbord/bookings/track"
                      className="bg-[#FF5B60] hover:bg-[#FF464C] text-white text-xs font-bold py-2.5 px-6 rounded-2xl transition-all shadow-sm shadow-rose-500/10 active:scale-[0.98] inline-block text-center"
                    >
                      Track Order
                    </Link>
                  </div>
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
