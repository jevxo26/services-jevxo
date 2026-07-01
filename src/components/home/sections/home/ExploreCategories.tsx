"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TbAirConditioning, TbTruck } from "react-icons/tb";
import {
  FaFaucet,
  FaBolt,
  FaCouch,
  FaPaintRoller,
  FaTint,
  FaHotTub,
  FaHouseDamage,
  FaHeadset,
} from "react-icons/fa";
import { MdOutlineCleaningServices, MdLocalLaundryService } from "react-icons/md";
import { LayoutGrid, Loader2 } from "lucide-react";
import { useGetPublicCategoriesQuery } from "@/redux/features/landing/landingApi";

// ─── Named export kept for Navbar.tsx dropdown ───────────────────────────────
export const CATEGORIES_CONTENT = {
  title: "Explore Categories",
  subtitle: "Choose from our wide range of professional, verified home services",
  categories: [
    { label: "AC Service & Repair", slug: "ac-service-repair", icon: TbAirConditioning },
    { label: "Home & Office Shifting", slug: "home-office-shifting", icon: TbTruck },
    { label: "Plumbing Service", slug: "plumbing-service", icon: FaFaucet },
    { label: "Home Appliance Repair", slug: "home-appliance-repair", icon: MdLocalLaundryService },
    { label: "Home & Office Cleaning", slug: "home-office-cleaning", icon: MdOutlineCleaningServices },
    { label: "Water Purifier Installation", slug: "water-purifier-installation", icon: FaTint },
    { label: "Home & Office Painting", slug: "home-office-painting", icon: FaPaintRoller },
    { label: "Geyser Installation & Repair", slug: "geyser-installation-repair", icon: FaHotTub },
    { label: "Electrical Service", slug: "electrical-service", icon: FaBolt },
    { label: "Home & Office Renovation", slug: "home-office-renovation", icon: FaHouseDamage },
    { label: "PPM Service", slug: "ppm-service", icon: FaHeadset },
    { label: "Sofa & Carpet Deep Cleaning", slug: "sofa-carpet-deep-cleaning", icon: FaCouch },
  ],
};

// ─── Manual icon map: exact backend category name → icon ────────────────────
// NOTE: এখানে কোনো dynamic/partial string matching ব্যবহার করা হয়নি।
// API থেকে আসা category.name এই ১২টি নামের সাথে EXACT মিলতে হবে।
// নতুন category backend এ যোগ হলে এখানে নতুন entry ম্যানুয়ালি যোগ করতে হবে।
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "AC Service & Repair": TbAirConditioning,
  "AC Service & Cleaning": TbAirConditioning,
  "Home & Office Shifting": TbTruck,
  "Plumbing Service": FaFaucet,
  "Home Appliance Repair": MdLocalLaundryService,
  "Home & Office Cleaning": MdOutlineCleaningServices,
  "Home & Office Deep Cleaning": MdOutlineCleaningServices,
  "Water Purifier Installation": FaTint,
  "Home & Office Painting": FaPaintRoller,
  "Geyser Installation & Repair": FaHotTub,
  "Electrical Service": FaBolt,
  "Home & Office Renovation": FaHouseDamage,
  "PPM Service": FaHeadset,
  "PPM Service (Planned Preventive Maintenance)": FaHeadset,
  "Planned Preventive Maintenance": FaHeadset,
  "Sofa & Carpet Deep Cleaning": FaCouch,
};

const FALLBACK_ICON = LayoutGrid;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 65, damping: 15 },
  },
} as const;

