"use client"

import * as React from "react"
import { useAppSelector } from "@/redux/hooks";
import {
  ShieldAlert,
  Plus,
  CreditCard,
  Download,
  ChevronRight,
  Trash2,
  Copy,
  SlidersHorizontal,
  ArrowRight,
  FileText,
  Sparkles,
  Wrench,
  BadgeCent,
  Gift,
  Loader2
} from "lucide-react"
import { useGetUserProfileQuery } from "@/redux/features/auth/authApi"
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking"

export default function WalletPage() {
  const rawRole = useAppSelector((state) => state.auth.role);
  const role = typeof rawRole === "string" ? rawRole.toLowerCase().replace(/\s+/g, "") : "client";
  const [copied, setCopied] = React.useState(false)
  const [autoRecharge, setAutoRecharge] = React.useState(true)

  const { data: profileData, isLoading: isProfileLoading } = useGetUserProfileQuery()
  const { data: bookingsRes, isLoading: isBookingsLoading } = useGetAllBookingsQuery(undefined)
  const myCompletedBookings = bookingsRes?.data?.filter((b: any) =>
    b.status === "completed" && (b.user?.id === profileData?.data?.id || b.user?._id === profileData?.data?._id)
  ) || []

  const totalExpense = myCompletedBookings.reduce((sum: number, b: any) => sum + Number(b.total_price || 0), 0)

  const walletBalance = (profileData as any)?.data?.wallet_balance ?? (profileData as any)?.wallet_balance ?? 0

  // We will map myCompletedBookings to transactions below

  const handleCopyCode = () => {
    navigator.clipboard.writeText("RAJSEBA500")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (role !== "client" && role !== "agent") {
    return <AccessDenied roleRequired="Customer or Agent" />
  }

  if (isProfileLoading || isBookingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#FF6014]" />
      </div>
    )
  }

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-6 md:space-y-8 relative z-10">

        {/* Premium Header Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8 text-white shadow-xl shadow-slate-950/15 animate-in fade-in duration-300">
          {/* Decorative Glow Circles */}
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#FF6014]/25 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-[#FF6014] border border-white/10 flex-shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">My Wallet</h1>
                <p className="text-xs md:text-sm text-slate-300 mt-1 font-semibold leading-relaxed">
                  Manage payment options, invoices, and promo coupons at Rajseba.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Balance & Quick Manage Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Display Card Wrapper */}
          <div className="lg:col-span-2 space-y-6">
            {/* Premium Virtual Card */}
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-[#E0530A] p-6 sm:p-8 text-white shadow-xl shadow-slate-950/20 border border-slate-800 flex flex-col justify-between aspect-[1.75/1] max-w-[420px] sm:max-w-full group hover:shadow-2xl hover:shadow-[#FF6014]/5 transition-all duration-300">
              {/* Mesh/Grid Background Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#FF6014]/20 blur-3xl pointer-events-none" />

              {/* Card Top Row */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Microchip */}
                  <div className="w-10 h-8 rounded-md bg-gradient-to-br from-[#FFE0B2] to-[#FFA726] border border-amber-300 relative shadow-inner overflow-hidden flex flex-col justify-between p-1 shrink-0">
                    <div className="flex justify-between w-full h-px bg-amber-700/30" />
                    <div className="flex justify-between w-full h-px bg-amber-700/30" />
                    <div className="flex justify-between w-full h-px bg-amber-700/30" />
                    {/* Chip lines */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between h-4 border-x border-amber-700/30">
                      <div className="w-full h-px bg-amber-700/30 my-auto" />
                    </div>
                  </div>
                  {/* Contactless Icon */}
                  <svg className="w-5 h-5 text-white/60 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12c0-2.2 1.8-4 4-4s4 1.8 4 4" />
                    <path d="M3 12c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                    <path d="M7 12c0-1.1.9-2 2-2s2 .9 2 2" />
                  </svg>
                </div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
                  Rajseba Pay
                </span>
              </div>

              {/* Card Middle Row (Wallet Balance) */}
              <div className="relative z-10 space-y-1 mt-6 sm:mt-8">
                <span className="text-[9px] font-bold text-slate-300 tracking-widest uppercase block">Wallet Balance</span>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white flex items-baseline gap-1.5">
                  <span>৳</span>
                  <span>{Number(walletBalance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Card Bottom Row */}
              <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-4 mt-6">
                <div>
                  <span className="text-[7px] font-bold text-slate-300 tracking-wider uppercase block">Card Holder</span>
                  <span className="text-xs font-bold text-white block mt-0.5 tracking-wide">
                    {profileData?.data?.name || "Valued Client"}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[7px] font-bold text-slate-300 tracking-wider uppercase block">Total Expenses</span>
                  <span className="text-xs font-bold text-white block mt-0.5 tracking-wide">
                    ৳ {Number(totalExpense).toLocaleString("en-BD")}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-[420px] sm:max-w-full">
              <button className="bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-bold px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-sm shadow-[#FF6014]/10 active:scale-[0.98] transition-all w-full sm:w-auto">
                <Plus size={16} /> Add Funds
              </button>
              <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all w-full sm:w-auto">
                <FileText size={16} /> Withdraw
              </button>
            </div>
          </div>

          {/* Quick Manage Card */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between gap-4">
            <h3 className="font-extrabold text-slate-800 text-base">Quick Manage</h3>

            <div className="space-y-2.5">
              {/* Manage Cards */}
              <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-slate-500 border border-slate-100">
                    <CreditCard size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Manage Cards</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>

              {/* Auto-Recharge Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-slate-500 border border-slate-100">
                    <Download size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Auto-Recharge</span>
                </div>
                <button
                  onClick={() => setAutoRecharge(!autoRecharge)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${autoRecharge ? "bg-[#FF6014]" : "bg-slate-200"
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${autoRecharge ? "translate-x-4" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>

              {/* Tax Invoices */}
              <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100/40 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-slate-500 border border-slate-100">
                    <FileText size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Tax Invoices</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods & Refer & Earn */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Payment Methods Box */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-800 text-base">Payment Methods</h3>
              <button className="text-xs font-bold text-[#FF6014] hover:underline focus:outline-none">
                Add New
              </button>
            </div>

            <div className="space-y-3">
              {/* Card 1: Visa Platinum */}
              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white font-extrabold text-[10px] tracking-widest shrink-0">
                    VISA
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Visa Platinum</h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">**** **** **** 4242</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-[#FF6014] bg-[#FFF8F4] px-2 py-0.5 rounded-lg">
                  Primary
                </span>
              </div>

              {/* Card 2: bKash */}
              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white font-extrabold text-[9px] shrink-0">
                    bKash
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Personal Account</h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">017 **** 5678</span>
                  </div>
                </div>
                <button className="p-2 bg-slate-50 hover:bg-[#FFF8F4] text-slate-400 hover:text-[#FF6014] rounded-xl transition-colors focus:outline-none">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Refer & Earn ৳500 Coupon Card */}
          <div className="lg:col-span-2 bg-[#FF6014] text-white p-6 rounded-[32px] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
              <Gift size={160} />
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-black tracking-tight">Refer & Earn ৳500</h3>
              <p className="text-xs text-rose-100 leading-relaxed font-semibold max-w-[240px]">
                Invite your friends to Rajseba and both of you will get credit upon their first booking.
              </p>
            </div>

            <div className="relative z-10 mt-6 bg-white/10 border border-white/20 rounded-2xl p-2.5 flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold tracking-widest pl-2 font-mono">RAJSEBA500</span>
              <button
                onClick={handleCopyCode}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors focus:outline-none flex items-center gap-1.5"
              >
                <Copy size={14} />
                <span className="text-[10px] font-bold">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-800 text-lg">Transaction History</h3>
            <button className="p-2 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 shadow-sm transition-colors flex items-center gap-1.5 focus:outline-none">
              <SlidersHorizontal size={14} />
              <span className="text-[10px] font-bold text-slate-600">Filter</span>
            </button>
          </div>

          <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden p-2">
            <div className="overflow-x-auto custom-scrollbar pb-2">
              <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                    <th className="px-3 md:px-6 py-3 md:py-4">Service / Description</th>
                    <th className="px-3 md:px-6 py-3 md:py-4">Date</th>
                    <th className="px-3 md:px-6 py-3 md:py-4">Amount</th>
                    <th className="px-3 md:px-6 py-3 md:py-4 pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/50">
                  {myCompletedBookings.length > 0 ? myCompletedBookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-3 md:px-6 py-3 md:py-4 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl shrink-0 bg-[#FFF8F4] text-[#FF6014]">
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-850">{b.nestedService?.name || b.pkg?.name || "Service Booking"}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Order #{b.id}</span>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs font-semibold text-slate-400">
                        {new Date(b.createdAt).toLocaleDateString("en-BD", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs font-extrabold text-[#FF6014]">
                        - ৳ {Number(b.total_price || 0).toLocaleString("en-BD")}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 pr-6">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-[#FFF8F4] text-[#FF6014] uppercase">
                          EXPENSE
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-3 md:px-6 py-6 text-center text-xs text-slate-400 font-semibold">
                        No completed bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 text-center border-t border-slate-50">
              <button className="text-xs font-bold text-[#FF6014] hover:underline focus:outline-none flex items-center gap-1 mx-auto">
                View All Transactions <ArrowRight size={12} />
              </button>
            </div>
          </div>
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
