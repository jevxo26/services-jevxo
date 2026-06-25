"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, ArrowRight, Zap, Gift, Percent } from "lucide-react";
import Link from "next/link";

const OFFERS = [
  {
    id: 1,
    badge: "🔥 Hot Deal",
    badgeColor: "bg-rose-100 text-rose-600",
    title: "Deep Home Cleaning",
    subtitle: "Full apartment • Up to 3 rooms",
    discount: "30% OFF",
    originalPrice: "৳2,500",
    salePrice: "৳1,750",
    expires: "Ends tonight",
    icon: Zap,
    gradient: "from-[#FF7C71] to-rose-600",
    bg: "from-rose-50 to-orange-50",
    border: "border-rose-200",
  },
  {
    id: 2,
    badge: "🎁 New User",
    badgeColor: "bg-emerald-100 text-emerald-600",
    title: "First Booking Free",
    subtitle: "Any service • New accounts only",
    discount: "FREE",
    originalPrice: "৳1,200",
    salePrice: "৳0",
    expires: "Limited slots",
    icon: Gift,
    gradient: "from-emerald-500 to-teal-600",
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
  },
  {
    id: 3,
    badge: "⚡ Flash Sale",
    badgeColor: "bg-amber-100 text-amber-600",
    title: "AC Service + Clean",
    subtitle: "Split AC • Includes gas refill check",
    discount: "25% OFF",
    originalPrice: "৳3,200",
    salePrice: "৳2,400",
    expires: "48 hrs left",
    icon: Percent,
    gradient: "from-amber-500 to-orange-500",
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-200",
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
  const countdown = useCountdown(8);

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FF7C71]/10 border border-[#FF7C71]/20 text-[#FF7C71] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
              <Tag size={13} />
              Limited Time Offers
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-7 h-7 text-[#FF7C71]" />
              Special Deals
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-md">
              Grab exclusive discounts on top home services — limited slots available.
            </p>
          </div>

          {/* Live Countdown */}
          <div className="flex items-center gap-2.5 bg-slate-900 text-white px-4 py-2.5 rounded-2xl self-start sm:self-auto">
            <Clock size={15} className="text-[#FF7C71]" />
            <span className="text-xs font-semibold text-slate-400">Flash ends in</span>
            <span className="text-sm font-black tabular-nums text-[#FF7C71]">{countdown}</span>
          </div>
        </div>

        {/* Offer Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {OFFERS.map((offer) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={offer.id}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`relative rounded-3xl border ${offer.border} bg-gradient-to-br ${offer.bg} p-6 flex flex-col gap-4 overflow-hidden cursor-pointer group transition-shadow hover:shadow-xl hover:shadow-slate-200/60`}
              >
                {/* Decorative blob */}
                <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${offer.gradient} opacity-10 blur-2xl pointer-events-none`} />

                {/* Badge + discount */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${offer.badgeColor}`}>
                    {offer.badge}
                  </span>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${offer.gradient} text-white shadow-lg`}>
                    <Icon size={18} />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{offer.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{offer.subtitle}</p>
                </div>

                {/* Pricing */}
                <div className="flex items-end gap-3">
                  <span className={`text-3xl font-black bg-gradient-to-br ${offer.gradient} bg-clip-text text-transparent`}>
                    {offer.discount}
                  </span>
                  <div className="flex flex-col pb-0.5">
                    <span className="text-xs text-slate-400 line-through">{offer.originalPrice}</span>
                    <span className="text-sm font-black text-slate-800">{offer.salePrice}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock size={11} /> {offer.expires}
                  </span>
                  <Link
                    href="/services"
                    className={`inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r ${offer.gradient} bg-clip-text text-transparent group-hover:underline`}
                  >
                    Book Now <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA row */}
        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#FF7C71] hover:underline"
          >
            View all offers <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
