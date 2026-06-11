"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

// Clean Data Architecture - Configurable Dynamic Copy
const HERO_CONTENT = {
  title: "Expert Services,",
  accentTitle: "Right at Your Doorstep",
  description: "Find the best professionals for AC repair, plumbing, cleaning, and more in just a few clicks. Verified experts and transparent pricing.",
  bgImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2000&auto=format&fit=crop",
  bgAlt: "Expert home services background",
  searchPlaceholder: "What service do you need today?",
  locations: [
    { value: "", label: "Select Location" },
    { value: "dhaka", label: "Dhaka" },
    { value: "mirpur", label: "Mirpur, Dhaka" },
    { value: "banani", label: "Banani, Dhaka" },
    { value: "chittagong", label: "Chittagong" },
    { value: "sylhet", label: "Sylhet" },
  ],
  searchButtonText: "Search",
};

// Title entrance variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18,
    },
  },
} as const;

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const { scrollY } = useScroll();

  // Visual scroll-driven handoff to the header search bar
  const searchOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const searchScale = useTransform(scrollY, [0, 200], [1, 0.85]);
  const searchY = useTransform(scrollY, [0, 200], [0, -60]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery, "in location:", location);
  };

  return (
    <div
      className="relative w-full min-h-[60vh] md:min-h-[66vh] lg:min-h-[70vh] flex items-center justify-center overflow-hidden py-16 md:py-24"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_CONTENT.bgImage}
          alt={HERO_CONTENT.bgAlt}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Soft light glassmorphism overlay for text legibility */}
        <div className="absolute inset-0 bg-white/80 md:bg-white/75 backdrop-blur-[1.5px]" />
      </div>

      {/* Hero Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 text-center"
      >
        {/* Centered Animated Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight md:leading-[1.15] mb-4"
        >
          {HERO_CONTENT.title}
          <br />
          <span className="text-[#FF5A5F]">{HERO_CONTENT.accentTitle}</span>
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed"
        >
          {HERO_CONTENT.description}
        </motion.p>

        {/* Animated Floating Search Bar Card with Handoff Scroll Control */}
        <motion.form
          variants={itemVariants}
          style={{
            opacity: searchOpacity,
            scale: searchScale,
            y: searchY,
          }}
          onSubmit={handleSearch}
          className="w-full max-w-3xl mx-auto bg-white rounded-2xl md:rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-3 flex flex-col md:flex-row items-center gap-3 md:gap-0"
        >
          {/* Service Search Input */}
          <div className="flex items-center gap-3 flex-1 w-full px-4 py-2 md:py-1">
            <Search className="text-slate-400 w-5 h-5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={HERO_CONTENT.searchPlaceholder}
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full py-1.5"
            />
          </div>

          {/* Vertical Separator */}
          <div className="hidden md:block h-8 w-px bg-slate-200" />

          {/* Location Selector Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-56 px-4 py-2 md:py-1">
            <MapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-sm text-slate-700 outline-none w-full py-1.5 cursor-pointer appearance-none"
            >
              {HERO_CONTENT.locations.map((loc, i) => (
                <option
                  key={i}
                  value={loc.value}
                  className={
                    loc.value === "" ? "text-slate-400" : "text-slate-700"
                  }
                >
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Action Button */}
          <button
            type="submit"
            className="w-full md:w-auto bg-[#FF5A5F] hover:bg-[#FF4449] text-white font-bold px-8 py-3.5 rounded-xl md:rounded-full transition-all duration-200 shadow-sm active:scale-95 text-base flex-shrink-0 cursor-pointer"
          >
            {HERO_CONTENT.searchButtonText}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Hero;