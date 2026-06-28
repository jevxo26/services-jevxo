"use client"

import * as React from "react"
import { useAppSelector } from "@/redux/hooks";
import {
  Sparkles,
  Plus,
  Share2,
  ChevronRight,
  Calendar,
  Trash2,
  Star,
  Heart,
  Zap,
  FileText,
  SlidersHorizontal,
  Download,
  MessageCircle,
  Check,
  Briefcase,
  DollarSign,
  Clock,
  ShieldAlert,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { CustomTable } from "@/components/ui/table"
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking"

export default function UnifiedOverviewPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  if (role === "agent") {
    return <AgentOverview />
  }

  return <CustomerOverview />
}

/* ==========================================================================
   1. CUSTOMER OVERVIEW VIEW
   ========================================================================== */
function CustomerOverview() {
  const authUser = useAppSelector((state) => state.auth.user)
  const { data: bookingsRes, isLoading: loadingBookings } = useGetAllBookingsQuery()

  const allBookings = bookingsRes?.data || []
  const userId = authUser?.id || authUser?._id
  const myBookings = allBookings.filter((b: any) => b.user?.id === userId || b.user?.id === Number(userId))
  const activeBookings = myBookings.filter((b: any) => ["assigned", "on_the_way"].includes(b.status))
  const completedBookings = myBookings.filter((b: any) => b.status === "completed")
  const recentHistory = completedBookings.slice(0, 5)

  const customerColumns = [
    {
      key: "id",
      header: "Booking ID",
      render: (b: any) => <span className="font-bold text-brand-primary">#{b.id}</span>
    },
    {
      key: "service",
      header: "Service",
      render: (b: any) => <span className="font-semibold text-slate-900">{b.nestedService?.name || b.pkg?.name || "Service"}</span>
    },
    {
      key: "vendor",
      header: "Expert Provider",
      render: (b: any) => <span>{b.vendor?.name || "—"}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (b: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${b.status === "completed"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700"
            }`}
        >
          {b.status}
        </span>
      )
    },
    {
      key: "createdAt",
      header: "Date",
      render: (b: any) => <span>{new Date(b.createdAt).toLocaleDateString("en-BD")}</span>
    }
  ]

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-8 relative z-10">

        {/* Premium Greeting & Stats Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8 text-white shadow-xl shadow-slate-950/15">
          {/* Decorative Glow Circles */}
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#FF6014]/25 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left side: User Profile Greeting */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-[#FFF0EB]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6014] animate-pulse" />
                <span>Client Dashboard</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  Hello, {authUser?.name || "Client"}
                </h1>
                <p className="text-xs md:text-sm text-slate-300 mt-1 font-medium">
                  It's a great day to refresh your home with Rajseba.
                </p>
              </div>
            </div>

            {/* Right side: Modern Counters */}
            <div className="flex items-center gap-3 sm:gap-4 self-stretch md:self-auto">
              <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 min-w-[105px] text-center hover:bg-white/15 transition-all">
                {loadingBookings ? (
                  <Loader2 size={18} className="animate-spin text-[#FF6014] mx-auto" />
                ) : (
                  <span className="text-2xl md:text-3xl font-black text-[#FF6014] block leading-tight">
                    {activeBookings.length.toString().padStart(2, "0")}
                  </span>
                )}
                <span className="text-[9px] font-bold text-slate-300 tracking-wider uppercase mt-1 block">Active</span>
              </div>

              <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 min-w-[105px] text-center hover:bg-white/15 transition-all">
                {loadingBookings ? (
                  <Loader2 size={18} className="animate-spin text-emerald-400 mx-auto" />
                ) : (
                  <span className="text-2xl md:text-3xl font-black text-emerald-400 block leading-tight">
                    {completedBookings.length.toString().padStart(2, "0")}
                  </span>
                )}
                <span className="text-[9px] font-bold text-slate-300 tracking-wider uppercase mt-1 block">Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Banners Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/services"
            className="relative overflow-hidden bg-[#FF6014] text-white p-6 rounded-[28px] shadow-lg shadow-[#FF6014]/10 flex items-center justify-between group hover:opacity-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full border border-white/10">
                <Plus size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight flex items-center gap-1">
                  Book a New Service <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-rose-100 mt-0.5 font-medium">Get professional help today</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FFF8F4] rounded-2xl text-[#FF6014]">
                <Share2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Refer a Friend</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-semibold">Earn credits for sharing</p>
              </div>
            </div>
            <button className="p-2.5 bg-[#FF6014] text-white rounded-full hover:bg-[#E0530A] transition-colors shadow-sm focus:outline-none">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Active Bookings Section */}
        {activeBookings.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Bookings</h2>
              <Link href="/dashbord/bookings" className="text-xs font-bold text-[#FF6014] hover:underline">
                View All &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeBookings.slice(0, 2).map((booking: any) => (
                <div key={booking.id} className="bg-white p-6 rounded-[28px] border border-slate-100/80 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-[#FF6014] text-base">
                        {booking.nestedService?.name || booking.pkg?.name || "Service Booking"}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">ID: #{booking.id}</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                      booking.status === "on_the_way" ? "text-[#E0530A] bg-[#FFF8F4]" : "text-amber-600 bg-amber-50"
                    }`}>
                      {booking.status === "on_the_way" ? "On the Way" : booking.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#E0530A] font-bold text-sm">
                        {booking.vendor?.name?.[0] || "V"}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{booking.vendor?.name || "Assigned Vendor"}</h4>
                        <p className="text-[10px] font-semibold text-slate-400">Verified Specialist</p>
                      </div>
                    </div>
                    <button className="p-2 bg-white text-[#FF6014] rounded-xl hover:bg-[#FFF8F4] border border-slate-100 shadow-sm transition-colors">
                      <MessageCircle size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={13} />
                    <span>{booking.date ? new Date(booking.date).toLocaleDateString("en-BD") : "Date TBD"}</span>
                    <span className="mx-1">•</span>
                    <span className="truncate max-w-[140px]">{booking.location || "Location not set"}</span>
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
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Booking History</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 shadow-sm transition-colors">
                  <SlidersHorizontal size={14} />
                </button>
                <button className="p-2 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 shadow-sm transition-colors">
                  <Download size={14} />
                </button>
              </div>
            </div>

            <CustomTable
              columns={customerColumns}
              data={myBookings}
              searchKey="id"
              searchPlaceholder="Search bookings..."
              pageSize={5}
            />
          </div>
        )}

      </div>
    </div>
  )
}

