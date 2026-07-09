"use client";

import { motion } from "framer-motion";
import { Check, CheckCircle } from "lucide-react";
import { DisplayPackage } from "./packageOfferUtils";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 65, damping: 15 },
  },
} as const;

export function PackageOfferCard({
  pkg,
  index = 0,
  onBook,
}: {
  pkg: DisplayPackage;
  index?: number;
  onBook?: (pkg: DisplayPackage) => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={`rounded-3xl relative flex flex-col h-full transition-all hover:-translate-y-1 overflow-hidden ${pkg.variant === "popular"
          ? "border-2 border-blue-500 bg-blue-50/50 shadow-blue-500/20 shadow-xl"
          : pkg.variant === "dark"
            ? "bg-[#261817] text-white border border-blue-200 hover:border-blue-500 hover:shadow-blue-500/20"
            : "bg-white border border-blue-200 shadow-sm hover:border-blue-500 hover:shadow-blue-500/20 hover:shadow-xl"
        }`}
    >
      {/* Badge */}
      {pkg.badge && (
        <div className="absolute top-3 right-3 bg-[#FF6014] text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 shadow-sm">
          {pkg.badge}
        </div>
      )}

      {/* Image Block */}
      {pkg.image ? (
        <div className="relative h-44 w-full overflow-hidden flex-shrink-0">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Gradient overlay so bottom text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Service label bottom-left */}
          {pkg.serviceName && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="text-[11px] font-semibold text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15">
                {pkg.serviceName}
              </span>
            </div>
          )}
        </div>
      ) : pkg.serviceName ? (
        /* No image — show service pill at top */
        <div className="px-6 pt-6 pb-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${pkg.variant === "dark"
                ? "bg-white/10 text-slate-300"
                : "bg-[#FF6014]/10 text-[#FF6014]"
              }`}
          >
            {pkg.serviceName}
          </span>
        </div>
      ) : null}

      {/* Card Body */}
      <div
        className={`p-6 flex flex-col flex-1 ${!pkg.image && !pkg.serviceName ? "pt-8" : ""
          }`}
      >
        <div className="mb-5">
          <h3
            className={`text-base font-bold mb-1 leading-snug ${pkg.variant === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            {pkg.title}
          </h3>
          {pkg.description && (
            <p
              className={`text-xs mb-3 leading-relaxed ${pkg.variant === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
            >
              {pkg.description}
            </p>
          )}
          {pkg.price ? (
            <div className="flex items-baseline gap-1">
              <span
                className={`text-3xl font-extrabold ${pkg.variant === "dark" ? "text-white" : "text-[#FF6014]"
                  }`}
              >
                ৳{pkg.price}
              </span>
              <span className="text-xs font-medium text-slate-400">/package</span>
            </div>
          ) : (
            <div className="text-2xl font-bold text-slate-400">Get Quote</div>
          )}
          {(pkg.bookingsCount !== undefined && pkg.bookingsCount !== null) && (
            <p className={`text-[10px] font-semibold pt-1.5 flex items-center gap-1 ${
              pkg.variant === "dark" ? "text-slate-400" : "text-slate-500"
            }`}>
              <CheckCircle size={11} className="text-emerald-500 flex-shrink-0" />
              <span><span className={`font-bold ${
                pkg.variant === "dark" ? "text-emerald-400" : "text-emerald-600"
              }`}>{pkg.bookingsCount}</span> bookings completed</span>
            </p>
          )}
        </div>

        {pkg.features.length > 0 ? (
          <ul className="space-y-2.5 mb-6 flex-1">
            {pkg.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-[#FF6014] mt-0.5 flex-shrink-0" />
                <span
                  className={
                    pkg.variant === "dark" ? "text-slate-300" : "text-slate-600"
                  }
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        ) : pkg.description ? (
          <p className="text-slate-400 leading-relaxed mb-6 flex-1 text-sm">
            {pkg.description}
          </p>
        ) : (
          <div className="mb-6 flex-1" />
        )}

        <button
          type="button"
          onClick={() => onBook?.(pkg)}
          className={`w-full py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer active:scale-[0.98] ${pkg.variant === "dark"
              ? "bg-white text-slate-900 hover:bg-slate-100"
              : pkg.variant === "popular"
                ? "bg-[#FF6014] text-white hover:bg-[#E0530A] shadow-md shadow-[#FF6014]/20"
                : "bg-slate-900 text-white hover:bg-black"
            }`}
        >
          {pkg.buttonText}
        </button>
      </div>
    </motion.div>
  );
}