"use client";

import * as React from "react";
import { Loader2, CheckCircle2, Briefcase } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import AccessDenied from "../../(client)/components/AccessDenied";
import TaskCard from "./components/TaskCard";
import { useEmployeeTasks } from "./hooks/useEmployeeTasks";

export default function EmployeeTasksPage() {
  const { role, myTasks, isLoading, isUpdating, handleMarkComplete } = useEmployeeTasks();
  const lang = useAppSelector((state) => state.lang.value);

  if (role !== "employee") {
    return <AccessDenied roleRequired="Employee" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#1E4E8C]" />
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
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                {lang === "bn" ? "আমার কাজসমূহ" : "My Tasks"}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === "bn"
                  ? "আপনাকে অর্পণ করা সার্ভিস বুকিংগুলো দেখুন এবং পরিচালনা করুন।"
                  : "View and manage the service bookings assigned to you."}
              </p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {myTasks.length > 0 ? (
            myTasks.map((booking: any) => (
              <TaskCard
                key={booking.id}
                booking={booking}
                isUpdating={isUpdating}
                handleMarkComplete={handleMarkComplete}
              />
            ))
          ) : (
            <div className="bg-white p-12 text-center border border-slate-100 rounded-2xl shadow-sm text-slate-400 flex flex-col items-center">
              <CheckCircle2 size={48} className="text-slate-200 mb-4" />
              <p className="font-semibold text-slate-600">
                {lang === "bn" ? "আপনার কোনো পেন্ডিং কাজ নেই!" : "You have no pending tasks!"}
              </p>
              <p className="text-xs mt-1">
                {lang === "bn" ? "নতুন কাজের অর্পণের জন্য পরে আবার চেক করুন।" : "Check back later for new assignments."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
