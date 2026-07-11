"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, CheckCircle2, Building2, Loader2, Sparkles, Clock, Globe } from "lucide-react";
import {
  useGetAllDevisionsQuery,
  useGetAllDistrictsQuery,
} from "@/redux/features/admin/location";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 65, damping: 15 } },
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
    <section className="py-5 md:py-8 lg:py-10 overflow-hidden relative">
      <div className="w-full max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FFF4EE] border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-4">
            <Globe className="w-3.5 h-3.5" />
            Coverage Areas
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight leading-tight flex items-center justify-center gap-2">
            <Globe className="w-5 h-5 md:w-6 md:h-6 text-[#FF6014]" />
            We Serve Across <span className="text-[#FF6014]">Bangladesh</span>
          </h2>
          <p className="mt-3.5 text-slate-400 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            {isLoading
              ? "Mapping our coverage areas..."
              : `Rajseba is available in ${activeCount} divisions with ${totalDistricts} districts and verified professionals ready to serve you.`}
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap items-center justify-center gap-3 md:gap-4 mb-12">
          {[
            { value: isLoading ? "—" : `${activeCount}`, label: "Active Divisions", icon: MapPin },
            { value: isLoading ? "—" : `${totalDistricts}`, label: "Districts Covered", icon: Building2 },
            { value: "500+", label: "Verified Partners", icon: CheckCircle2 },
            { value: "24/7", label: "Instant Support", icon: Clock },
          ].map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-slate-100/80 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
                <div className="w-8.5 h-8.5 rounded-xl bg-[#FFF8F4] flex items-center justify-center text-[#FF6014] shrink-0 border border-[#FF6014]/10">
                  <StatIcon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-base font-black text-slate-900 leading-none">{stat.value}</p>
                  <p className="text-[8px] font-extrabold uppercase tracking-wider text-slate-400 mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Division Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
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
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {areas.map((area) => (
              <motion.div
                key={area.id}
                variants={itemVariants}
                className={`group relative rounded-3xl border p-5 transition-all duration-300 flex flex-col justify-between ${area.highlight
                    ? "bg-gradient-to-br from-[#FFFDFB] to-[#FFF9F6] border-[#FF6014]/20 shadow-[0_10px_35px_rgba(255,96,20,0.035)] hover:border-[#FF6014]/40"
                    : area.active
                      ? "bg-white border-slate-100 hover:border-[#FF6014]/25 hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
                      : "bg-slate-50/50 border-slate-100 opacity-60"
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${area.active ? "bg-[#FFF4EE] text-[#FF6014]" : "bg-slate-100 text-slate-400"}`}>
                        <MapPin size={16} />
                      </div>
                      <h3 className={`font-black text-sm ${area.active ? "text-slate-800" : "text-slate-400"}`}>
                        {area.city}
                      </h3>
                    </div>
                    <span
                      className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${area.highlight
                          ? "bg-[#FF6014] text-white border-[#FF6014]"
                          : area.active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-slate-200 text-slate-500 border-slate-300"
                        }`}
                    >
                      {area.active && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                      )}
                      {area.highlight ? "🏙️ HQ" : area.active ? "Active" : "Soon"}
                    </span>
                  </div>

                  {area.zones.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {area.zones.slice(0, 4).map((zone: string) => (
                        <span
                          key={zone}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors ${area.active
                              ? "bg-slate-50 border-slate-100/80 text-slate-500 group-hover:bg-[#FFF8F4] group-hover:border-[#FF6014]/10 group-hover:text-[#FF6014]/80"
                              : "bg-slate-100 border-slate-200 text-slate-400"
                            }`}
                        >
                          {zone}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 font-semibold italic pl-1">Districts coming soon</p>
                  )}
                </div>

                {area.zones.length > 4 && (
                  <div className="mt-3 pt-3 border-t border-slate-50 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">
                    +{area.zones.length - 4} more districts
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <div className="mt-12 relative overflow-hidden bg-gradient-to-br from-[#FFFDFB] to-[#FFF4EE] border border-[#FF6014]/20 rounded-[32px] p-6 md:p-8 shadow-md">
          {/* Background glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6014]/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF6014]/2 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/25 mb-3">
                <Sparkles className="w-3 h-3" />
                Rapid Expansion
              </span>
              <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
                Don't see your area? We're expanding fast!
              </h3>
              <p className="text-slate-500 text-xs mt-1.5 max-w-xl font-medium">
                Leave your location details and we will notify you immediately once Rajseba verified professionals arrive in your neighborhood.
              </p>
            </div>
            <button className="shrink-0 bg-[#FF6014] hover:bg-[#FF6014]/90 active:scale-[0.98] text-white text-xs font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-[#FF6014]/20 transition-all flex items-center gap-2">
              <MapPin size={14} />
              Request My Area
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
