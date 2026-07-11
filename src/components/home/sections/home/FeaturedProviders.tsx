"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, BadgeCheck, MapPin, ThumbsUp, Briefcase, Users } from "lucide-react";
import { useGetPublicProfilesQuery } from "@/redux/features/landing/landingApi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 65, damping: 15 },
  },
} as const;


function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-20 bg-slate-100 relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-14 h-14 rounded-full bg-slate-200 border-4 border-white" />
      </div>
      <div className="pt-10 p-5 flex flex-col gap-3">
        <div className="h-4 w-28 bg-slate-100 rounded-full mx-auto" />
        <div className="h-3 w-20 bg-slate-100 rounded-full mx-auto" />
        <div className="h-10 bg-slate-100 rounded-xl" />
        <div className="flex gap-2 justify-center">
          <div className="h-5 w-16 bg-slate-100 rounded-full" />
          <div className="h-5 w-20 bg-slate-100 rounded-full" />
        </div>
        <div className="h-9 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function FeaturedProviders() {
  const { data: profilesRes, isLoading } = useGetPublicProfilesQuery();

  const rawProfiles: any[] = profilesRes?.data ?? (Array.isArray(profilesRes) ? profilesRes : []);
  const activeProviders = rawProfiles.filter(
    (p: any) => {
      if (!p.categories || p.categories.length === 0) return false;
      const phoneClean = String(p.user?.phone || p.phone || "").replace(/[^0-9]/g, "");
      if (phoneClean.includes("1711715575")) return false;
      return true;
    }
  );

  const providers = activeProviders.slice(0, 4).map((p: any, idx: number) => {
    const user = p.user ?? {};

    const hidePhoneNumber = (text: string) => {
      if (!text) return text;
      const digitsOnly = text.replace(/[^0-9]/g, "");
      if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
        return "Service Provider";
      }
      return text.replace(/(01[3-9]\d{8})/g, (match) => {
        return `${match.slice(0, 5)}***${match.slice(-3)}`;
      });
    };

    const services: string[] = Array.isArray(p.categories) && p.categories.length > 0
      ? p.categories.map((c: any) => c.name ?? c).slice(0, 3)
      : [];

    if (p.min_starting_price && !isNaN(Number(p.min_starting_price))) {
      services.push(`From ৳${Number(p.min_starting_price).toLocaleString()}`);
    }

    const rawLoc =
      p.area?.name ?? p.district?.name ?? p.devision?.name ?? p.location ?? "Bangladesh";
    const location = String(rawLoc)
      .split(/[,\s]+/)
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(", ");

    const rating = p.rating != null && !isNaN(Number(p.rating))
      ? Number(p.rating).toFixed(1)
      : "0.0";

    const reviews = p.total_reviews ?? 0;
    const jobs = p.total_projects != null && Number(p.total_projects) > 0
      ? `${p.total_projects}+`
      : "0+";

    const specialty =
      p.company_name ||
      (p.description ? p.description.slice(0, 45) : null) ||
      "Service Provider";

    const badge = {
      label: p.type === "company" ? "Company" : "Individual",
      cls: p.type === "company" ? "bg-violet-600 text-white" : "bg-slate-700 text-white",
    };

    return {
      id: p.id ?? idx,
      name: hidePhoneNumber(user.name || p.company_name || "Provider"),
      specialty: hidePhoneNumber(specialty),
      location,
      rating,
      reviews,
      jobs,
      avatar: p.picture || user.profileImage || user.avatar || null,
      services: services.map(s => hidePhoneNumber(s)),
      badge,
    };
  });

  return (
    <section className="py-5 md:py-8 lg:py-10 overflow-hidden">
      <div className="w-full max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            <BadgeCheck size={13} />
            Verified Professionals
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <ThumbsUp className="w-5 h-5 md:w-6 md:h-6 text-[#FF6014]" />
            Our Top <span className="text-[#FF6014]">Providers</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Background-checked, highly rated professionals trusted by thousands of happy customers.
          </p>
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : providers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm font-medium">No agents available right now.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {providers.map((provider) => (
              <motion.div
                key={provider.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.015 }}
                className="relative bg-white rounded-2xl border border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-100/60 hover:border-blue-500 overflow-hidden flex flex-col transition-all cursor-pointer group"
              >
                {/* Top colour band */}
                <div className="relative h-20 flex-shrink-0 bg-gradient-to-br from-[#fff5f0] to-[#ffe8da]">
                  {/* Badge */}
                  <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${provider.badge.cls}`}>
                    {provider.badge.label}
                  </span>

                  {/* Avatar */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="relative">
                      {provider.avatar ? (
                        <img
                          src={provider.avatar}
                          alt={provider.name}
                          className="w-14 h-14 rounded-full object-cover bg-slate-100 border-4 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6014] to-[#ff7c71] text-white flex items-center justify-center font-black text-lg border-4 border-white shadow-md uppercase">
                          {provider.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="pt-10 px-4 pb-4 flex flex-col gap-3 flex-1">

                  {/* Name + specialty */}
                  <div className="text-center">
                    <h3 className="font-extrabold text-[15px] leading-tight text-slate-900">
                      {provider.name}
                    </h3>
                    <p className="text-[11px] font-semibold mt-0.5 line-clamp-1 text-[#FF6014]">
                      {provider.specialty}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-400">
                    <MapPin size={11} />
                    {provider.location}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-stretch rounded-xl overflow-hidden border border-slate-100">
                    <div className="flex-1 py-2 text-center bg-slate-50">
                      <div className="flex items-center justify-center gap-1 text-[13px] font-black text-slate-800">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        {provider.rating}
                      </div>
                      <p className="text-[10px] font-semibold mt-0.5 text-slate-400">
                        {provider.reviews} reviews
                      </p>
                    </div>
                    <div className="w-px bg-slate-100" />
                    <div className="flex-1 py-2 text-center bg-slate-50">
                      <div className="flex items-center justify-center gap-1 text-[13px] font-black text-slate-800">
                        <Briefcase size={11} className="text-slate-400" />
                        {provider.jobs}
                      </div>
                      <p className="text-[10px] font-semibold mt-0.5 text-slate-400">
                        Jobs done
                      </p>
                    </div>
                  </div>

                  {/* Service tags */}
                  <div className="flex flex-wrap gap-1.5 justify-center min-h-[24px]">
                    {provider.services.length > 0 ? (
                      provider.services.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))
                    ) : ""}
                  </div>


                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
}