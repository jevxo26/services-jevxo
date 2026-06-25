"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, ArrowRight, Zap, Gift, Percent, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetPublicPackagesQuery } from "@/redux/features/landing/landingApi";

// Premium styles for cards matching the brand color palette (#FF7C71)
const DESIGN_ASSETS = [
  {
    badge: "🔥 Hot Deal",
    badgeColor: "bg-[#FF7C71]/10 text-[#FF7C71] border-[#FF7C71]/20",
    gradient: "from-[#FF7C71] via-rose-500 to-rose-600",
    bg: "bg-gradient-to-br from-[#FF7C71]/5 via-white to-[#FF7C71]/2",
    border: "hover:border-[#FF7C71]/40 border-slate-100",
    iconColor: "text-[#FF7C71]",
    glow: "shadow-[#FF7C71]/5",
  },
  {
    badge: "🎁 New User",
    badgeColor: "bg-[#FF7C71]/10 text-[#FF7C71] border-[#FF7C71]/20",
    gradient: "from-[#FF7C71] via-orange-400 to-orange-500",
    bg: "bg-gradient-to-br from-[#FF7C71]/4 via-white to-[#FF7C71]/1",
    border: "hover:border-[#FF7C71]/40 border-slate-100",
    iconColor: "text-[#FF7C71]",
    glow: "shadow-[#FF7C71]/5",
  },
  {
    badge: "⚡ Flash Sale",
    badgeColor: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    gradient: "from-[#FF7C71] via-rose-450 to-pink-500",
    bg: "bg-gradient-to-br from-[#FF7C71]/5 via-white to-[#FF7C71]/2",
    border: "hover:border-[#FF7C71]/40 border-slate-100",
    iconColor: "text-[#FF7C71]",
    glow: "shadow-[#FF7C71]/5",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 65, damping: 14 } },
} as const;