/* ==========================================================================
   2. AGENT OVERVIEW VIEW
   ========================================================================== */
function AgentOverview() {
  const authUser = useAppSelector((state) => state.auth.user)
  const { data: bookingsRes, isLoading } = useGetAllBookingsQuery()
  const allBookings = (bookingsRes?.data || []) as any[]

  const totalOrders = allBookings.length
  const todayOrders = allBookings.filter((b: any) => {
    const created = new Date(b.createdAt)
    const today = new Date()
    return created.toDateString() === today.toDateString()
  }).length

  const stats = [
    { label: "Total Bookings", value: isLoading ? "—" : `${totalOrders}`, desc: "All time bookings", icon: Briefcase, color: "text-[#E0530A] bg-[#FFF8F4]" },
    { label: "Today's Bookings", value: isLoading ? "—" : `${todayOrders}`, desc: "Placed today", icon: Zap, color: "text-amber-600 bg-amber-50" },
    { label: "Completed", value: isLoading ? "—" : `${allBookings.filter((b: any) => b.status === "completed").length}`, desc: "Total completed orders", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending", value: isLoading ? "—" : `${allBookings.filter((b: any) => b.status === "pending").length}`, desc: "Awaiting assignment", icon: Clock, color: "text-indigo-600 bg-indigo-50" },
  ]

  const columns = [
    {
      key: "id",
      header: "Booking ID",
      render: (o: any) => <span className="font-bold text-brand-primary">#{o.id}</span>
    },
    {
      key: "user",
      header: "Client Name",
      render: (o: any) => <span>{o.user?.name || "—"}</span>
    },
    {
      key: "nestedService",
      header: "Service Booked",
      render: (o: any) => <span>{o.nestedService?.name || o.pkg?.name || "—"}</span>
    },
    {
      key: "vendor",
      header: "Vendor",
      render: (o: any) => <span>{o.vendor?.name || "—"}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (o: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${o.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"}`}>
          {o.status}
        </span>
      )
    },
    {
      key: "createdAt",
      header: "Date",
      render: (o: any) => <span>{new Date(o.createdAt).toLocaleDateString("en-BD")}</span>
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-200">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Agent Overview</h1>
            <p className="text-xs text-slate-400 mt-0.5">Hello, {authUser?.name || "Agent"}! Manage bookings and track activity.</p>
          </div>
        </div>
        <Link
          href="/dashbord/quick-booking"
          className="bg-[#FF6014] hover:bg-[#E0530A] text-white font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-[#FF6014]/20 text-sm transition-all active:scale-[0.985] text-center"
        >
          Book a New Lead
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h4>
                <span className="text-xs text-slate-400 mt-1 block font-medium">{stat.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Recent Lead Orders</h3>
          <Link href="/dashbord/orders" className="text-xs font-bold text-[#FF6014] hover:underline">
            View All &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={32} className="animate-spin text-[#FF6014]" />
          </div>
        ) : (
          <CustomTable
            columns={columns}
            data={allBookings}
            searchKey="id"
            searchPlaceholder="Search bookings..."
            pageSize={5}
          />
        )}
      </div>

    </div>
  )
}
