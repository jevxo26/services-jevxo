"use client";

import React from "react";
import { Toaster } from "sonner";
import { CheckCircle2, AlertCircle, Loader2, Info } from "lucide-react";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      theme="light"
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
        error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
        info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
        loading: <Loader2 className="w-5 h-5 text-slate-600 animate-spin shrink-0" />,
      }}
      toastOptions={{
        style: {
          fontFamily: "var(--font-bai-jamjuree)",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
        },
        classNames: {
          success: "!bg-[#ECFDF5] !text-[#065F46] !border-[#A7F3D0]",
          error: "!bg-[#FEF2F2] !text-[#991B1B] !border-[#FECACA]",
          info: "!bg-[#F0F9FF] !text-[#075985] !border-[#BAE6FD]",
        }
      }}
    />
  );
}
