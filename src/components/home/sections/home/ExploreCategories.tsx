"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TbAirConditioning, TbTruck, TbScissors } from "react-icons/tb";
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
import { Button } from "@/components/ui/button";

const CATEGORIES_CONTENT = {
  title: "Explore Categories",
  categories: [
    { label: "AC Repair", slug: "ac-repair", icon: TbAirConditioning },
    { label: "Plumbing", slug: "plumbing", icon: FaFaucet },
    { label: "Cleaning", slug: "cleaning", icon: MdOutlineCleaningServices },
    { label: "Electrical", slug: "electrical", icon: FaBolt },
    { label: "Shifting", slug: "shifting", icon: TbTruck },
    { label: "CCTV", slug: "cctv", icon: MdOutlineSecurity },
    { label: "Appliance Repair", slug: "appliance-repair", icon: FaTv },
    { label: "Painting", slug: "painting", icon: FaPaintRoller },
    { label: "Gardening", slug: "gardening", icon: FaLeaf },
    { label: "Pest Control", slug: "pest-control", icon: FaBug },
    { label: "Home Salon", slug: "home-salon", icon: TbScissors },
    { label: "Carpentry", slug: "carpentry", icon: FaHammer },
  ],
};

const VISIBLE_COUNT = 8;

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 14 },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.96,
    transition: { duration: 0.18, ease: "easeIn" },
  },
} as const;

const ExploreCategories = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedCategories = showAll
    ? CATEGORIES_CONTENT.categories
    : CATEGORIES_CONTENT.categories.slice(0, VISIBLE_COUNT);

  const hasMore = CATEGORIES_CONTENT.categories.length > VISIBLE_COUNT;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-wide">
          {CATEGORIES_CONTENT.title}
        </h2>

        {hasMore && (
          <Button
            variant="outline"
            onClick={() => setShowAll((prev) => !prev)}
            className="
              bg-white hover:bg-[#FFF0F1] hover:text-[#FF5A5F]
              text-slate-700 font-semibold px-5 py-2 h-auto rounded-xl
              transition-all duration-200 cursor-pointer active:scale-95
              shadow-[0_2px_8px_rgba(0,0,0,0.06)]
              border border-slate-200
              text-xs md:text-sm
            "
          >
            {showAll ? "Show Less" : "View All"}
          </Button>
        )}
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {displayedCategories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={cat.slug}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -8, scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
                layout
              >
                <Link href={`/categories/${cat.slug}`} className="block h-full">
                  {/*
                   * Card shell — neumorphic raised effect.
                   * Requires a mid-tone background on the parent page (not white)
                   * for the shadow contrast to read correctly.
                   */}
                  <div
                    className="
                      group relative overflow-hidden
                      flex flex-col items-center justify-center
                      h-full rounded-[28px] p-6 md:p-8
                      bg-gradient-to-br from-white to-[#e8eaed]
                      border border-white/80
                      cursor-pointer
                      transition-all duration-300
                      shadow-[8px_8px_20px_rgba(174,180,190,0.55),_-6px_-6px_16px_rgba(255,255,255,0.95)]
                      hover:shadow-[12px_18px_30px_rgba(150,158,170,0.45),_-6px_-6px_18px_rgba(255,255,255,1)]
                    "
                  >
                    {/* Gloss sheen — top-half highlight */}
                    <span
                      className="
                        pointer-events-none absolute inset-x-0 top-0
                        h-1/2 rounded-t-[28px]
                        bg-gradient-to-b from-white/65 to-transparent
                      "
                      aria-hidden
                    />

                    {/* Icon orb */}
                    <div
                      className="
                        relative overflow-hidden
                        w-20 h-20 rounded-full mb-4
                        flex items-center justify-center
                        bg-gradient-to-br from-[#f5f7fa] to-[#e8eaed]
                        shadow-[4px_4px_10px_rgba(174,180,190,0.5),_-4px_-4px_10px_rgba(255,255,255,1)]
                        transition-all duration-300
                        group-hover:from-[#ff6b6b] group-hover:to-[#e53935]
                        group-hover:shadow-[4px_4px_14px_rgba(229,57,53,0.35),_-3px_-3px_10px_rgba(255,200,200,0.6)]
                      "
                    >
                      {/* Orb inner gloss */}
                      <span
                        className="
                          pointer-events-none absolute
                          top-[6px] left-[10px]
                          w-10 h-5 rounded-full
                          bg-[radial-gradient(ellipse,rgba(255,255,255,0.75)_0%,transparent_70%)]
                        "
                        aria-hidden
                      />
                      <IconComponent
                        className="
                          w-7 h-7 md:w-8 md:h-8
                          text-primary
                          transition-colors duration-300
                          group-hover:text-white
                        "
                      />
                    </div>

                    {/* Label */}
                    <span
                      className="
                        font-semibold text-sm md:text-base text-center
                        text-slate-700 mt-1
                        transition-colors duration-200
                        group-hover:text-primary
                      "
                    >
                      {cat.label}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ExploreCategories;
