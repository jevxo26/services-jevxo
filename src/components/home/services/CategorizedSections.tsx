"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { TbAirConditioning, TbScissors, TbTruck } from "react-icons/tb";
import {
  FaFaucet,
  FaBolt,
  FaTv,
  FaPaintRoller,
  FaLeaf,
  FaBug,
  FaHammer,
} from "react-icons/fa";
import { MdOutlineCleaningServices, MdOutlineSecurity } from "react-icons/md";
import { useGetPublicCategoriesQuery } from "@/redux/features/landing/landingApi";

// Section Icon Maps
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  cleaning: MdOutlineCleaningServices,
  "ac-repair": TbAirConditioning,
  plumbing: FaFaucet,
  electrical: FaBolt,
  carpentry: FaHammer,
  painting: FaPaintRoller,
  "salon-spa": TbScissors,
  "home-salon": TbScissors,
  gardening: FaLeaf,
  "pest-control": FaBug,
  shifting: TbTruck,
  cctv: MdOutlineSecurity,
  appliance: FaTv,
  "appliance-repair": FaTv,
};

const SectionHeader = ({ title, viewAllHref }: { title: string; viewAllHref?: string }) => (
  <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-100">
    <div className="relative">
      <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
        {title}
      </h3>
      <div className="absolute -bottom-[3px] left-0 w-16 h-1 bg-[#FF7C71] rounded-full" />
    </div>
    {viewAllHref && (
      <Link
        href={viewAllHref}
        className="text-xs md:text-sm font-extrabold text-[#FF7C71] hover:text-[#E5675D] transition-colors flex items-center gap-1 uppercase tracking-wider"
      >
        View All <ArrowRight size={14} strokeWidth={2.5} />
      </Link>
    )}
  </div>
);

export default function CategorizedSections() {
  const { data: categoriesRes } = useGetPublicCategoriesQuery();
  const categories = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);

  // Helper to find category by slug
  const getCategorySlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="space-y-20 md:space-y-28 pb-16">
      {/* ── 1. Cleaning Section ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <SectionHeader title="Cleaning" viewAllHref="/services?category=cleaning" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Deep Cleaning */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#FF7C71]/20 transition-all duration-300 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center shrink-0">
              <MdOutlineCleaningServices size={22} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-base mb-1.5">Deep Cleaning</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Intensive deep home sanitization and scrubbing.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Kitchen Cleaning */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#FF7C71]/20 transition-all duration-300 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center shrink-0">
              <MdOutlineCleaningServices size={22} className="rotate-45" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-base mb-1.5">Kitchen Cleaning</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Degreasing and detailed cabinet cleaning services.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Bathroom Cleaning */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#FF7C71]/20 transition-all duration-300 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center shrink-0">
              <MdOutlineCleaningServices size={22} className="-scale-x-100" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-base mb-1.5">Bathroom Cleaning</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Tackle lime-stains, sparkling sanitization.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Home Repairs Section ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <SectionHeader title="Home Repairs" viewAllHref="/services" />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {[
            { name: "AC Repair", slug: "ac-repair", icon: TbAirConditioning },
            { name: "Plumbing", slug: "plumbing", icon: FaFaucet },
            { name: "Electrical", slug: "electrical", icon: FaBolt },
            { name: "Carpentry", slug: "carpentry", icon: FaHammer },
            { name: "Painting", slug: "painting", icon: FaPaintRoller },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.slug} href={`/services?category=${item.slug}`}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#FF7C71]/20 transition-all duration-300 text-center flex flex-col items-center justify-center gap-3 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <span className="font-extrabold text-slate-800 text-xs tracking-wide">
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 3. Lifestyle Section ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <SectionHeader title="Lifestyle" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Left Description Box */}
          <div className="bg-[#FFF8F7] rounded-3xl p-8 flex flex-col justify-between items-start border border-[#FFE1E2]">
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold text-[#FF7C71] bg-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Premium Living
              </span>
              <p className="text-slate-700 font-extrabold text-base md:text-lg leading-relaxed">
                Indulge in premium home salon, spa, and garden maintenance without leaving your home.
              </p>
            </div>
            <Link href="/services?category=home-salon">
              <button className="mt-8 px-6 py-3 bg-[#FF7C71] hover:bg-[#E5675D] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md shadow-rose-100 hover:shadow-lg hover:shadow-rose-200 cursor-pointer uppercase tracking-wider">
                Explore More
              </button>
            </Link>
          </div>

          {/* Right Cards List */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1: Salon & Spa */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#FF7C71]/20 transition-all duration-300 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center mb-4">
                  <TbScissors size={20} />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-1.5">Salon & Spa</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Professional pampering at home.
                </p>
              </div>
              <Link href="/services?category=home-salon" className="text-xs font-bold text-[#FF7C71] hover:underline inline-flex items-center gap-0.5 mt-2">
                Book Service <ArrowRight size={12} />
              </Link>
            </motion.div>

            {/* Card 2: Gardening */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#FF7C71]/20 transition-all duration-300 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center mb-4">
                  <FaLeaf size={18} />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-1.5">Gardening</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Nurture your outdoor spaces.
                </p>
              </div>
              <Link href="/services?category=gardening" className="text-xs font-bold text-[#FF7C71] hover:underline inline-flex items-center gap-0.5 mt-2">
                Book Service <ArrowRight size={12} />
              </Link>
            </motion.div>

            {/* Card 3: Pest Control */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#FF7C71]/20 transition-all duration-300 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center mb-4">
                  <FaBug size={18} />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-1.5">Pest Control</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Keep your home safe & clean.
                </p>
              </div>
              <Link href="/services?category=pest-control" className="text-xs font-bold text-[#FF7C71] hover:underline inline-flex items-center gap-0.5 mt-2">
                Book Service <ArrowRight size={12} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. Other Services Section ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <SectionHeader title="Other Services" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Shifting & Relocation (double column width on desktop) */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#FF7C71]/20 transition-all duration-300 flex flex-col sm:flex-row justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center shrink-0">
                <TbTruck size={22} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-base mb-1.5">Shifting & Relocation</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Packers and movers for painless move from another to your new home.
                </p>
              </div>
            </div>
            <div className="sm:self-end shrink-0">
              <Link href="/services?category=shifting" className="text-xs font-extrabold text-[#FF7C71] hover:underline inline-flex items-center gap-1">
                Learn More <ArrowRight size={12} strokeWidth={2.5} />
              </Link>
            </div>
          </motion.div>

          {/* CCTV & Appliance stacked or small */}
          <div className="grid grid-cols-2 gap-4">
            {/* CCTV */}
            <Link href="/services?category=cctv" className="h-full">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#FF7C71]/20 transition-all duration-300 text-center flex flex-col items-center justify-center gap-3 cursor-pointer h-full"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center">
                  <MdOutlineSecurity size={20} />
                </div>
                <span className="font-extrabold text-slate-800 text-xs tracking-wide">
                  CCTV
                </span>
              </motion.div>
            </Link>

            {/* Appliance */}
            <Link href="/services?category=appliance-repair" className="h-full">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#FF7C71]/20 transition-all duration-300 text-center flex flex-col items-center justify-center gap-3 cursor-pointer h-full"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center">
                  <FaTv size={18} />
                </div>
                <span className="font-extrabold text-slate-800 text-xs tracking-wide">
                  Appliance
                </span>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