// Countdown timer hook
function useCountdown(hours: number) {
  const [time, setTime] = useState(hours * 3600);
  useEffect(() => {
    const t = setInterval(() => setTime((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = time % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SpecialOffers() {
  const countdown = useCountdown(6);
  const { data: packagesRes, isLoading } = useGetPublicPackagesQuery();

  const packagesData = packagesRes?.data || (Array.isArray(packagesRes) ? packagesRes : []);

  // Dynamic offers rendering happens directly in the return block now

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FF7C71]/10 border border-[#FF7C71]/20 text-[#FF7C71] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
              <Sparkles size={13} />
              Featured Promotions
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-7 h-7 text-[#FF7C71]" />
              Special Deals & Packages
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-md">
              Grab exclusive deals and combo service packages prepared for your home care.
            </p>
          </div>

          {/* Live Countdown */}
          <div className="flex items-center gap-2.5 bg-slate-900 text-white px-4 py-2.5 rounded-2xl self-start sm:self-auto shadow-lg shadow-slate-900/10">
            <Clock size={15} className="text-[#FF7C71] animate-pulse" />
            <span className="text-xs font-semibold text-slate-400">Offer ends in</span>
            <span className="text-sm font-black tabular-nums text-[#FF7C71]">{countdown}</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF7C71]" />
          </div>
        )}

        {/* All Packages — Flat Grid */}
        {!isLoading && packagesData.length > 0 && (() => {
          // Flatten all packages from all services into one list
          const allOffers = packagesData.flatMap((section: any) =>
            (section.packages || []).map((pkg: any, idx: number) => {
              const design = DESIGN_ASSETS[idx % DESIGN_ASSETS.length];
              const discountAmount =
                pkg.originalPrice && pkg.price
                  ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
                  : 0;
              return {
                id: pkg.id,
                badge: discountAmount > 0 ? ` ${discountAmount}% Off` : "✨ Package Deal",
                badgeColor: design.badgeColor,
                title: pkg.name,
                subtitle: pkg.description || "Premium service package",
                originalPrice: pkg.originalPrice ? `৳${pkg.originalPrice}` : `৳${Number(pkg.price) + 300}`,
                salePrice: `৳${pkg.price}`,
                gradient: design.gradient,
                bg: design.bg,
                border: design.border,
                glow: design.glow,
                iconColor: design.iconColor,
                serviceId: section.service?.id,
                serviceName: section.service?.name,
              };
            })
          );

          return (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {allOffers.map((offer: any) => (
                <motion.div
                  key={offer.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className={`relative rounded-[2rem] border ${offer.border} ${offer.bg} p-6 md:p-7 flex flex-col justify-between min-h-[300px] overflow-hidden cursor-pointer group transition-all duration-300 shadow-sm ${offer.glow} hover:shadow-xl hover:shadow-slate-200/50`}
                >
                  {/* Decorative gradient mesh */}
                  <div className={`absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br ${offer.gradient} opacity-[0.08] blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between z-10">
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${offer.badgeColor} uppercase tracking-wider`}>
                      {offer.badge}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Percent size={14} className={offer.iconColor} />
                    </div>
                  </div>

                  {/* Main Title & Description */}
                  <div className="my-6 z-10 flex-1 flex flex-col justify-center">
                    {offer.serviceName && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <Tag size={10} />
                        {offer.serviceName}
                      </span>
                    )}
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-[#FF7C71] transition-colors leading-tight mb-2">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">
                      {offer.subtitle}
                    </p>
                  </div>

                  {/* Pricing and Action row */}
                  <div className="pt-4 border-t border-slate-100 z-10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Special price</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xl font-black text-slate-950">{offer.salePrice}</span>
                        <span className="text-xs text-slate-400 line-through font-semibold">{offer.originalPrice}</span>
                      </div>
                    </div>

                    <Link
                      href={offer.serviceId ? `/services/${offer.serviceId}` : "/services"}
                      className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-4 py-2.5 rounded-xl bg-gradient-to-r ${offer.gradient} text-white shadow-md shadow-rose-300/30 group-hover:shadow-lg group-hover:shadow-rose-400/40 transition-all`}
                    >
                      Book Deal
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          );
        })()}


        {/* Fallback mock data if API is empty */}
        {!isLoading && packagesData.length === 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Fallback map from the previous mock data */}
            {[
              {
                id: 1,
                badge: "🔥 30% Off",
                badgeColor: DESIGN_ASSETS[0].badgeColor,
                title: "Deep Home Cleaning Pack",
                subtitle: "Full apartment service • Complete sanitization & dust removal",
                discount: "30% OFF",
                originalPrice: "৳2,500",
                salePrice: "৳1,750",
                expires: "Ends tonight",
                gradient: DESIGN_ASSETS[0].gradient,
                bg: DESIGN_ASSETS[0].bg,
                border: DESIGN_ASSETS[0].border,
                glow: DESIGN_ASSETS[0].glow,
                iconColor: DESIGN_ASSETS[0].iconColor,
              },
              {
                id: 2,
                badge: "🎁 New User Offer",
                badgeColor: DESIGN_ASSETS[1].badgeColor,
                title: "Premium AC Tuneup",
                subtitle: "Jet wash + filter clean + safety check for 1 Unit",
                discount: "FREE TRIAL",
                originalPrice: "৳1,200",
                salePrice: "৳0",
                expires: "First 100 users",
                gradient: DESIGN_ASSETS[1].gradient,
                bg: DESIGN_ASSETS[1].bg,
                border: DESIGN_ASSETS[1].border,
                glow: DESIGN_ASSETS[1].glow,
                iconColor: DESIGN_ASSETS[1].iconColor,
              },
              {
                id: 3,
                badge: "⚡ Flash Deal",
                badgeColor: DESIGN_ASSETS[2].badgeColor,
                title: "All-in-One Appliance Care",
                subtitle: "Refrigerator, washing machine, and microwave checkup",
                discount: "25% OFF",
                originalPrice: "৳3,200",
                salePrice: "৳2,400",
                expires: "48 hours left",
                gradient: DESIGN_ASSETS[2].gradient,
                bg: DESIGN_ASSETS[2].bg,
                border: DESIGN_ASSETS[2].border,
                glow: DESIGN_ASSETS[2].glow,
                iconColor: DESIGN_ASSETS[2].iconColor,
              },
            ].map((offer) => (
              <motion.div
                key={offer.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.01 }}
                className={`relative rounded-[2rem] border ${offer.border} ${offer.bg} p-6 md:p-7 flex flex-col justify-between min-h-[300px] overflow-hidden cursor-pointer group transition-all duration-300 shadow-sm ${offer.glow} hover:shadow-xl hover:shadow-slate-200/50`}
              >
                {/* Decorative modern gradient mesh blur */}
                <div className={`absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br ${offer.gradient} opacity-[0.08] blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                {/* Top Badge Row */}
                <div className="flex items-center justify-between z-10">
                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${offer.badgeColor} uppercase tracking-wider`}>
                    {offer.badge}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Percent size={14} className={offer.iconColor} />
                  </div>
                </div>

                {/* Main Title & Description */}
                <div className="my-6 z-10 flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-[#FF7C71] transition-colors leading-tight mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">
                    {offer.subtitle}
                  </p>
                </div>

                {/* Pricing and Action row */}
                <div className="pt-4 border-t border-slate-100 z-10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Special price</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl font-black text-slate-950">{offer.salePrice}</span>
                      <span className="text-xs text-slate-400 line-through font-semibold">{offer.originalPrice}</span>
                    </div>
                  </div>

                  <Link
                    href="/services"
                    className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-4 py-2.5 rounded-xl bg-gradient-to-r ${offer.gradient} text-white shadow-md shadow-rose-300/30 group-hover:shadow-lg group-hover:shadow-rose-400/40 transition-all`}
                  >
                    Book Deal
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}


      </div>
    </section>
  );
}
