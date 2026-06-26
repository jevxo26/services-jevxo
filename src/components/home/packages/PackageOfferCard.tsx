"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { DisplayPackage } from "./packageOfferUtils";

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 65, damping: 14 },
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
      className={`rounded-3xl relative flex flex-col h-full transition-all hover:-translate-y-1 overflow-hidden ${
        pkg.variant === "popular"
          ? "border-2 border-[#FF7C71] bg-rose-50/50 shadow-xl"
          : pkg.variant === "dark"
            ? "bg-[#261817] text-white"
            : "bg-white border border-slate-100 shadow-sm"
      }`}
    >
      {pkg.badge && (
        <div className="absolute top-3 right-3 bg-[#FF7C71] text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 shadow-sm">
          {pkg.badge}
        </div>
      )}

      {pkg.image ? (
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {pkg.serviceName && (
            <div className="absolute bottom-2 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              {pkg.serviceName}
            </div>
          )}
        </div>
      ) : pkg.serviceName ? (
        <div className="px-6 pt-6 pb-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
              pkg.variant === "dark"
                ? "bg-white/10 text-slate-300"
                : "bg-[#FF7C71]/10 text-[#FF7C71]"
            }`}
          >
            {pkg.serviceName}
          </span>
        </div>
      ) : null}

      <div
        className={`p-6 flex flex-col flex-1 ${
          !pkg.image && !pkg.serviceName ? "pt-8" : ""
        }`}
      >
        <div className="mb-5">
          <h3
            className={`text-base font-bold mb-1 leading-snug ${
              pkg.variant === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {pkg.title}
          </h3>
          {pkg.description && (
            <p
              className={`text-xs mb-3 leading-relaxed ${
                pkg.variant === "dark" ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {pkg.description}
            </p>
          )}
          {pkg.price ? (
            <div className="flex items-baseline gap-1">
              <span
                className={`text-3xl font-extrabold ${
                  pkg.variant === "dark" ? "text-white" : "text-[#FF7C71]"
                }`}
              >
                ৳{pkg.price}
              </span>
              <span className="text-xs font-medium text-slate-400">/package</span>
            </div>
          ) : (
            <div className="text-2xl font-bold text-slate-400">Get Quote</div>
          )}
        </div>

        {pkg.features.length > 0 ? (
          <ul className="space-y-2.5 mb-6 flex-1">
            {pkg.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-[#FF7C71] mt-0.5 flex-shrink-0" />
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
          className={`w-full py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer active:scale-[0.98] ${
            pkg.variant === "dark"
              ? "bg-white text-slate-900 hover:bg-slate-100"
              : pkg.variant === "popular"
                ? "bg-[#FF7C71] text-white hover:bg-[#E5675D] shadow-md shadow-[#FF7C71]/20"
                : "bg-slate-900 text-white hover:bg-black"
          }`}
        >
          {pkg.buttonText}
        </button>
      </div>
    </motion.div>
  );
}
