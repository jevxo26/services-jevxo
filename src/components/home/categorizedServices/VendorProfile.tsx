import React from "react";
import { Shield, Phone, Mail, MessageSquare, Star, Building, CheckCircle2 } from "lucide-react";
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
    <section className="py-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            Service Partner
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Service Provider Profile
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-md font-medium">
            Learn more about the verified partner agency handling this service.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
        {/* Decorative Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50/40 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column: Vendor Main Profile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10">
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-[#FF6014] shrink-0 shadow-inner">
            <Building className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {vendor.name}
              </h3>
              {vendor.status === "active" && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Verified Provider
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-400">
              Official Rajseba Partner Service Provider
            </p>

            {/* Vendor Stars */}
            <div className="flex items-center gap-1.5 pt-0.5">
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
              <span className="text-xs font-bold text-slate-500">
                {serviceRating || "5.0"} Provider Rating
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 z-10">
          <div className="space-y-2">
            {vendor.phone && (
              <a
                href={`tel:${vendor.phone}`}
                className="flex items-center gap-2.5 text-xs font-bold text-slate-500 hover:text-[#FF6014] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                {vendor.phone}
              </a>
            )}
            {vendor.email && (
              <a
                href={`mailto:${vendor.email}`}
                className="flex items-center gap-2.5 text-xs font-bold text-slate-500 hover:text-[#FF6014] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                {vendor.email}
              </a>
            )}
          </div>

          <div className="h-px sm:h-10 w-full sm:w-px bg-slate-100 self-stretch my-1 sm:my-0" />

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
            className="bg-[#FF6014] hover:bg-[#E0530A] text-white px-6 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-100 hover:shadow-lg cursor-pointer w-full sm:w-auto"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat with Provider
          </motion.button>
        </div>
      </div>
    </section>
  );
}
