"use client";

import React from "react";
import { Pencil } from "lucide-react";

interface SettingsHeaderProps {
  email: string;
  lang?: string;
}

export default function SettingsHeader({ email, lang = "bn" }: SettingsHeaderProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        {/* Avatar with edit float icon */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            alt="Zayed Mansoor Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-white ring-4 ring-slate-100"
          />
          <button className="absolute bottom-0 right-0 p-1.5 bg-[#1E4E8C] hover:bg-[#123C73] text-white rounded-full border-2 border-white shadow-md transition-transform active:scale-90">
            <Pencil size={12} className="stroke-[2.5]" />
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Zayed Mansoor</h2>
          <p className="text-sm text-slate-400 mt-0.5 font-semibold">{email}</p>
          <span className="inline-flex items-center gap-1 bg-[#EEF2FF] text-[#1E4E8C] text-xs font-bold px-3 py-1 rounded-full mt-2 border border-[#E0E7FF]">
            {lang === "bn" ? "★ প্রিমিয়াম মেম্বার" : "★ Premium Member"}
          </span>
        </div>
      </div>

      <button className="bg-[#1E4E8C] hover:bg-[#123C73] text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md shadow-[#1E4E8C]/10 transition-all active:scale-[0.98]">
        {lang === "bn" ? "পাবলিক প্রোফাইল দেখুন" : "View Public Profile"}
      </button>
    </div>
  );
}
