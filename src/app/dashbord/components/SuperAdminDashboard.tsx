"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";
import { useGetOverviewStatsQuery } from "@/redux/features/admin/dashboardApi";
import { useGetAllProfilesQuery } from "@/redux/features/shared/profileApi";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { CustomTable } from "@/components/ui/table";
import RevenueChart from "./RevenueChart";
import StatsGrid from "./super-admin/StatsGrid";
import UserDemographics from "./super-admin/UserDemographics";
import BookingPipeline from "./super-admin/BookingPipeline";
import OperationalInsights from "./super-admin/OperationalInsights";
import {
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function SuperAdminDashboard() {
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: bookingsRes } = useGetAllBookingsQuery(undefined);
  const { data: overviewRes } = useGetOverviewStatsQuery();
  const { data: profilesRes } = useGetAllProfilesQuery(undefined);
  const { data: categoriesRes } = useGetAllCategoriesQuery(undefined);

  const allBookings = bookingsRes?.data || [];
  const overview = overviewRes?.data || {
    revenue: { total: 0, today: 0, weekly: 0, monthly: 0, chart: [] },
    users: { totalClients: 0, totalVendors: 0, totalAgents: 0 },
    bookings: { todayAssigned: 0, completed: 0, pending: 0 },
    withdraws: { totalAmount: 0, todayAmount: 0, weeklyAmount: 0, monthlyAmount: 0 }
  };

  const topVendors = [...(profilesRes?.data || [])]
    .filter((p: any) => p.company_name)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  const dynamicChartData = overview.revenue.chart.map((c: any) => ({
    month: c.date,
    value: c.amount
  }));

  const recentBookings = [...allBookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(b => ({
      id: String(b.id),
      customer: b.user?.name || "Unknown Customer",
      service: b.nestedService?.name || b.pkg?.name || "Service",
      provider: b.vendor?.name || b.vendor?.email || "Unassigned",
      amount: `৳${Number(b.total_price || 0).toLocaleString()}`,
      status: b.status,
      date: new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
    }));

  const adminColumns = [
    {
      key: "id",
      header: "Booking ID",
      render: (b: any) => <span className="font-bold text-brand-primary">#{b.id}</span>
    },
    { key: "customer", header: "Customer" },
    { key: "service", header: "Service" },
    { key: "provider", header: "Provider" },
    {
      key: "amount",
      header: "Amount",
      render: (b: any) => <span className="font-semibold text-slate-700">{b.amount}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (b: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
            b.status === "completed"
              ? "bg-emerald-50 text-emerald-700"
              : b.status === "on_the_way"
              ? "bg-indigo-50 text-indigo-700"
              : b.status === "assigned"
              ? "bg-amber-50 text-amber-700"
              : b.status === "cancelled"
              ? "bg-red-50 text-red-700"
              : "bg-slate-50 text-slate-700"
          }`}
        >
          {b.status.replace(/_/g, " ")}
        </span>
      )
    },
    {
      key: "date",
      header: "Date",
      render: (b: any) => <span className="text-xs text-slate-500 font-medium">{b.date}</span>
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* ── Premium Header ── */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm px-7 py-6">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-gradient-to-br from-[#1E4E8C]/10 to-[#FFB3AD]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Live Dashboard
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Hello, <span className="text-[#1E4E8C]">{authUser?.name || "Admin"}</span>!
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm font-medium">Real-time statistics and administrative insights for Jevxo Services.</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-700">
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">Bangladesh Standard Time</span>
            </div>
            <div className="w-px h-8 bg-slate-100 hidden sm:block" />
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1E4E8C] to-[#123C73] flex items-center justify-center shadow-lg shadow-[#1E4E8C]/25">
              <Sparkles size={18} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Performance Metrics (Revenue & Withdrawals) ── */}
      <div className="flex items-center justify-between mt-2 px-1">
        <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">Financial Overview</h2>
      </div>
      <StatsGrid overview={overview} />

      {/* ── User & Booking Metrics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        <UserDemographics users={overview.users} />
        <BookingPipeline bookings={overview.bookings} />
      </div>

      {/* ── Revenue Chart & Platform Insights Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Chart Column (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-[#1E4E8C]/15 hover:shadow-lg hover:shadow-[#1E4E8C]/5 transition-all duration-300 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 pt-6 pb-4 flex justify-between items-start border-b border-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Revenue Trends</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Daily breakdown (Last 7 Days)</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                  <span className="inline-block w-3 h-3 rounded-sm bg-gradient-to-b from-[#1E4E8C] to-[#FFBAB4]" />
                  Revenue
                </div>
              </div>
            </div>
            <div className="px-4 pt-4 pb-2">
              <RevenueChart data={dynamicChartData} />
            </div>
          </div>
          <div className="mx-6 mb-6 mt-2 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/70 rounded-2xl border border-slate-100 overflow-hidden">
            {[
              { label: "This Month Rev", value: `৳${overview.revenue.monthly.toLocaleString()}`, accent: "text-[#1E4E8C]" },
              { label: "This Week Rev", value: `৳${overview.revenue.weekly.toLocaleString()}`, accent: "text-indigo-500" },
              { label: "Month Withdraws", value: `৳${overview.withdraws.monthlyAmount.toLocaleString()}`, accent: "text-emerald-500" },
              { label: "Week Withdraws", value: `৳${overview.withdraws.weeklyAmount.toLocaleString()}`, accent: "text-amber-500" },
            ].map((s, i) => (
              <div key={i} className="text-center py-3 px-2">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{s.label}</p>
                <p className={`text-sm font-extrabold mt-1 ${s.accent}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Insights / Activity Column (1/3 width) */}
        <OperationalInsights
          categoriesCount={categoriesRes?.data?.length || 0}
          totalVendorsRegistered={profilesRes?.data?.length || 0}
          topVendors={topVendors}
        />
      </div>

      {/* Recent Bookings Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
          <h3 className="text-lg font-bold text-slate-900">Recent Booking Log</h3>
          <Link href="/dashbord/manage-bookings" className="text-xs font-semibold text-[#1E4E8C] hover:underline flex items-center gap-0.5">
            View All Bookings <ArrowUpRight size={14} />
          </Link>
        </div>
        <CustomTable
          columns={adminColumns}
          data={recentBookings}
          searchKey="customer"
          searchPlaceholder="Search bookings by customer..."
          pageSize={5}
        />
      </div>
    </div>
  );
}
