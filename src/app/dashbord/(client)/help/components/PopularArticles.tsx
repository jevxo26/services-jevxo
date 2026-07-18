"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";

export default function PopularArticles() {
  const lang = useAppSelector((state) => state.lang.value);

  const sideArticles = [
    {
      tag: lang === "bn" ? "রিফান্ড পলিসি" : "Refund Policy",
      title: lang === "bn" ? "আপনার ১০০% টাকা ফেরত পাওয়া" : "Getting your 100% money back",
      time: lang === "bn" ? "৫ মিনিট পাঠ • গতকাল আপডেট করা হয়েছে" : "5 min read • Updated yesterday",
    },
    {
      tag: lang === "bn" ? "ইন্স্যুরেন্স" : "Insurance",
      title: lang === "bn" ? "সার্ভিস ওয়ারেন্টি ও কভারেজ" : "Service Warranty & Coverage",
      time: lang === "bn" ? "৮ মিনিট পাঠ • ৩ দিন আগে আপডেট করা হয়েছে" : "8 min read • Updated 3 days ago",
    },
    {
      tag: lang === "bn" ? "পার্টনারশিপ" : "Partnership",
      title: lang === "bn" ? "রাজসেবা প্রো হওয়া" : "Becoming a Rajseba Pro",
      time: lang === "bn" ? "১২ মিনিট পাঠ • ১ সপ্তাহ আগে আপডেট করা হয়েছে" : "12 min read • Updated 1 week ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {lang === "bn" ? "জনপ্রিয় আর্টিকেলসমূহ" : "Popular Articles"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-semibold">
            {lang === "bn" ? "রাজসেবা কমিউনিটির সবচেয়ে বেশি পঠিত নির্দেশিকা" : "Most read guides by the Rajseba community"}
          </p>
        </div>
        <Link href="#" className="text-xs font-bold text-[#1E4E8C] hover:underline">
          {lang === "bn" ? "সব আর্টিকেল দেখুন" : "View all articles"}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Featured Guide Card */}
        <div className="lg:col-span-7 bg-slate-900 rounded-[32px] overflow-hidden p-6 sm:p-8 flex flex-col justify-between aspect-[16/10] relative group shadow-sm">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-102 transition-transform duration-500"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/10 z-0" />

          <div className="relative z-10 w-fit">
            <span className="bg-[#1E4E8C] text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {lang === "bn" ? "ফিচারড নির্দেশিকা" : "Featured Guide"}
            </span>
          </div>

          <div className="relative z-10 space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {lang === "bn" ? "নতুন গ্রাহকদের জন্য হোম সার্ভিস নির্দেশিকা" : "New User's Guide to Seamless Home Services"}
            </h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
              {lang === "bn"
                ? "আপনার প্রথম বুকিং সম্পর্কে আপনার যা কিছু জানা দরকার, সঠিক কর্মী নির্বাচন থেকে শুরু করে চূড়ান্ত পরিদর্শন পর্যন্ত।"
                : "Everything you need to know about your first booking, from selecting the right pro to final inspection."}
            </p>
          </div>
        </div>

        {/* Right Articles List */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {sideArticles.map((art, idx) => (
            <div
              key={idx}
              className="bg-white/95 p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between gap-2 hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-[9px] font-bold text-[#1E4E8C] uppercase tracking-wider">{art.tag}</span>
              <h4 className="font-extrabold text-slate-800 text-sm hover:text-[#1E4E8C] transition-colors">
                {art.title}
              </h4>
              <span className="text-[10px] text-slate-450 font-semibold block mt-1">{art.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
