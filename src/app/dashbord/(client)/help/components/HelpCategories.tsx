"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { Calendar, CreditCard, User, Shield } from "lucide-react";

export default function HelpCategories() {
  const lang = useAppSelector((state) => state.lang.value);

  const categories = [
    {
      title: lang === "bn" ? "বুকিং ও সময়সূচী" : "Booking & Scheduling",
      icon: Calendar,
      desc: lang === "bn"
        ? "কীভাবে সার্ভিস বুক করবেন, সময় পরিবর্তন করবেন বা বাতিল করবেন তা জানুন।"
        : "Learn how to book a service, reschedule an appointment, or handle cancellations.",
      links: lang === "bn"
        ? ["আমি কীভাবে আমার বুকিংয়ের সময় পরিবর্তন করব?", "আমি কি একাধিক সার্ভিস বুক করতে পারি?"]
        : ["How do I change my booking time?", "Can I book multiple services?"],
    },
    {
      title: lang === "bn" ? "পেমেন্ট ও রিফান্ড" : "Payments & Refund",
      icon: CreditCard,
      desc: lang === "bn"
        ? "মূল্য নির্ধারণ, পেমেন্ট পদ্ধতি এবং আমাদের গ্যারান্টিযুক্ত রিফান্ড পলিসি বুঝুন।"
        : "Understand pricing, payment methods, and our guaranteed refund policy.",
      links: lang === "bn"
        ? ["আমি কখন আমার রিফান্ড পাব?", "কোন কোন পেমেন্ট পদ্ধতি গ্রহণ করা হয়?"]
        : ["When will I get my refund?", "Which payment methods are accepted?"],
    },
    {
      title: lang === "bn" ? "অ্যাকাউন্ট ও গোপনীয়তা" : "Account & Privacy",
      icon: User,
      desc: lang === "bn"
        ? "আপনার প্রোফাইল, ডেটা পছন্দ এবং নিরাপত্তা সেটিংস সহজেই পরিচালনা করুন।"
        : "Manage your profile, data preferences, and security settings easily.",
      links: lang === "bn"
        ? ["আপনার অ্যাকাউন্ট ইমেইল পরিবর্তন করা", "আমরা কীভাবে আপনার ডেটা সুরক্ষিত রাখি"]
        : ["Changing your account email", "How we protect your data"],
    },
    {
      title: lang === "bn" ? "নিরাপত্তা ও বিশ্বাস" : "Safety & Trust",
      icon: Shield,
      desc: lang === "bn"
        ? "পেশাদার যাচাইকরণ এবং অন-সাইট সার্ভিস সুরক্ষার প্রতি আমাদের প্রতিশ্রুতি।"
        : "Our commitment to professional vetting and on-site service safety.",
      links: lang === "bn"
        ? ["যাচাইকৃত সার্ভিস প্রোভাইডার ব্যাজ", "নিরাপত্তা উদ্বেগ রিপোর্ট করুন"]
        : ["Verified service provider badge", "Report a safety concern"],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
        {lang === "bn" ? "ক্যাটাগরি এক্সপ্লোর করুন" : "Explore Categories"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#EEF2FF]/60 rounded-2xl flex items-center justify-center text-[#1E4E8C] border border-[#E0E7FF]/30">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">{cat.title}</h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-1">{cat.desc}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                {cat.links.map((link, lidx) => (
                  <Link
                    key={lidx}
                    href="#"
                    className="flex items-center text-xs font-bold text-[#1E4E8C] hover:text-[#1E4E8C] transition-colors"
                  >
                    <span className="mr-1.5 text-sm font-bold">→</span>
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
