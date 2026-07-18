"use client";

import React from "react";
import Link from "next/link";
import { Star, ChevronRight, Zap } from "lucide-react";

interface OperationalInsightsProps {
  categoriesCount: number;
  totalVendorsRegistered: number;
  topVendors: any[];
}

export default function OperationalInsights({
  categoriesCount,
  totalVendorsRegistered,
  topVendors,
}: OperationalInsightsProps) {
  return (
    <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 hover:border-[#1E4E8C]/15 hover:shadow-lg hover:shadow-[#1E4E8C]/5 transition-all duration-300 p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Operational Insights</h3>
            <p className="text-xs text-slate-400 font-medium">Top vendors & category activity</p>
          </div>
          <div className="p-2.5 bg-[#EEF2FF] text-[#1E4E8C] rounded-2xl">
            <Zap size={20} />
          </div>
        </div>

        {/* Quick stats indicators */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-50/60 p-3 rounded-2xl border border-slate-100/50 flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Categories</span>
            <span className="text-sm font-black text-slate-800 mt-1">{categoriesCount} Active</span>
          </div>
          <div className="bg-slate-50/60 p-3 rounded-2xl border border-slate-100/50 flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Vendors</span>
            <span className="text-sm font-black text-[#1E4E8C] mt-1">{totalVendorsRegistered} Registered</span>
          </div>
        </div>

        {/* Top Vendors Section */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Top Performing Vendors</h4>
          <div className="space-y-3">
            {topVendors.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 font-medium bg-slate-50/40 rounded-2xl border border-slate-100">
                No vendor profiles found.
              </div>
            ) : (
              topVendors.map((vendor: any, idx: number) => (
                <div
                  key={vendor.id || idx}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100 group/v"
                >
                  {vendor.avatar ? (
                    <img
                      src={vendor.avatar}
                      alt={vendor.company_name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-100"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E4E8C]/10 to-[#FFBAB4]/10 flex items-center justify-center text-xs font-bold text-[#1E4E8C]">
                      {vendor.company_name?.substring(0, 2).toUpperCase() || "VD"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-slate-800 truncate group-hover/v:text-[#1E4E8C] transition-colors">
                      {vendor.company_name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                      {vendor.serviceArea || "Dhaka Division"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-amber-500 font-extrabold text-[10px]">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{vendor.rating || "5.0"}</span>
                    </div>
                    <p className="text-[10px] text-[#1E4E8C] font-bold mt-0.5">৳{vendor.min_starting_price || 400}+</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick action button */}
      <div className="mt-5 pt-3 border-t border-slate-100">
        <Link
          href="/dashbord/vendors"
          className="w-full py-2.5 bg-slate-50 hover:bg-[#1E4E8C] hover:text-white rounded-2xl border border-slate-100 hover:border-[#1E4E8C] transition-all text-xs font-bold text-slate-600 flex items-center justify-center gap-1 shadow-2xs"
        >
          <span>Manage Vendors</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
