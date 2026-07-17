"use client";

import React from "react";
import { Heart, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import AccessDenied from "../components/AccessDenied";
import SavedServiceCard from "./components/SavedServiceCard";
import DiscoverMoreCard from "./components/DiscoverMoreCard";
import { useSavedServicesState } from "./hooks/useSavedServicesState";

export default function SavedServicesPage() {
  const { role, savedServices, isLoading, handleUnsave } = useSavedServicesState();
  const lang = useAppSelector((state) => state.lang.value);

  if (role !== "client") {
    return <AccessDenied roleRequired="Customer" />;
  }

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-10 relative z-10">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EEF2FF] text-[#4F46E5] rounded-2xl">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                {lang === "bn" ? "সংরক্ষিত সার্ভিসসমূহ" : "Saved Services"}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {isLoading ? (
                  lang === "bn" ? "লোড হচ্ছে..." : "Loading..."
                ) : lang === "bn" ? (
                  `${savedServices.length}টি সার্ভিস আপনার উইশলিস্টে সংরক্ষিত আছে।`
                ) : (
                  `${savedServices.length} service${savedServices.length !== 1 ? "s" : ""} saved to your wishlist.`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" />
            </div>
          ) : savedServices.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-[24px] border border-dashed border-slate-200 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                <Heart size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-1">
                {lang === "bn" ? "এখনো কোনো সার্ভিস সংরক্ষিত নেই" : "No saved services yet"}
              </h3>
              <p className="text-sm text-slate-400 font-medium mb-5">
                {lang === "bn"
                  ? "যেকোনো সার্ভিস কার্ডে ♥ হার্ট আইকনে চাপ দিয়ে সেটি এখানে সংরক্ষণ করুন।"
                  : "Tap the ♥ heart icon on any service card to save it here."}
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <BookOpen size={14} />
                {lang === "bn" ? "সার্ভিসসমূহ ব্রাউজ করুন" : "Browse Services"}
              </Link>
            </div>
          ) : (
            <>
              {savedServices.map((service: any) => (
                <SavedServiceCard key={service.id} service={service} handleUnsave={handleUnsave} />
              ))}
              <DiscoverMoreCard />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