const ExploreCategories = () => {
  const { data: categoriesRes, isLoading, isError } = useGetPublicCategoriesQuery();
  const [isMounted, setIsMounted] = useState(false);
  const [showAllMobile, setShowAllMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Support both { data: [...] } and [...] shapes
  const categories: any[] = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-16 lg:py-20 overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-3xl hidden md:block mx-auto mb-8 md:mb-14">
        <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
          <LayoutGrid size={13} />
          Categories
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Categories
        </h2>
        <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Choose from our wide range of professional, verified home services
        </p>
      </div>

      <AnimatePresence mode="wait">
        {(!isMounted || isLoading) ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-16"
          >
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
          </motion.div>
        ) : isError ? (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-slate-400 text-sm py-8"
          >
            Unable to load categories right now. Please try again later.
          </motion.p>
        ) : categories.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-slate-400 text-sm py-8"
          >
            No categories found.
          </motion.p>
        ) : (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6"
          >
            {categories.map((cat: any, index: number) => {
              // EXACT name match only — no partial/dynamic matching
              const IconComponent = CATEGORY_ICON_MAP[cat.name?.trim()] || FALLBACK_ICON;

              const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || String(cat.id);

              const isNinthItem = index === 8;
              const isAfterNinthItem = index > 8;
              const isLastItem = index === categories.length - 1;

              return (
                <Fragment key={cat.id}>
                  {/* Category Card */}
                  <motion.div
                    variants={cardVariants}
                    whileTap={{ scale: 0.97 }}
                    className={`h-full ${(isNinthItem || isAfterNinthItem) && !showAllMobile ? "hidden md:block" : "block"}`}
                  >
                    <Link href={`/categories/${cat.id}`} className="block h-full">
                      <div
                        className="
                          group relative overflow-hidden
                          flex flex-col items-center justify-center
                          h-full rounded-2xl md:rounded-[28px] p-3 md:p-8
                          bg-gradient-to-br from-white to-[#e8eaed]
                          border border-white/80
                          cursor-pointer
                          category-card-blue-animated
                        "
                      >
                        {/* Gloss sheen */}
                        <span
                          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl md:rounded-t-[28px] bg-gradient-to-b from-white/65 to-transparent"
                          aria-hidden
                        />

                        {/* Icon orb */}
                        <div
                          className="
                            relative overflow-hidden
                            w-12 h-12 md:w-20 md:h-20 rounded-full mb-2 md:mb-4
                            flex items-center justify-center
                            bg-gradient-to-br from-[#fafbfc] via-[#f0f2f5] to-[#e3e6eb]
                            ring-1 ring-white/60
                            shadow-[4px_4px_10px_rgba(174,180,190,0.35),_-4px_-4px_10px_rgba(255,255,255,0.9)] md:shadow-[6px_6px_14px_rgba(174,180,190,0.45),_-6px_-6px_14px_rgba(255,255,255,0.95),inset_0_1px_1px_rgba(255,255,255,0.8)]
                            transition-all duration-500 ease-out
                            group-hover:scale-110
                            group-hover:from-[#ff8a5c] group-hover:via-[#ff6014] group-hover:to-[#e5392f]
                            group-hover:ring-[#ff6014]/30
                            group-hover:shadow-[0_10px_28px_-6px_rgba(229,57,53,0.55),0_0_0_6px_rgba(255,96,20,0.08)]
                          "
                        >
                          {/* Gloss sheen */}
                          <span
                            className="pointer-events-none absolute top-[3px] left-[5px] w-6 h-3 md:top-[6px] md:left-[10px] md:w-10 md:h-5 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.85)_0%,transparent_70%)] group-hover:opacity-80 transition-opacity duration-500"
                            aria-hidden
                          />
                          {/* Soft inner glow on hover */}
                          <span
                            className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.35),transparent_60%)] transition-opacity duration-500"
                            aria-hidden
                          />
                          {/* If category has an image, show it; else show manually-mapped icon */}
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="relative w-6 h-6 md:w-10 md:h-10 object-cover rounded-full drop-shadow-sm group-hover:brightness-0 group-hover:invert transition-all duration-500"
                            />
                          ) : (
                            <IconComponent
                              className="relative w-5 h-5 md:w-9 md:h-9 text-[#ff6014] drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:text-white group-hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                              strokeWidth={1.75}
                            />
                          )}
                        </div>

                        {/* Label */}
                        <span
                          className="font-semibold text-[10px] md:text-base text-center text-slate-700 mt-1 transition-colors duration-200 group-hover:text-primary line-clamp-2 min-h-[2.4em] md:min-h-[auto] flex items-center justify-center"
                        >
                          {cat.name}
                        </span>
                      </div>
                    </Link>
                  </motion.div>

                  {/* See More Card on Mobile */}
                  {isNinthItem && !showAllMobile && (
                    <motion.div
                      variants={cardVariants}
                      whileTap={{ scale: 0.97 }}
                      className="h-full block md:hidden"
                    >
                      <button
                        onClick={() => setShowAllMobile(true)}
                        className="w-full text-left block h-full focus:outline-none"
                      >
                        <div
                          className="
                            group relative overflow-hidden
                            flex flex-col items-center justify-center
                            h-full rounded-2xl p-3
                            bg-gradient-to-br from-white to-[#e8eaed]
                            border border-white/80
                            cursor-pointer
                            category-card-blue-animated
                          "
                        >
                          {/* Gloss sheen */}
                          <span
                            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/65 to-transparent"
                            aria-hidden
                          />

                          {/* Icon orb */}
                          <div
                            className="
                              relative overflow-hidden
                              w-12 h-12 rounded-full mb-2
                              flex items-center justify-center
                              bg-gradient-to-br from-[#fafbfc] via-[#f0f2f5] to-[#e3e6eb]
                              ring-1 ring-white/60
                              shadow-[4px_4px_10px_rgba(174,180,190,0.35),_-4px_-4px_10px_rgba(255,255,255,0.9)]
                              transition-all duration-500 ease-out
                              group-hover:scale-110
                              group-hover:from-[#ff8a5c] group-hover:via-[#ff6014] group-hover:to-[#e5392f]
                              group-hover:ring-[#ff6014]/30
                              group-hover:shadow-[0_10px_28px_-6px_rgba(229,57,53,0.55),0_0_0_6px_rgba(255,96,20,0.08)]
                            "
                          >
                            <span
                              className="pointer-events-none absolute top-[3px] left-[5px] w-6 h-3 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.85)_0%,transparent_70%)] group-hover:opacity-80 transition-opacity duration-500"
                              aria-hidden
                            />
                            <span
                              className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.35),transparent_60%)] transition-opacity duration-500"
                              aria-hidden
                            />
                            <LayoutGrid
                              className="relative w-5 h-5 text-[#ff6014] drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:text-white group-hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                              strokeWidth={1.75}
                            />
                          </div>

                          {/* Label */}
                          <span
                            className="font-semibold text-[10px] text-center text-[#ff6014] mt-1 transition-colors duration-200 group-hover:text-primary line-clamp-2 min-h-[2.4em] flex items-center justify-center"
                          >
                            See More
                          </span>
                        </div>
                      </button>
                    </motion.div>
                  )}

                  {/* See Less Card on Mobile */}
                  {isLastItem && showAllMobile && (
                    <motion.div
                      variants={cardVariants}
                      whileTap={{ scale: 0.97 }}
                      className="h-full block md:hidden"
                    >
                      <button
                        onClick={() => setShowAllMobile(false)}
                        className="w-full text-left block h-full focus:outline-none"
                      >
                        <div
                          className="
                            group relative overflow-hidden
                            flex flex-col items-center justify-center
                            h-full rounded-2xl p-3
                            bg-gradient-to-br from-white to-[#e8eaed]
                            border border-white/80
                            cursor-pointer
                            category-card-blue-animated
                          "
                        >
                          {/* Gloss sheen */}
                          <span
                            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/65 to-transparent"
                            aria-hidden
                          />

                          {/* Icon orb */}
                          <div
                            className="
                              relative overflow-hidden
                              w-12 h-12 rounded-full mb-2
                              flex items-center justify-center
                              bg-gradient-to-br from-[#fafbfc] via-[#f0f2f5] to-[#e3e6eb]
                              ring-1 ring-white/60
                              shadow-[4px_4px_10px_rgba(174,180,190,0.35),_-4px_-4px_10px_rgba(255,255,255,0.9)]
                              transition-all duration-500 ease-out
                              group-hover:scale-110
                              group-hover:from-[#ff8a5c] group-hover:via-[#ff6014] group-hover:to-[#e5392f]
                              group-hover:ring-[#ff6014]/30
                              group-hover:shadow-[0_10px_28px_-6px_rgba(229,57,53,0.55),0_0_0_6px_rgba(255,96,20,0.08)]
                            "
                          >
                            <span
                              className="pointer-events-none absolute top-[3px] left-[5px] w-6 h-3 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.85)_0%,transparent_70%)] group-hover:opacity-80 transition-opacity duration-500"
                              aria-hidden
                            />
                            <span
                              className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.35),transparent_60%)] transition-opacity duration-500"
                              aria-hidden
                            />
                            <LayoutGrid
                              className="relative w-5 h-5 text-[#ff6014] drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:text-white group-hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                              strokeWidth={1.75}
                            />
                          </div>

                          {/* Label */}
                          <span
                            className="font-semibold text-[10px] text-center text-[#ff6014] mt-1 transition-colors duration-200 group-hover:text-primary line-clamp-2 min-h-[2.4em] flex items-center justify-center"
                          >
                            See Less
                          </span>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </Fragment>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreCategories;