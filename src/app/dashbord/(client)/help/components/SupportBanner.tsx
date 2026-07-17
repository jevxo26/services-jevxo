"use client";

import React from "react";
import { MessageSquare, Mail, Phone } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

export default function SupportBanner() {
  const lang = useAppSelector((state) => state.lang.value);

  return (
    <div className="bg-[#EEF2FF]/45 rounded-[40px] border border-[#E0E7FF]/30 p-8 sm:p-10 text-center space-y-8 mt-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          {lang === "bn" ? "এখনো সাহায্য প্রয়োজন?" : "Still need help?"}
        </h2>
        <p className="text-xs text-slate-500 font-semibold max-w-lg mx-auto leading-relaxed">
          {lang === "bn"
            ? "আমাদের ডেডিকেটেড সাপোর্ট টিম আপনাকে সাহায্য করতে প্রস্তুত। আপনার পছন্দের মাধ্যমে আমাদের সাথে যোগাযোগ করুন।"
            : "Our dedicated support team is ready to assist you. Choose your preferred way to connect with us."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 divide-y md:divide-y-0 md:divide-x divide-rose-100/50">
        {/* Live Chat */}
        <div className="space-y-4 pt-4 md:pt-0">
          <div className="w-14 h-14 bg-white border border-[#E0E7FF]/70 rounded-full flex items-center justify-center text-[#4F46E5] mx-auto shadow-sm">
            <MessageSquare size={22} />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">
              {lang === "bn" ? "লাইভ চ্যাট" : "Live Chat"}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              {lang === "bn" ? "সাধারণ প্রতিক্রিয়া সময়: ২ মিনিট" : "Typical response time: 2 mins"}
            </p>
          </div>
          <button className="bg-[#4F46E5] hover:bg-[#4F46E5] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-sm shadow-[#4F46E5]/10 active:scale-[0.98] transition-all w-fit mx-auto focus:outline-none cursor-pointer">
            {lang === "bn" ? "চ্যাট শুরু করুন" : "Start Chatting"}
          </button>
        </div>

        {/* Email Support */}
        <div className="space-y-4 pt-6 md:pt-0 md:pl-6">
          <div className="w-14 h-14 bg-white border border-[#E0E7FF]/70 rounded-full flex items-center justify-center text-[#4F46E5] mx-auto shadow-sm">
            <Mail size={22} />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">
              {lang === "bn" ? "ইমেইল সাপোর্ট" : "Email Support"}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              {lang === "bn" ? "সাধারণ প্রতিক্রিয়া সময়: ২ ঘণ্টা" : "Typical response time: 2 hours"}
            </p>
          </div>
          <button className="border border-[#4F46E5] hover:bg-[#EEF2FF]/40 text-[#4F46E5] text-xs font-bold px-6 py-2.5 rounded-full active:scale-[0.98] transition-all w-fit mx-auto focus:outline-none cursor-pointer">
            {lang === "bn" ? "ইমেইল পাঠান" : "Send Email"}
          </button>
        </div>

        {/* hotline */}
        <div className="space-y-4 pt-6 md:pt-0 md:pl-6">
          <div className="w-14 h-14 bg-white border border-[#E0E7FF]/70 rounded-full flex items-center justify-center text-[#4F46E5] mx-auto shadow-sm">
            <Phone size={22} />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">
              {lang === "bn" ? "২৪/৭ হটলাইন" : "24/7 Hotline"}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              {lang === "bn" ? "জরুরি প্রয়োজনে তাৎক্ষণিক সাহায্য" : "Immediate support for emergencies"}
            </p>
          </div>
          <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-full active:scale-[0.98] transition-all w-fit mx-auto focus:outline-none cursor-pointer">
            +880 1678 900000
          </button>
        </div>
      </div>
    </div>
  );
}
