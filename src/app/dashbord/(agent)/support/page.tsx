"use client";

import React from "react";
import { MessageCircle, Send } from "lucide-react";
import AccessDenied from "../../(client)/components/AccessDenied";
import { useAgentSupport } from "./hooks/useAgentSupport";
import { useAppSelector } from "@/redux/hooks";

export default function AgentSupportPage() {
  const state = useAgentSupport();
  const lang = useAppSelector((state) => state.lang.value);

  if (state.role !== "agent") {
    return <AccessDenied roleRequired="Agent" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EEF2FF] text-[#1E4E8C] rounded-2xl">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {lang === "bn" ? "সাপোর্ট ডেস্ক" : "Support Desk"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === "bn"
                ? "আমাদের এডমিন সাপোর্ট প্রতিনিধিদের কাছ থেকে অগ্রাধিকার ভিত্তিতে সমাধান পান।"
                : "Get priority resolution from our admin support representatives."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Tickets list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            {lang === "bn" ? "সক্রিয় সাপোর্ট টিকিটসমূহ" : "Active Support Tickets"}
          </h3>

          <div className="space-y-4">
            {state.tickets.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 font-bold">{t.id}</span>
                    <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-lg font-bold">
                      {t.category === "Commission & Payout"
                        ? (lang === "bn" ? "কমিশন ও পে-আউট" : "Commission & Payout")
                        : t.category === "Booking Failures"
                        ? (lang === "bn" ? "বুকিং জটিলতা" : "Booking Failures")
                        : t.category === "Account Dispute"
                        ? (lang === "bn" ? "অ্যাকাউন্ট সংক্রান্ত সমস্যা" : "Account Dispute")
                        : t.category}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      t.status === "Resolved"
                        ? "bg-emerald-50 text-emerald-700"
                        : t.status === "In Progress"
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-[#EEF2FF] text-[#123C73]"
                    }`}
                  >
                    {t.status === "Resolved"
                      ? (lang === "bn" ? "সমাধানকৃত" : "Resolved")
                      : t.status === "In Progress"
                      ? (lang === "bn" ? "চলমান" : "In Progress")
                      : (lang === "bn" ? "পেন্ডিং" : t.status)}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-800">{t.subject}</h4>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-500">
                  <span className="font-bold text-slate-700 block mb-1">
                    {lang === "bn" ? "সর্বশেষ আপডেট:" : "Latest Update:"}
                  </span>
                  {t.lastReply}
                </div>

                <div className="text-[10px] text-slate-400 font-semibold text-right">
                  {lang === "bn" ? `${t.date} তারিখে শুরু হয়েছে` : `Opened ${t.date}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Create ticket */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageCircle size={20} className="text-[#1E4E8C]" />{" "}
            {lang === "bn" ? "নতুন টিকিট খুলুন" : "Open Priority Ticket"}
          </h3>

          <form onSubmit={state.handleTicketSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                {lang === "bn" ? "ক্যাটাগরি" : "Category"}
              </label>
              <select
                value={state.category}
                onChange={(e) => state.setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer"
              >
                <option value="Commission & Payout">
                  {lang === "bn" ? "কমিশন ও পে-আউট" : "Commission & Payout"}
                </option>
                <option value="Booking Failures">
                  {lang === "bn" ? "বুকিং জটিলতা" : "Booking Failures"}
                </option>
                <option value="Account Dispute">
                  {lang === "bn" ? "অ্যাকাউন্ট সংক্রান্ত সমস্যা" : "Account Dispute"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                {lang === "bn" ? "বিষয়" : "Subject"}
              </label>
              <input
                type="text"
                placeholder={lang === "bn" ? "সংक्षिप्त বিবরণ..." : "Brief summary..."}
                value={state.subject}
                onChange={(e) => state.setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                {lang === "bn" ? "বিস্তারিত বিবরণ" : "Details"}
              </label>
              <textarea
                rows={4}
                placeholder={lang === "bn" ? "সমস্যাটি বিস্তারিত ব্যাখ্যা করুন..." : "Explain the issue in detail..."}
                value={state.description}
                onChange={(e) => state.setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all font-semibold resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1E4E8C] hover:bg-[#123C73] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <Send size={14} /> {lang === "bn" ? "টিকিট জমা দিন" : "Submit Ticket"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
