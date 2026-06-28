"use client";

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
import { LayoutGrid, Loader2 } from "lucide-react";
import { useGetPublicCategoriesQuery } from "@/redux/features/landing/landingApi";

// ─── Named export kept for Navbar.tsx dropdown ───────────────────────────────
export const CATEGORIES_CONTENT = {
  title: "Explore Categories",
  subtitle: "Choose from our wide range of professional, verified home services",
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

// Icon map: category name → icon (fallback for categories without images)
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "AC Repair": TbAirConditioning,
  "AC": TbAirConditioning,
  "Plumbing": FaFaucet,
  "Cleaning": MdOutlineCleaningServices,
  "Electrical": FaBolt,
  "Shifting": TbTruck,
  "CCTV": MdOutlineSecurity,
  "Security": MdOutlineSecurity,
  "Appliance Repair": FaTv,
  "Appliance": FaTv,
  "Painting": FaPaintRoller,
  "Gardening": FaLeaf,
  "Pest Control": FaBug,
  "Salon": TbScissors,
  "Home Salon": TbScissors,
  "Carpentry": FaHammer,
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

  // Support both { data: [...] } and [...] shapes
  const categories: any[] = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-16 lg:py-20 overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
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

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
        </div>
      )}

      {/* Error fallback */}
      {isError && (
        <p className="text-center text-slate-400 text-sm py-8">
          Unable to load categories right now. Please try again later.
        </p>
      )}

      {/* Grid — real data */}
      {!isLoading && !isError && categories.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 md:gap-6"
        >
          {categories.map((cat: any) => {
            // Try to find icon by name, otherwise use fallback
            const IconComponent =
              CATEGORY_ICON_MAP[cat.name] ||
              CATEGORY_ICON_MAP[Object.keys(CATEGORY_ICON_MAP).find((k) =>
                cat.name?.toLowerCase().includes(k.toLowerCase())
              ) || ""] ||
              FALLBACK_ICON;

            const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || String(cat.id);

            return (
              <motion.div
                key={cat.id}
                variants={cardVariants}
                whileTap={{ scale: 0.97 }}
                className="h-full"
              >
                <Link href={`/categories/${cat.id}`} className="block h-full">
                  <div
                    className="
                      group relative overflow-hidden
                      flex flex-col items-center justify-center
                      h-full rounded-[28px] p-6 md:p-8
                      bg-gradient-to-br from-white to-[#e8eaed]
                      border border-white/80
                      cursor-pointer
                      hover-card-premium
                    "
                  >
                    {/* Gloss sheen */}
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[28px] bg-gradient-to-b from-white/65 to-transparent"
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
                      <span
                        className="pointer-events-none absolute top-[6px] left-[10px] w-10 h-5 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.75)_0%,transparent_70%)]"
                        aria-hidden
                      />
                      {/* If category has an image, show it; else show icon */}
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-10 h-10 object-cover rounded-full group-hover:brightness-0 group-hover:invert transition-all"
                        />
                      ) : (
                        <IconComponent
                          className="w-7 h-7 md:w-8 md:h-8 text-primary transition-colors duration-300 group-hover:text-white"
                        />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className="font-semibold text-sm md:text-base text-center text-slate-700 mt-1 transition-colors duration-200 group-hover:text-primary"
                    >
                      {cat.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && categories.length === 0 && (
        <p className="text-center text-slate-400 text-sm py-8">No categories found.</p>
      )}
    </div>
  );
};

export default ExploreCategories;
