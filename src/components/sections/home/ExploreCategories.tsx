"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  TbAirConditioning,
  TbTruck,
  TbScissors
} from "react-icons/tb";
import { 
  FaFaucet, 
  FaBolt, 
  FaTv, 
  FaPaintRoller, 
  FaLeaf, 
  FaBug, 
  FaHammer 
} from "react-icons/fa";
import { 
  MdOutlineCleaningServices, 
  MdOutlineSecurity 
} from "react-icons/md";

// Clean Data Architecture - Dynamic categories configurations
const CATEGORIES_CONTENT = {
  title: "Explore Categories",
  subtitle: "Find professional services tailored to your household needs",
  categories: [
    { label: "AC Repair", slug: "ac-repair", icon: TbAirConditioning, bg: "bg-cyan-50 text-cyan-600 hover:border-cyan-200" },
    { label: "Plumbing", slug: "plumbing", icon: FaFaucet, bg: "bg-sky-50 text-sky-600 hover:border-sky-200" },
    { label: "Cleaning", slug: "cleaning", icon: MdOutlineCleaningServices, bg: "bg-emerald-50 text-emerald-600 hover:border-emerald-200" },
    { label: "Electrical", slug: "electrical", icon: FaBolt, bg: "bg-amber-50 text-amber-600 hover:border-amber-200" },
    { label: "Shifting", slug: "shifting", icon: TbTruck, bg: "bg-purple-50 text-purple-600 hover:border-purple-200" },
    { label: "CCTV", slug: "cctv", icon: MdOutlineSecurity, bg: "bg-rose-50 text-rose-600 hover:border-rose-200" },
    { label: "Appliance Repair", slug: "appliance-repair", icon: FaTv, bg: "bg-indigo-50 text-indigo-600 hover:border-indigo-200" },
    { label: "Painting", slug: "painting", icon: FaPaintRoller, bg: "bg-orange-50 text-orange-600 hover:border-orange-200" },
    { label: "Gardening", slug: "gardening", icon: FaLeaf, bg: "bg-green-50 text-green-600 hover:border-green-200" },
    { label: "Pest Control", slug: "pest-control", icon: FaBug, bg: "bg-red-50 text-red-600 hover:border-red-200" },
    { label: "Home Salon", slug: "home-salon", icon: TbScissors, bg: "bg-fuchsia-50 text-fuchsia-600 hover:border-fuchsia-200" },
    { label: "Carpentry", slug: "carpentry", icon: FaHammer, bg: "bg-stone-50 text-stone-600 hover:border-stone-200" },
  ]
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 14
    }
  }
} as const;

const ExploreCategories = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 lg:py-24 overflow-hidden">
      {/* Title block */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          {CATEGORIES_CONTENT.title}
        </h2>
        <p className="text-sm md:text-base text-slate-500 max-w-md mx-auto">
          {CATEGORIES_CONTENT.subtitle}
        </p>
      </div>

      {/* Grid of items */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        {CATEGORIES_CONTENT.categories.map((cat, i) => {
          const IconComponent = cat.icon;
          return (
            <Link key={i} href={`/categories/${cat.slug}`} className="block">
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group bg-white border border-slate-100 hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.04)] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer h-full`}
              >
                <div className={`p-4 rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110 ${cat.bg}`}>
                  <IconComponent className="w-8 h-8 md:w-9 md:h-9" />
                </div>
                <div className="font-semibold text-slate-800 text-sm md:text-base text-center group-hover:text-[#FF5A5F] transition-colors">
                  {cat.label}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ExploreCategories;
