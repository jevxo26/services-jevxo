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
import { useRouter } from "next/navigation"
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking"

type BookingStatus = "All" | "Pending" | "Assigned" | "On The Way" | "Completed" | "Cancelled"

const STATUS_MAP: Record<string, BookingStatus> = {
  pending: "Pending",
  assigned: "Assigned",
  on_the_way: "On The Way",
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
  const router = useRouter();
  const [filter, setFilter] = React.useState<BookingStatus>("All")

  const { data: bookingsRes, isLoading } = useGetAllBookingsQuery()

  // Filter only the current user's bookings
  const allBookings = bookingsRes?.data || []
  const myBookings = allBookings.filter((b: any) => {
    const userId = authUser?.id || authUser?._id
    return b.user?.id === userId || b.user?.id === Number(userId)
  })

  const filteredBookings = myBookings.filter((b: any) => {
    if (filter === "All") return true;
    const mappedStatus = STATUS_MAP[b.status] || "Pending"
    return mappedStatus === filter
  })

  if (role !== "client") {
    return <AccessDenied roleRequired="Customer" />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#FF6014]" />
      </div>
    )
  }

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-8 relative z-10">

        {/* Premium Greeting & Stats Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8 text-white shadow-xl shadow-slate-950/15 animate-in fade-in duration-300">
          {/* Decorative Glow Circles */}
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#FF6014]/25 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-[#FF6014] border border-white/10 flex-shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">My Bookings</h1>
                <p className="text-xs md:text-sm text-slate-300 mt-1 font-semibold leading-relaxed">
                  Manage, track, and chat about your service requests at Rajseba.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter Tab Pill Bar (Scrollable on Mobile) */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="bg-[#FFF8F4]/40 border border-[#FFF0EB]/40 p-1.5 rounded-full flex gap-1 w-max">
            {(["All", "Pending", "Assigned", "On The Way", "Completed", "Cancelled"] as const).map((tab) => {
              const isActive = filter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all focus:outline-none whitespace-nowrap ${isActive
                    ? "bg-[#FF6014] text-white shadow-sm shadow-[#FF6014]/10"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                    }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>
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
                    <div className="w-12 h-12 bg-[#FFF8F4] border border-[#FFF0EB] rounded-2xl flex items-center justify-center text-[#FF6014]">
                      <Briefcase size={22} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                        {booking.nestedService?.name || booking.pkg?.name || "Service Booking"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF8F4] text-[#E0530A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E0530A] animate-pulse" />
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
                  {/* Column 1: Assigned Personnel */}
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">Assigned To</span>
                    <div className="flex flex-col gap-2">
                      {booking.vendor && (
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#E0530A] font-bold text-xs border border-[#FF6014]/30">
                            {booking.vendor?.name?.[0] || "V"}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{booking.vendor?.name || "Assigned Vendor"}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">Service Provider</span>
                          </div>
                        </div>
                      )}

                      {booking.employees && booking.employees.length > 0 && (
                        booking.employees.map((emp: any) => (
                          <div key={emp.id} className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100">
                              {emp.name?.[0] || "E"}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">{emp.name}</span>
                              <span className="text-[10px] text-slate-500 font-semibold">Technician</span>
                            </div>
                          </div>
                        ))
                      )}

                      {!booking.vendor && (!booking.employees || booking.employees.length === 0) && (
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-200">
                            ?
                          </div>
                          <span className="text-xs font-bold text-slate-400">Not assigned yet</span>
                        </div>
                      )}
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 flex-wrap">
                    {booking.vendor && (
                      <button
                        onClick={() => router.push(`/dashbord/live-chat?receiverId=${booking.vendor.id}&receiverName=${encodeURIComponent(booking.vendor.name)}`)}
                        className="flex items-center gap-1.5 text-[#FF6014] bg-[#FFF8F4] hover:bg-[#FFF0EB] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors focus:outline-none"
                      >
                        <MessageCircle size={14} />
                        <span>Chat Vendor</span>
                      </button>
                    )}
                    {booking.employees?.map((emp: any) => (
                      <button
                        key={emp.id}
                        onClick={() => router.push(`/dashbord/live-chat?receiverId=${emp.id}&receiverName=${encodeURIComponent(emp.name)}`)}
                        className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors focus:outline-none"
                      >
                        <MessageCircle size={14} />
                        <span>Chat {emp.name?.split(' ')[0]}</span>
                      </button>
                    ))}
                    {!booking.vendor && (!booking.employees || booking.employees.length === 0) && (
                      <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" /> Waiting for provider
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => router.push(`/dashbord/bookings/${booking.id}`)}
                      className="flex-1 sm:flex-none bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 sm:px-6 rounded-2xl transition-colors active:scale-[0.98]"
                    >
                      View Details
                    </button>
                    <Link
                      href={`/dashbord/bookings/track/${booking.id}`}
                      className="flex-1 sm:flex-none bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-bold py-2.5 px-4 sm:px-6 rounded-2xl transition-all shadow-sm shadow-[#FF6014]/10 active:scale-[0.98] inline-block text-center"
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
      <div className="p-4 bg-[#FFF8F4] rounded-2xl text-[#FF6014] mb-4">
        <ShieldAlert size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        This subpage is only accessible to users with the <strong className="text-slate-800">{roleRequired}</strong> role.
      </p>
    </div>
  )
}
