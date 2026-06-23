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

export default function WalletPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const [copied, setCopied] = React.useState(false)
  const [autoRecharge, setAutoRecharge] = React.useState(true)

  const { data: profileData, isLoading } = useGetUserProfileQuery()

  const walletBalance = (profileData as any)?.data?.wallet_balance ?? (profileData as any)?.wallet_balance ?? 0

  const transactions = [
    {
      id: "1",
      service: "Premium Home Cleaning",
      orderId: "Order #RS-8823",
      date: "May 12, 2024",
      amount: "- ৳ 2,450.00",
      type: "debited" as const,
      status: "DEBITED",
      icon: Sparkles,
    },
    {
      id: "2",
      service: "Wallet Top-up",
      orderId: "via bKash",
      date: "May 10, 2024",
      amount: "+ ৳ 5,000.00",
      type: "credited" as const,
      status: "CREDITED",
      icon: BadgeCent,
    },
    {
      id: "3",
      service: "Pipe Repair & Sanitization",
      orderId: "Order #RS-8756",
      date: "May 08, 2024",
      amount: "- ৳ 1,200.00",
      type: "debited" as const,
      status: "DEBITED",
      icon: Wrench,
    },
  ]

  const handleCopyCode = () => {
    navigator.clipboard.writeText("RAJSEBA500")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (role !== "client") {
    return <AccessDenied roleRequired="Customer" />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#FF7C71]" />
      </div>
    )
  }

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-8 relative z-10">

        {/* Top Balance & Quick Manage Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Display Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-rose-50/70 to-orange-50/40 p-8 rounded-[32px] border border-[#FFEBE9]/60 shadow-sm flex flex-col justify-between min-h-[200px]">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Balance</span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mt-2">
                ৳ {Number(walletBalance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <button className="bg-[#FF7C71] hover:bg-[#FF7C71] text-white text-xs font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2 shadow-sm shadow-[#FF7C71]/10 active:scale-[0.98] transition-all">
                <Plus size={16} /> Add Funds
              </button>
              <button className="bg-white hover:bg-slate-50 border border-slate-100 text-slate-700 text-xs font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2 active:scale-[0.98] transition-all">
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
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${autoRecharge ? "bg-[#FF7C71]" : "bg-slate-200"
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
              <button className="text-xs font-bold text-[#FF7C71] hover:underline focus:outline-none">
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
                <span className="text-[9px] font-bold text-[#FF7C71] bg-[#FFF8F7] px-2 py-0.5 rounded-lg">
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
                <button className="p-2 bg-slate-50 hover:bg-[#FFF8F7] text-slate-400 hover:text-[#FF7C71] rounded-xl transition-colors focus:outline-none">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Refer & Earn ৳500 Coupon Card */}
          <div className="lg:col-span-2 bg-[#FF7C71] text-white p-6 rounded-[32px] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
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
                    <th className="p-4 pl-6">Service / Description</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/50">
                  {transactions.map((txn) => {
                    const Icon = txn.icon;
                    return (
                      <tr key={txn.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-4 pl-6 flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl shrink-0 ${txn.type === "credited" ? "bg-emerald-50 text-emerald-500" : "bg-[#FFF8F7] text-[#FF7C71]"}`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-850">{txn.service}</h4>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{txn.orderId}</span>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-400">
                          {txn.date}
                        </td>
                        <td className={`p-4 text-xs font-extrabold ${txn.type === "credited" ? "text-emerald-500" : "text-[#FF7C71]"}`}>
                          {txn.amount}
                        </td>
                        <td className="p-4 pr-6">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${txn.type === "credited" ? "bg-emerald-50 text-emerald-500" : "bg-[#FFF8F7] text-[#FF7C71]"}`}>
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 text-center border-t border-slate-50">
              <button className="text-xs font-bold text-[#FF7C71] hover:underline focus:outline-none flex items-center gap-1 mx-auto">
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
      <div className="p-4 bg-[#FFF8F7] rounded-2xl text-[#FF7C71] mb-4">
        <ShieldAlert size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        This subpage is only accessible to users with the <strong className="text-slate-800">{roleRequired}</strong> role.
      </p>
    </div>
  )
}
