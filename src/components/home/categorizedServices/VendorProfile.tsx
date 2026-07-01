"use client";

import React from "react";
import { Star, Building, CheckCircle2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Vendor {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
  createdAt?: string;
  wallet_balance?: string;
  commission_percentage?: string;
}

export function VendorProfile({ vendor, serviceRating = "0.0" }: { vendor?: Vendor; serviceRating?: string | number }) {
  const router = useRouter();

  if (!vendor) return null;

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
      {/* Decorative Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/40 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col gap-5 relative z-10">
        {/* Header/Badge */}
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <span className="inline-flex items-center gap-1.5 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
            Service Partner
          </span>
          {vendor.status === "active" && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
              <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
              Verified
            </span>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-[#FF6014] shrink-0 shadow-inner">
            <Building className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-800 tracking-tight truncate">
              {vendor.name}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5">
              Official Partner Agency
            </p>
          </div>
        </div>

        {/* Rating and Chat Button */}
        <div className="grid grid-cols-1 gap-4 pt-2">
          {/* Rating */}
          <div className="flex items-center justify-between bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500">Rating</span>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(Number(serviceRating) || 5)
                        ? "fill-current"
                        : "opacity-30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-black text-slate-800">
                {serviceRating || "5.0"}
              </span>
            </div>
          </div>

          {/* Action button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              router.push(
                `/dashbord/live-chat?receiverId=${vendor.id}&receiverName=${encodeURIComponent(
                  vendor.name
                )}`
              )
            }
            className="bg-[#FF6014] hover:bg-[#E0530A] text-white py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-100 hover:shadow-lg cursor-pointer w-full"
          >
            <MessageSquare className="w-4 h-4 stroke-[2.5]" />
            Chat with Provider
          </motion.button>
        </div>
      </div>
    </div>
  );
}
