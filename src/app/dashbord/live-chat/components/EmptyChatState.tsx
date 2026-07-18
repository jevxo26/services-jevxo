"use client";

import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";

interface EmptyChatStateProps {
  lang?: string;
}

export default function EmptyChatState({ lang = "bn" }: EmptyChatStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 bg-slate-50/20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#EEF2FF]/20 via-transparent to-transparent pointer-events-none" />
      <div className="p-6 bg-white rounded-full border border-slate-100 shadow-md relative mb-4 animate-bounce duration-[2000ms]">
        <MessageSquare size={48} className="text-[#1E4E8C]/30" />
        <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-[#1E4E8C] to-[#FF8142] rounded-full text-white shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="text-center space-y-2 max-w-sm">
        <p className="text-sm font-black text-slate-800 uppercase tracking-widest">
          {lang === "bn" ? "লাইভ চ্যাট রুম" : "Live Chat Room"}
        </p>
        <p className="text-xs text-slate-400 font-semibold leading-relaxed">
          {lang === "bn"
            ? "রিয়েল-টাইমে মেসেজ করার জন্য কথোপকথনের তালিকা থেকে একজন গ্রাহক বা পার্টনার নির্বাচন করুন।"
            : "Select a customer or partner from the conversation list to message in real-time."}
        </p>
      </div>
    </div>
  );
}
