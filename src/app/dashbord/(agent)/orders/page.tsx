"use client";

import React from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import AccessDenied from "../../(client)/components/AccessDenied";
import { useAgentOrders } from "./hooks/useAgentOrders";
import { useAppSelector } from "@/redux/hooks";

export default function AgentOrdersPage() {
  const state = useAgentOrders();
  const lang = useAppSelector((state) => state.lang.value);

  if (state.role !== "agent") {
    return <AccessDenied roleRequired="Agent" />;
  }

  const columns = [
    {
      key: "id",
      header: lang === "bn" ? "অর্ডার আইডি" : "Order ID",
      render: (o: any) => <span className="font-bold text-brand-primary">#{o.id}</span>,
    },
    {
      key: "user",
      header: lang === "bn" ? "গ্রাহক" : "Client",
      render: (o: any) => (
        <div>
          <p className="font-bold text-slate-900 leading-none">{o.user?.name || "—"}</p>
          <p className="text-xs text-slate-400 mt-1">{o.user?.phone || ""}</p>
        </div>
      ),
    },
    {
      key: "nestedService",
      header: lang === "bn" ? "সার্ভিসের তথ্য" : "Service Info",
      render: (o: any) => <span>{o.nestedService?.name || o.pkg?.name || "—"}</span>,
    },
    {
      key: "vendor",
      header: lang === "bn" ? "নিযুক্ত সেবাদাতা" : "Assigned Provider",
      render: (o: any) => <span>{o.vendor?.name || "—"}</span>,
    },
    {
      key: "location",
      header: lang === "bn" ? "অবস্থান" : "Location",
      render: (o: any) => <span className="text-xs">{o.location || "—"}</span>,
    },
    {
      key: "status",
      header: lang === "bn" ? "অবস্থা" : "Status",
      render: (o: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            o.status === "completed"
              ? "bg-emerald-50 text-emerald-700"
              : o.status === "assigned" || o.status === "on_the_way"
              ? "bg-indigo-50 text-indigo-700"
              : o.status === "cancelled"
              ? "bg-red-50 text-red-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {o.status === "completed"
            ? (lang === "bn" ? "সম্পন্ন" : "completed")
            : o.status === "assigned"
            ? (lang === "bn" ? "নিযুক্ত" : "assigned")
            : o.status === "on_the_way"
            ? (lang === "bn" ? "চলমান" : "on the way")
            : o.status === "cancelled"
            ? (lang === "bn" ? "বাতিল" : "cancelled")
            : (lang === "bn" ? "পেন্ডিং" : o.status)}
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
          <div className="p-2.5 bg-[#EEF2FF] text-[#1E4E8C] rounded-2xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {lang === "bn" ? "সাম্প্রতিক অর্ডারসমূহ" : "Recent Orders"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === "bn"
                ? "আপনার এজেন্ট প্রোফাইল দ্বারা পরিচালিত সমস্ত বুকিংয়ের সম্পূর্ণ লেনদেন খতিয়ান।"
                : "Full transaction ledger of all bookings managed by your agent profile."}
            </p>
          </div>
        </div>
      </div>

      {state.isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#1E4E8C]" />
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={state.allBookings}
          searchKey="id"
          searchPlaceholder={lang === "bn" ? "আইডি দ্বারা অর্ডার খুঁজুন..." : "Search orders by ID..."}
          filterKey="status"
          filterPlaceholder={lang === "bn" ? "সব ধরণের অবস্থা" : "All Statuses"}
          filterOptions={[
            { label: lang === "bn" ? "সম্পন্ন" : "Completed", value: "completed" },
            { label: lang === "bn" ? "নিযুক্ত" : "Assigned", value: "assigned" },
            { label: lang === "bn" ? "পেন্ডিং" : "Pending", value: "pending" },
            { label: lang === "bn" ? "চলমান" : "On the Way", value: "on_the_way" },
            { label: lang === "bn" ? "বাতিল" : "Cancelled", value: "cancelled" },
          ]}
          pageSize={10}
        />
      )}
    </div>
  );
}
