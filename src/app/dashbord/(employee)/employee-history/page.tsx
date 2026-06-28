"use client"

import * as React from "react"
import { useAppSelector } from "@/redux/hooks";
import {
  ShieldAlert,
  Calendar,
  MapPin,
  Briefcase,
  Loader2,
  CheckCircle2,
  History
} from "lucide-react"
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking"

export default function EmployeeHistoryPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const authUser = useAppSelector((state) => state.auth.user);

  const { data: bookingsRes, isLoading } = useGetAllBookingsQuery()

  // Filter only the current user's assigned bookings that ARE completed
  const allBookings = bookingsRes?.data || []
  const myCompletedTasks = allBookings.filter((b: any) => {
    const isAssigned = b.employees?.some((emp: any) => emp.id === (authUser?.id || authUser?._id));
    return isAssigned && b.status === "completed";
  })

  if (role !== "employee") {
    return <AccessDenied roleRequired="Employee" />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#10B981]" />
      </div>
    )
  }

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-8 relative z-10">

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Task History</h1>
              <p className="text-xs text-slate-400 mt-0.5">View your previously completed service assignments.</p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {myCompletedTasks.length > 0 ? (
            myCompletedTasks.map((booking: any) => (
              <div
                key={booking.id}
                className="bg-white rounded-[28px] border border-emerald-100 p-6 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Background Completed Stamp */}
                <div className="absolute -right-8 -top-8 text-emerald-50/50 pointer-events-none transform -rotate-12">
                  <CheckCircle2 size={160} />
                </div>

                {/* Top Row: Service Name, Status */}
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-500">
                      <Briefcase size={22} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                        {booking.nestedService?.name || booking.pkg?.name || "Service Booking"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                          COMPLETED
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Order #{booking.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      {new Date(booking.updatedAt || booking.createdAt).toLocaleDateString("en-BD")}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50 relative z-10">
                  {/* Column 1: Client */}
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">Client</span>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-sm border border-blue-100">
                        {booking.user?.name?.[0] || "C"}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{booking.user?.name || "Customer"}</span>
                    </div>
                  </div>

                  {/* Column 2: Date & Time */}
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">Service Date</span>
                    <div className="flex items-start gap-2.5">
                      <Calendar size={16} className="text-slate-400 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">
                          {booking.date ? new Date(booking.date).toLocaleDateString("en-BD", { weekday: "short", year: "numeric", month: "short", day: "numeric" }) : "TBD"}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{booking.time || "Time not specified"}</span>
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
              </div>
            ))
          ) : (
            <div className="bg-white p-12 text-center border border-slate-100 rounded-2xl shadow-sm text-slate-400 flex flex-col items-center">
              <History size={48} className="text-slate-200 mb-4" />
              <p className="font-semibold text-slate-600">You haven't completed any tasks yet.</p>
              <p className="text-xs mt-1">Once you complete assigned tasks, they will appear here.</p>
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
