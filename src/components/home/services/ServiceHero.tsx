"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetPublicCategoriesQuery } from "@/redux/features/landing/landingApi";
import { useGetAllDevisionsQuery } from "@/redux/features/admin/location";
import { CustomSelect } from "@/components/ui/select";
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
  const { data: divisionsRes } = useGetAllDevisionsQuery();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedDivision, setSelectedDivision] = useState(searchParams.get("devision") || "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const activeCategory = searchParams.get("category") || "";

  const categoryOptions = useMemo(() => {
    return apiCategories
      .filter((cat: { parent?: unknown }) => !cat.parent)
      .map((cat: { id: number; name: string }) => ({
        value: String(cat.id),
        label: cat.name,
      }));
  }, [apiCategories]);

  const divisionOptions = useMemo(() => {
    const divisions = divisionsRes?.data || [];
    return divisions.map((div: { id: number; name: string }) => ({
      value: String(div.id),
      label: div.name,
    }));
  }, [divisionsRes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedDivision) params.set("devision", selectedDivision);
    if (selectedCategory) params.set("category", selectedCategory);

    router.push(`/services?${params.toString()}`);
  };

  return (
    <section className="bg-white pt-6 pb-6 md:py-16 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4 max-w-3xl mx-auto">
          Find the best home <span className="text-[#FF7C71]">services</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto mb-5 md:mb-8 font-medium leading-relaxed">
          Premium, reliable, and effortless solutions for your urban lifestyle in Bangladesh.
        </p>

        {/* Floating Search Bar Card */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSearch}
          className="w-full max-w-3xl mx-auto bg-white rounded-2xl md:rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-slate-100 p-2 sm:p-3 flex flex-col md:flex-row items-center gap-2.5 sm:gap-3 md:gap-0 mb-10"
        >
          {/* Category Select */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 w-full px-3 sm:px-4 py-1.5 sm:py-2 md:py-1 relative">
            <Search className="text-slate-400 w-5 h-5 flex-shrink-0" />
            <CustomSelect
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Select Category"
              className="w-full"
              triggerClassName="border-none bg-transparent hover:bg-transparent shadow-none px-0 py-1.5 h-auto text-slate-700 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Vertical Separator */}
          <div className="hidden md:block h-8 w-px bg-slate-200" />

          {/* Location Select */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 w-full px-3 sm:px-4 py-1.5 sm:py-2 md:py-1">
            <MapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
            <CustomSelect
              options={divisionOptions}
              value={selectedDivision}
              onChange={setSelectedDivision}
              placeholder="Select Division"
              className="w-full"
              triggerClassName="border-none bg-transparent hover:bg-transparent shadow-none px-0 py-1.5 h-auto text-slate-700 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            className="w-full md:w-auto bg-[#FF7C71] hover:bg-[#E5675D] text-white font-extrabold px-6 sm:px-8 py-3.5 h-auto rounded-xl md:rounded-full transition-all duration-200 shadow-sm active:scale-95 text-sm sm:text-base flex-shrink-0 cursor-pointer"
          >
            Search
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
                ? `/services?devision=${encodeURIComponent(selectedDivision)}&q=${encodeURIComponent(searchQuery)}`
                : `/services?category=${slug}&devision=${encodeURIComponent(selectedDivision)}&q=${encodeURIComponent(searchQuery)}`;

              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
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
