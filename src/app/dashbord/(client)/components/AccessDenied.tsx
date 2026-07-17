"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

interface AccessDeniedProps {
  roleRequired: string;
}

export default function AccessDenied({ roleRequired }: AccessDeniedProps) {
  const lang = useAppSelector((state) => state.lang.value);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
      <div className="p-4 bg-[#EEF2FF] rounded-2xl text-[#4F46E5] mb-4">
        <ShieldAlert size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">
        {lang === "bn" ? "প্রবেশাধিকার নিষিদ্ধ" : "Access Denied"}
      </h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        {lang === "bn" ? (
          <>
            এই সাবপেজটি শুধুমাত্র{" "}
            <strong className="text-slate-800">
              {roleRequired === "Customer"
                ? "গ্রাহক"
                : roleRequired === "Customer or Agent"
                ? "গ্রাহক বা এজেন্ট"
                : roleRequired}
            </strong>{" "}
            রোলের ব্যবহারকারীদের জন্য অ্যাক্সেসযোগ্য।
          </>
        ) : (
          <>
            This subpage is only accessible to users with the{" "}
            <strong className="text-slate-800">{roleRequired}</strong> role.
          </>
        )}
      </p>
    </div>
  );
}
