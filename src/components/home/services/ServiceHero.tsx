"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetPublicCategoriesQuery } from "@/redux/features/landing/landingApi";
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
import { LayoutGrid } from "lucide-react";

// Category Icon Map for Hero Pills
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "AC Repair": TbAirConditioning,
  "AC": TbAirConditioning,
  Plumbing: FaFaucet,
  Cleaning: MdOutlineCleaningServices,
  Electrical: FaBolt,
  Shifting: TbTruck,
  CCTV: MdOutlineSecurity,
  Security: MdOutlineSecurity,
  "Appliance Repair": FaTv,
  Appliance: FaTv,
  Painting: FaPaintRoller,
  Gardening: FaLeaf,
  "Pest Control": FaBug,
  Salon: TbScissors,
  "Home Salon": TbScissors,
  Carpentry: FaHammer,
};

const FALLBACK_ICON = LayoutGrid;

const ServiceHero = () => {
  const { data: categoriesRes, isLoading: isCategoriesLoading } = useGetPublicCategoriesQuery();
  const apiCategories = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);


  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "Dhaka, BD");

  const activeCategory = searchParams.get("category") || "";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (location) params.set("location", location);
    if (activeCategory) params.set("category", activeCategory);

    router.push(`/services?${params.toString()}`);
  };

  return (
    <section className="bg-white py-12 md:py-16 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4 max-w-3xl mx-auto">
          Find the best home <span className="text-[#FF7C71]">services</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto mb-8 font-medium leading-relaxed">
          Premium, reliable, and effortless solutions for your urban lifestyle in Bangladesh.
        </p>

        {/* Floating Search Bar Card */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSearch}
          className="w-full max-w-2xl mx-auto bg-white rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-slate-100 p-2 flex items-center justify-between gap-1 mb-10"
        >
          {/* Search Input */}
          <div className="flex items-center gap-2.5 flex-1 pl-4">
            <Search className="text-slate-400 w-4.5 h-4.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What service do you need?"
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 outline-none w-full py-1.5"
            />
          </div>

          {/* Vertical Separator */}
          <div className="h-6 w-px bg-slate-200" />

          {/* Location Input */}
          <div className="flex items-center gap-2.5 flex-1 max-w-[160px] pl-2 sm:pl-3">
            <MapPin className="text-slate-400 w-4.5 h-4.5 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Dhaka, BD"
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 outline-none w-full py-1.5"
            />
          </div>

          {/* Search Button (Square/Round Red) */}
          <Button
            type="submit"
            className="w-10 h-10 bg-[#FF7C71] hover:bg-[#E5675D] text-white flex items-center justify-center rounded-full transition-all duration-200 shrink-0 cursor-pointer shadow-md shadow-rose-200"
            aria-label="Search"
          >
            <Search size={16} strokeWidth={2.8} />
          </Button>
        </motion.form>

        {/* Quick-nav Category Pills */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
          {isCategoriesLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-8 w-24 bg-slate-100 animate-pulse rounded-full border border-slate-50"
              />
            ))
          ) : (
            apiCategories.map((cat: any) => {
              const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || String(cat.id);
              const label = cat.name || cat.label || "";
              
              // Find matching icon
              const Icon =
                CATEGORY_ICON_MAP[label] ||
                CATEGORY_ICON_MAP[Object.keys(CATEGORY_ICON_MAP).find((k) =>
                  label.toLowerCase().includes(k.toLowerCase())
                ) || ""] ||
                FALLBACK_ICON;

              const isActive = activeCategory === slug;

              // Toggle category selection
              const pillHref = isActive
                ? `/services?location=${encodeURIComponent(location)}&q=${encodeURIComponent(searchQuery)}`
                : `/services?category=${slug}&location=${encodeURIComponent(location)}&q=${encodeURIComponent(searchQuery)}`;

              return (
                <Link
                  key={cat.id}
                  href={pillHref}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border font-extrabold text-xs transition-all duration-200 hover:-translate-y-0.5 no-underline cursor-pointer shadow-sm ${
                    isActive
                      ? "border-[#FF7C71] text-[#FF7C71] bg-[#FFF8F7]"
                      : "border-slate-100 text-slate-600 bg-white hover:border-[#FF7C71]/40 hover:text-slate-800"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-[#FF7C71]" : "text-slate-400"} />
                  {label}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
