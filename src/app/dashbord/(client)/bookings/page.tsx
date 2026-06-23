"use client"

import * as React from "react"
import { useAppSelector } from "@/redux/hooks";
import {
  ShieldAlert,
  Calendar,
  MapPin,
  Briefcase,
  MessageCircle,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking"

type BookingStatus = "Active" | "Scheduled" | "Completed" | "Cancelled"

const STATUS_MAP: Record<string, BookingStatus> = {
  pending: "Scheduled",
  assigned: "Active",
  on_the_way: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
}

const STATUS_TEXT: Record<string, string> = {
  pending: "Pending",
  assigned: "Assigned",
  on_the_way: "On the way",
  completed: "Completed",
  cancelled: "Cancelled",
}

export default function BookingsPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const authUser = useAppSelector((state) => state.auth.user);
  const [filter, setFilter] = React.useState<BookingStatus>("Active")

  const { data: bookingsRes, isLoading } = useGetAllBookingsQuery()

  // Filter only the current user's bookings
  const allBookings = bookingsRes?.data || []
  const myBookings = allBookings.filter((b: any) => {
    const userId = authUser?.id || authUser?._id
    return b.user?.id === userId || b.user?.id === Number(userId)
  })

  const filteredBookings = myBookings.filter((b: any) => {
    const mappedStatus = STATUS_MAP[b.status] || "Scheduled"
    return mappedStatus === filter
  })

  if (role !== "client") {
    return <AccessDenied roleRequired="Customer" />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-rose-500" />
      </div>
    )
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
            filteredBookings.map((booking: any) => (
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
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                        {booking.nestedService?.name || booking.pkg?.name || "Service Booking"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                          {STATUS_TEXT[booking.status] || booking.status}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Order #{booking.id}</span>
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
                  {/* Column 1: Professional */}
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">Professional</span>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm border border-rose-200">
                        {booking.vendor?.name?.[0] || "V"}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{booking.vendor?.name || "Assigned Vendor"}</span>
                    </div>
                  </div>

                  {/* Column 2: Date & Time */}
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">Date</span>
                    <div className="flex items-start gap-2.5">
                      <Calendar size={16} className="text-slate-400 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">
                          {booking.date ? new Date(booking.date).toLocaleDateString("en-BD", { weekday: "short", year: "numeric", month: "short", day: "numeric" }) : "TBD"}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Service Location */}
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">Service Location</span>
                    <div className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-slate-400 mt-0.5" />
                      <span className="text-xs font-bold text-slate-800 leading-relaxed max-w-[200px]">
                        {booking.location || "Location not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
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
              No {filter.toLowerCase()} bookings found.
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
      </p>
    </div>
  )
}
