"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface BookingPipelineProps {
  bookings: {
    completed: number;
    pending: number;
    todayAssigned: number;
  };
}

export default function BookingPipeline({ bookings }: BookingPipelineProps) {
  const totalPipeline = bookings.completed + bookings.pending + bookings.todayAssigned;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 hover:border-[#1E4E8C]/15 hover:shadow-lg hover:shadow-[#1E4E8C]/5 transition-all duration-300 p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Booking Pipeline</h3>
          <p className="text-xs text-slate-400 font-medium">Status overview of booking records</p>
        </div>
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
          <CheckCircle2 size={20} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="text-center p-4 bg-slate-50/50 hover:bg-emerald-50/20 hover:border-emerald-500/10 rounded-2xl border border-slate-100 transition-all duration-200 group/item">
          <p className="text-2xl md:text-3xl font-black text-emerald-600 tracking-tight group-hover/item:scale-105 transition-transform">
            {bookings.completed}
          </p>
          <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Completed</p>
        </div>
        <div className="text-center p-4 bg-slate-50/50 hover:bg-amber-50/20 hover:border-amber-500/10 rounded-2xl border border-slate-100 transition-all duration-200 group/item">
          <p className="text-2xl md:text-3xl font-black text-amber-500 tracking-tight group-hover/item:scale-105 transition-transform">
            {bookings.pending}
          </p>
          <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Pending</p>
        </div>
        <div className="text-center p-4 bg-slate-50/50 hover:bg-indigo-50/20 hover:border-indigo-500/10 rounded-2xl border border-slate-100 transition-all duration-200 group/item">
          <p className="text-2xl md:text-3xl font-black text-indigo-500 tracking-tight group-hover/item:scale-105 transition-transform">
            {bookings.todayAssigned}
          </p>
          <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Assigned</p>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center px-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Active Pipeline Total</span>
        <span className="text-lg font-black text-slate-800">{totalPipeline}</span>
      </div>
    </div>
  );
}
