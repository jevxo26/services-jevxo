"use client";

import React from "react";
import { Users } from "lucide-react";

interface UserDemographicsProps {
  users: {
    totalClients: number;
    totalVendors: number;
    totalAgents: number;
  };
}

export default function UserDemographics({ users }: UserDemographicsProps) {
  const totalUsers = users.totalClients + users.totalVendors + users.totalAgents;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 hover:border-[#4F46E5]/15 hover:shadow-lg hover:shadow-[#4F46E5]/5 transition-all duration-300 p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">User Demographics</h3>
          <p className="text-xs text-slate-400 font-medium">Registered account distribution</p>
        </div>
        <div className="p-2.5 bg-[#EEF2FF] text-[#4F46E5] rounded-2xl">
          <Users size={20} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="text-center p-4 bg-slate-50/50 hover:bg-[#EEF2FF]/30 hover:border-[#4F46E5]/10 rounded-2xl border border-slate-100 transition-all duration-200 group/item">
          <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight group-hover/item:scale-105 transition-transform">
            {users.totalClients}
          </p>
          <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Clients</p>
        </div>
        <div className="text-center p-4 bg-slate-50/50 hover:bg-[#EEF2FF]/30 hover:border-[#4F46E5]/10 rounded-2xl border border-slate-100 transition-all duration-200 group/item">
          <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight group-hover/item:scale-105 transition-transform">
            {users.totalVendors}
          </p>
          <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Vendors</p>
        </div>
        <div className="text-center p-4 bg-slate-50/50 hover:bg-[#EEF2FF]/30 hover:border-[#4F46E5]/10 rounded-2xl border border-slate-100 transition-all duration-200 group/item">
          <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight group-hover/item:scale-105 transition-transform">
            {users.totalAgents}
          </p>
          <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Agents</p>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center px-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Registered Users</span>
        <span className="text-lg font-black text-[#4F46E5]">{totalUsers}</span>
      </div>
    </div>
  );
}
