"use client";

import React from "react";
import { DollarSign, TrendingUp, Briefcase, AlertCircle } from "lucide-react";

interface StatsGridProps {
  overview: {
    revenue: { total: number; today: number };
    withdraws: { totalAmount: number; todayAmount: number };
  };
}

export default function StatsGrid({ overview }: StatsGridProps) {
  const stats = [
    {
      label: "Total Revenue",
      value: `৳${overview.revenue.total.toLocaleString()}`,
      sub: "All time",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Today's Revenue",
      value: `৳${overview.revenue.today.toLocaleString()}`,
      sub: "Today",
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Total Withdraws",
      value: `৳${overview.withdraws.totalAmount.toLocaleString()}`,
      sub: "All time",
      icon: Briefcase,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Today's Withdraws",
      value: `৳${overview.withdraws.todayAmount.toLocaleString()}`,
      sub: "Today",
      icon: AlertCircle,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="group bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-[#1E4E8C]/20 hover:shadow-lg hover:shadow-[#1E4E8C]/5 hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 sm:gap-4 relative overflow-hidden"
          >
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-gradient-to-br from-[#1E4E8C]/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div
              className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl ${stat.color} shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-xs`}
            >
              <Icon size={16} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider truncate">
                {stat.label}
              </p>
              <h4 className="text-sm xs:text-base sm:text-xl md:text-2xl font-black text-slate-800 mt-0.5 sm:mt-1 tracking-tight truncate">
                {stat.value}
              </h4>
              <p className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5 font-semibold">{stat.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
