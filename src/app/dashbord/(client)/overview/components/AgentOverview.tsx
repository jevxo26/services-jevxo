"use client";

import React from "react";
import { Sparkles, Briefcase, Zap, DollarSign, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { CustomTable } from "@/components/ui/table";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";

export default function AgentOverview() {
  const authUser = useAppSelector((state) => state.auth.user);
  const lang = useAppSelector((state) => state.lang.value);
  const { data: bookingsRes, isLoading } = useGetAllBookingsQuery();
  const allBookings = (bookingsRes?.data || []) as any[];

  const totalOrders = allBookings.length;
  const todayOrders = allBookings.filter((b: any) => {
    const created = new Date(b.createdAt);
    const today = new Date();
    return created.toDateString() === today.toDateString();
  }).length;

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

  const stats = [
    {
      label: lang === "bn" ? "মোট বুকিং" : "Total Bookings",
      value: isLoading ? "—" : `${totalOrders}`,
      desc: lang === "bn" ? "সর্বকালের বুকিং" : "All time bookings",
      icon: Briefcase,
      color: "text-[#4338CA] bg-[#EEF2FF]",
    },
    {
      label: lang === "bn" ? "আজকের বুকিং" : "Today's Bookings",
      value: isLoading ? "—" : `${todayOrders}`,
      desc: lang === "bn" ? "আজ অর্ডার করা হয়েছে" : "Placed today",
      icon: Zap,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: lang === "bn" ? "সম্পন্ন" : "Completed",
      value: isLoading ? "—" : `${allBookings.filter((b: any) => b.status === "completed").length}`,
      desc: lang === "bn" ? "মোট সম্পন্ন অর্ডার" : "Total completed orders",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: lang === "bn" ? "পেন্ডিং" : "Pending",
      value: isLoading ? "—" : `${allBookings.filter((b: any) => b.status === "pending").length}`,
      desc: lang === "bn" ? "নিযুক্তির অপেক্ষায়" : "Awaiting assignment",
      icon: Clock,
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  const columns = [
    {
      key: "id",
      header: lang === "bn" ? "বুকিং আইডি" : "Booking ID",
      render: (o: any) => <span className="font-bold text-brand-primary">#{o.id}</span>,
    },
    {
      key: "user",
      header: lang === "bn" ? "গ্রাহকের নাম" : "Client Name",
      render: (o: any) => <span>{o.user?.name || "—"}</span>,
    },
    {
      key: "nestedService",
      header: lang === "bn" ? "বুক করা সার্ভিস" : "Service Booked",
      render: (o: any) => <span>{o.nestedService?.name || o.pkg?.name || "—"}</span>,
    },
    {
      key: "vendor",
      header: lang === "bn" ? "ভেন্ডর" : "Vendor",
      render: (o: any) => <span>{o.vendor?.name || "—"}</span>,
    },
    {
      key: "status",
      header: lang === "bn" ? "অবস্থা" : "Status",
      render: (o: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            o.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"
          }`}
        >
          {getStatusText(o.status)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: lang === "bn" ? "তারিখ" : "Date",
      render: (o: any) => <span>{new Date(o.createdAt).toLocaleDateString("en-BD")}</span>,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EEF2FF] text-[#4F46E5] rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {lang === "bn" ? "এজেন্ট ওভারভিউ" : "Agent Overview"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {lang === "bn"
                ? `হ্যালো, ${authUser?.name || "এজেন্ট"}! বুকিং পরিচালনা ও কার্যক্রম ট্র্যাক করুন।`
                : `Hello, ${authUser?.name || "Agent"}! Manage bookings and track activity.`}
            </p>
          </div>
        </div>
        <Link
          href="/dashbord/quick-booking"
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-[#4F46E5]/20 text-sm transition-all active:scale-[0.985] text-center"
        >
          {lang === "bn" ? "নতুন লিড বুক করুন" : "Book a New Lead"}
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
          <h3 className="text-lg font-bold text-slate-900">
            {lang === "bn" ? "সাম্প্রতিক লিড অর্ডার" : "Recent Lead Orders"}
          </h3>
          <Link href="/dashbord/orders" className="text-xs font-bold text-[#4F46E5] hover:underline">
            {lang === "bn" ? "সব দেখুন" : "View All"} &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={32} className="animate-spin text-[#4F46E5]" />
          </div>
        ) : (
          <CustomTable
            columns={columns}
            data={allBookings}
            searchKey="id"
            searchPlaceholder={lang === "bn" ? "বুকিং খুঁজুন..." : "Search bookings..."}
            pageSize={5}
          />
        )}
      </div>
    </div>
  );
}
