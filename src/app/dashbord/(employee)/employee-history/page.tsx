"use client";

import * as React from "react";
import { Loader2, History } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import AccessDenied from "../../(client)/components/AccessDenied";
import HistoryCard from "./components/HistoryCard";
import { useEmployeeHistory } from "./hooks/useEmployeeHistory";

export default function EmployeeHistoryPage() {
  const { role, myCompletedTasks, isLoading } = useEmployeeHistory();
  const lang = useAppSelector((state) => state.lang.value);

  if (role !== "employee") {
    return <AccessDenied roleRequired="Employee" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#10B981]" />
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-8 relative z-10">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EEF2FF] text-[#1E4E8C] rounded-2xl">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                {lang === "bn" ? "কাজের ইতিহাস" : "Task History"}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === "bn"
                  ? "আপনার পূর্বে সম্পন্ন করা সার্ভিস অ্যাসাইনমেন্টগুলো দেখুন।"
                  : "View your previously completed service assignments."}
              </p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {myCompletedTasks.length > 0 ? (
            myCompletedTasks.map((booking: any) => <HistoryCard key={booking.id} booking={booking} />)
          ) : (
            <div className="bg-white p-12 text-center border border-slate-100 rounded-2xl shadow-sm text-slate-400 flex flex-col items-center">
              <History size={48} className="text-slate-200 mb-4" />
              <p className="font-semibold text-slate-600">
                {lang === "bn" ? "আপনি এখনও কোনও কাজ সম্পন্ন করেননি।" : "You haven't completed any tasks yet."}
              </p>
              <p className="text-xs mt-1">
                {lang === "bn"
                  ? "অ্যাসাইন করা কাজগুলো সম্পন্ন করার পর, সেগুলো এখানে প্রদর্শিত হবে।"
                  : "Once you complete assigned tasks, they will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
