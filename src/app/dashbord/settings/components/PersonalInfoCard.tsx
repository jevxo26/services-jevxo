"use client";

import React from "react";

interface PersonalInfoCardProps {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  setPersonalInfo: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      email: string;
      phone: string;
      location: string;
    }>
  >;
  handleSave: (e: React.FormEvent) => void;
  lang?: string;
}

export default function PersonalInfoCard({
  personalInfo,
  setPersonalInfo,
  handleSave,
  lang = "bn",
}: PersonalInfoCardProps) {
  return (
    <div id="personal" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 scroll-mt-6">
      <h3 className="text-lg font-bold text-slate-900">
        {lang === "bn" ? "ব্যক্তিগত তথ্য" : "Personal Info"}
      </h3>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
              {lang === "bn" ? "পুরো নাম" : "Full Name"}
            </label>
            <input
              type="text"
              value={personalInfo.fullName}
              onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-350 focus:ring-4 focus:ring-[#1E4E8C]/20/5 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
              {lang === "bn" ? "ইমেইল এড্রেস" : "Email Address"}
            </label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-350 focus:ring-4 focus:ring-[#1E4E8C]/20/5 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
              {lang === "bn" ? "ফোন নম্বর" : "Phone Number"}
            </label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-350 focus:ring-4 focus:ring-[#1E4E8C]/20/5 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
              {lang === "bn" ? "অবস্থান" : "Location"}
            </label>
            <input
              type="text"
              value={personalInfo.location}
              onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-350 focus:ring-4 focus:ring-[#1E4E8C]/20/5 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-[#1E4E8C] hover:bg-[#123C73] text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md shadow-[#1E4E8C]/10 transition-all active:scale-[0.98]"
          >
            {lang === "bn" ? "পরিবর্তনগুলো সেভ করুন" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
