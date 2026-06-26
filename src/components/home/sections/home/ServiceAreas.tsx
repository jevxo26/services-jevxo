"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, CheckCircle2, Building2, Loader2 } from "lucide-react";
import {
  useGetAllDevisionsQuery,
  useGetAllDistrictsQuery,
} from "@/redux/features/admin/location";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 70, damping: 14 } },
} as const;

export default function ServiceAreas() {
  const { data: divRes, isLoading: isDivisionsLoading } = useGetAllDevisionsQuery();
  const { data: distRes, isLoading: isDistrictsLoading } = useGetAllDistrictsQuery();

  const divisions = divRes?.data || [];
  const allDistricts = distRes?.data || [];

  const areas = useMemo(() => {
    return divisions.map((division: any) => {
      const nestedDistricts = division.districts || [];
      const districts =
        nestedDistricts.length > 0
          ? nestedDistricts
          : allDistricts.filter(
              (district: any) => String(district.devision?.id) === String(division.id)
            );

      return {
        id: division.id,
        city: division.name,
        zones: districts.map((district: any) => district.name),
        active: districts.length > 0,
        highlight: division.name?.toLowerCase() === "dhaka",
      };
    });
  }, [divisions, allDistricts]);

  const activeCount = areas.filter((area) => area.active).length;
  const totalDistricts = areas.reduce((sum, area) => sum + area.zones.length, 0);
  const isLoading = isDivisionsLoading || isDistrictsLoading;

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
            {isLoading
              ? "Loading our coverage areas..."
              : `Rajseba is available in ${activeCount} divisions with ${totalDistricts} districts and verified professionals ready to serve you.`}
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
          {[
            { value: isLoading ? "—" : `${activeCount}`, label: "Active Divisions" },
            { value: isLoading ? "—" : `${totalDistricts}`, label: "Districts" },
            { value: "500+", label: "Professionals" },
            { value: "24/7", label: "Availability" },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-6 border-r border-slate-200 last:border-0">
              <p className="text-2xl font-black text-[#FF7C71]">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Division Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF7C71]" />
            <p className="text-xs font-bold text-slate-400">Loading divisions & districts...</p>
          </div>
        ) : areas.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-sm font-semibold text-slate-500">No coverage areas available yet.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {areas.map((area) => (
              <motion.div
                key={area.id}
                variants={itemVariants}
                className={`relative rounded-2xl border p-5 transition-all ${
                  area.highlight
                    ? "bg-gradient-to-br from-[#FF7C71]/10 to-rose-50 border-[#FF7C71]/30 shadow-md"
                    : area.active
                    ? "bg-white border-slate-200 hover:border-[#FF7C71]/40 hover:shadow-md"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
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

                {area.zones.length > 0 ? (
                  <ul className="space-y-1">
                    {area.zones.slice(0, 4).map((zone: string) => (
                      <li key={zone} className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                        <CheckCircle2 size={11} className={area.active ? "text-[#FF7C71]" : "text-slate-300"} />
                        {zone}
                      </li>
                    ))}
                    {area.zones.length > 4 && (
                      <li className="text-[11px] text-slate-400 font-semibold pl-4">
                        +{area.zones.length - 4} more districts
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-[12px] text-slate-400 font-medium">Districts coming soon</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

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
