"use client";

import React from "react";
import { Search, X } from "lucide-react";

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled" | "assigned" | "on_the_way";
const FILTERS: { label: string; value: "all" | BookingStatus }[] = [
  { label: "All Bookings", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Assigned", value: "assigned" },
  { label: "On the way", value: "on_the_way" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

interface BookingFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  activeFilter: "all" | BookingStatus;
  setActiveFilter: (val: "all" | BookingStatus) => void;
}

export default function BookingFilters({ search, setSearch, activeFilter, setActiveFilter }: BookingFiltersProps) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] mb-6 space-y-4">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 focus-within:border-[#4F46E5]/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#4F46E5]/5 transition-all">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bookings by service name or provider..."
          className="flex-1 bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-650 transition-colors">
            <X size={13} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
              activeFilter === f.value
                ? "bg-[#4F46E5] text-white shadow-sm shadow-[#4F46E5]/20"
                : "bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] border border-[#4F46E5]/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
