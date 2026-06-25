"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, CheckCircle2, Building2 } from "lucide-react";

const AREAS = [
  { city: "Dhaka", zones: ["Mirpur", "Gulshan", "Dhanmondi", "Uttara", "Mohammadpur", "Banani"], active: true, highlight: true },
  { city: "Chittagong", zones: ["Agrabad", "Nasirabad", "Halishahar", "Panchlaish"], active: true, highlight: false },
  { city: "Sylhet", zones: ["Zindabazar", "Amberkhana", "Shahjalal Upashahar"], active: true, highlight: false },
  { city: "Rajshahi", zones: ["Boalia", "Rajpara", "Motihar"], active: true, highlight: false },
  { city: "Khulna", zones: ["Sonadanga", "Khalishpur", "Daulatpur"], active: true, highlight: false },
  { city: "Comilla", zones: ["Kotwali", "Sadar South"], active: false, highlight: false },
  { city: "Gazipur", zones: ["Tongi", "Joydebpur", "Sreepur"], active: true, highlight: false },
  { city: "Narayanganj", zones: ["Siddhirganj", "Fatullah", "Bandar"], active: false, highlight: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 70, damping: 14 } },
} as const;

export default function ServiceAreas() {
  const activeCount = AREAS.filter((a) => a.active).length;

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FF7C71]/10 border border-[#FF7C71]/20 text-[#FF7C71] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            <MapPin size={13} />
            Coverage Areas
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <Building2 className="w-7 h-7 text-[#FF7C71]" />
            We Serve Across Bangladesh
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Rajseba is available in {activeCount} major cities with hundreds of verified professionals ready to serve you.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
          {[
            { value: `${activeCount}`, label: "Active Cities" },
            { value: "50+", label: "Service Zones" },
            { value: "500+", label: "Professionals" },
            { value: "24/7", label: "Availability" },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-6 border-r border-slate-200 last:border-0">
              <p className="text-2xl font-black text-[#FF7C71]">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* City Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {AREAS.map((area) => (
            <motion.div
              key={area.city}
              variants={itemVariants}
              className={`relative rounded-2xl border p-5 transition-all ${
                area.highlight
                  ? "bg-gradient-to-br from-[#FF7C71]/10 to-rose-50 border-[#FF7C71]/30 shadow-md"
                  : area.active
                  ? "bg-white border-slate-200 hover:border-[#FF7C71]/40 hover:shadow-md"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              {/* Status chip */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <MapPin size={15} className={area.active ? "text-[#FF7C71]" : "text-slate-400"} />
                  <h3 className={`font-extrabold text-sm ${area.active ? "text-slate-900" : "text-slate-400"}`}>
                    {area.city}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    area.highlight
                      ? "bg-[#FF7C71] text-white"
                      : area.active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {area.highlight ? "🏙️ HQ" : area.active ? "Active" : "Coming Soon"}
                </span>
              </div>

              {/* Zones */}
              <ul className="space-y-1">
                {area.zones.slice(0, 4).map((zone) => (
                  <li key={zone} className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                    <CheckCircle2 size={11} className={area.active ? "text-[#FF7C71]" : "text-slate-300"} />
                    {zone}
                  </li>
                ))}
                {area.zones.length > 4 && (
                  <li className="text-[11px] text-slate-400 font-semibold pl-4">
                    +{area.zones.length - 4} more zones
                  </li>
                )}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="mt-10 text-center bg-gradient-to-r from-[#FF7C71]/10 to-rose-50 border border-[#FF7C71]/20 rounded-3xl p-6">
          <p className="text-slate-700 font-semibold text-sm">
            📍 Don't see your area? We're expanding fast!
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Leave your location and we'll notify you when Rajseba arrives near you.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 bg-[#FF7C71] hover:bg-[#FF7C71]/90 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-rose-300/30 transition-all active:scale-[0.98]">
            <MapPin size={14} />
            Request My Area
          </button>
        </div>
      </div>
    </section>
  );
}
