"use client";

import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import { ShieldAlert, BarChart3, TrendingUp, Sparkles, MapPin, Star, AlertCircle } from "lucide-react";

export default function AnalyticsPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  // Access check
  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#FFF8F4] rounded-2xl text-[#FF6014] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          This panel is restricted to Administrators. Please switch your role using the selector in the navbar to test this view.
        </p>
      </div>
    );
  }

  const categoryBreakdown = [
    { name: "AC Servicing & Repair", percentage: 42, color: "bg-[#FF6014]", count: "348 Bookings" },
    { name: "Deep Home Cleaning", percentage: 28, color: "bg-teal-500", count: "230 Bookings" },
    { name: "Expert Plumbing", percentage: 15, color: "bg-indigo-500", count: "124 Bookings" },
    { name: "Wall Painting & Decor", percentage: 10, color: "bg-amber-500", count: "82 Bookings" },
    { name: "Electrical & CCTV", percentage: 5, color: "bg-slate-500", count: "41 Bookings" },
  ];

  const regionalActivity = [
    { name: "Gulshan & Banani", percentage: 38, count: "314 Jobs", trend: "+12%" },
    { name: "Uttara", percentage: 28, count: "230 Jobs", trend: "+8%" },
    { name: "Dhanmondi", percentage: 18, count: "150 Jobs", trend: "+4%" },
    { name: "Mirpur & Pallabi", percentage: 16, count: "132 Jobs", trend: "+15%" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">System Analytics</h1>
            <p className="text-xs text-slate-400 mt-0.5">Detailed statistical insights regarding bookings, regional demand, and category metrics.</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Categories vs Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Service Categories Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Service Category Distribution</h3>
            <p className="text-xs text-slate-500 mt-1">Popular categories sorted by booking count</p>
          </div>

          <div className="space-y-4">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span className="text-slate-800">{cat.name}</span>
                  <div className="flex gap-2">
                    <span className="text-slate-400">{cat.count}</span>
                    <span className="text-[#FF6014]">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Activity List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Regional Booking Distribution</h3>
            <p className="text-xs text-slate-500 mt-1">Active zones across Dhaka metropolitan area</p>
          </div>

          <div className="space-y-4">
            {regionalActivity.map((region, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-xl">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-800">{region.name}</h5>
                    <span className="text-xs text-slate-400 font-medium">{region.count} completed</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800">{region.percentage}%</span>
                  <span className="text-[10px] font-bold text-emerald-600 block">{region.trend} growth</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Rating Analytics & Platform utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rating Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900">Rating Breakdown</h3>
          
          <div className="flex items-center gap-6 pb-2">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900">4.92</h2>
              <span className="text-xs font-semibold text-amber-500 flex items-center gap-0.5 mt-1">⭐ Rating Score</span>
            </div>
            <div className="h-10 w-px bg-slate-100" />
            <div>
              <p className="text-xs text-slate-500 font-medium">Out of 12,450 customer ratings collected this year.</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { stars: "5 Stars", val: 88, color: "bg-amber-400" },
              { stars: "4 Stars", val: 9, color: "bg-amber-300" },
              { stars: "3 Stars", val: 2, color: "bg-amber-200" },
              { stars: "2 Stars & below", val: 1, color: "bg-rose-300" },
            ].map((star, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="w-24 whitespace-nowrap">{star.stars}</span>
                <div className="h-2 flex-1 bg-slate-50 rounded-full overflow-hidden">
                  <div style={{ width: `${star.val}%` }} className={`h-full ${star.color}`} />
                </div>
                <span className="w-8 text-right text-slate-700">{star.val}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Utilization Rate */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-6">
          <h3 className="text-base font-bold text-slate-900">Provider Utilization Rate</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold uppercase">Average Job Dispatch Time</span>
                <h4 className="text-xl font-bold text-slate-800 mt-1">14.5 Minutes</h4>
                <p className="text-xs text-slate-400 mt-1">From booking request to technician en route</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold uppercase">Customer Retention</span>
                <h4 className="text-xl font-bold text-slate-800 mt-1">72.4%</h4>
                <p className="text-xs text-slate-400 mt-1">Booked 2+ services within 30 days</p>
              </div>
            </div>

            {/* Circular utilization indicator using CSS */}
            <div className="flex flex-col items-center justify-center p-4 border border-slate-50 rounded-2xl bg-slate-50/20">
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-slate-100 shadow-inner">
                {/* SVG circular progress indicator */}
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="54" className="stroke-slate-200 fill-none" strokeWidth="8" />
                  <circle cx="64" cy="64" r="54" className="stroke-rose-500 fill-none" strokeWidth="8" strokeDasharray="339.29" strokeDashoffset="50.9" />
                </svg>
                <div className="text-center z-10">
                  <h3 className="text-2xl font-black text-slate-800">85%</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active rate</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center font-medium mt-3">Professionals online vs active on jobs</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
