"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, MapPin, Calendar } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { CustomCalendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/select";

// Clean Data Architecture - Configurable Dynamic Copy
const HERO_CONTENT = {
  titleText: "Expert Home",
  accentTitleText: "Services,",
  subtitleText: "Simplified.",
  description: "Premium marketplace for all your household needs in Bangladesh.",
  bgImage: "/images/service/pre cleaning service-21.png",
  bgAlt: "Expert home services background",
  searchPlaceholder: "What service do you need today?",
  categories: [
    { label: "AC Repair", slug: "ac-repair" },
    { label: "Plumbing", slug: "plumbing" },
    { label: "Cleaning", slug: "cleaning" },
    { label: "Electrical", slug: "electrical" },
    { label: "Shifting", slug: "shifting" },
    { label: "CCTV", slug: "cctv" },
    { label: "Appliance Repair", slug: "appliance-repair" },
    { label: "Painting", slug: "painting" },
    { label: "Gardening", slug: "gardening" },
    { label: "Pest Control", slug: "pest-control" },
    { label: "Home Salon", slug: "home-salon" },
    { label: "Carpentry", slug: "carpentry" },
  ],
  searchButtonText: "Book Now",
};

// 9uhwer9ugher89hg98

const categoryOptions = HERO_CONTENT.categories.map((cat) => ({
  value: cat.slug,
  label: cat.label,
}));

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
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Visual scroll-driven handoff to the header search bar (only active on desktop)
  const searchOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const searchScale = useTransform(scrollY, [0, 200], [1, 0.85]);
  const searchY = useTransform(scrollY, [0, 200], [0, -60]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      let url = `/categories/${selectedCategory}`;
      const params = [];
      if (location) params.push(`location=${encodeURIComponent(location)}`);
      if (selectedDate) params.push(`date=${selectedDate.format("YYYY-MM-DD")}`);
      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }
      router.push(url);
    } else {
      router.push("/categories/ac-repair");
    }
  };

  return (
    <div
      className="relative w-full min-h-0 sm:min-h-[60vh] md:min-h-[66vh] lg:min-h-[70vh] flex items-center justify-center py-10 md:py-24"
    >
      {/* Background Container */}
      <div className="absolute inset-0 z-0 bg-[#FFF8F7] overflow-hidden">
        {/* Left Side Icons Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full md:w-[45%] h-[85%] opacity-35 md:opacity-[0.85] pointer-events-none select-none">
          <Image
            src="/bg-icons-design.png"
            alt="Service Icons"
            fill
            className="object-cover object-left"
            priority
          />
        </div>

        {/* Right Side Cleaner Background */}
        <div className="absolute right-0 bottom-0 top-0 w-full md:w-[50%] opacity-25 md:opacity-[0.9] pointer-events-none select-none">
          <Image
            src="/images/service/pre cleaning service-21.png"
            alt="Cleaner Professional"
            fill
            className="object-cover object-center md:object-contain md:object-right-bottom"
            priority
          />
        </div>

        {/* Soft light glassmorphism overlay for text legibility (slightly stronger on mobile) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/55 sm:from-white/40 via-white/70 sm:via-white/55 to-background backdrop-blur-[1.5px] sm:backdrop-blur-[1px] md:hidden" />
        {/* Desktop-only subtle overlay to blend the two sides and ensure text legibility */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#FFF8F7]/60 via-[#FFF8F7]/40 to-transparent pointer-events-none" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
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
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight md:leading-[1.15] mb-4 sm:mb-5"
        >
          {HERO_CONTENT.titleText}{" "}
          <span className="text-[#FF7C71]">{HERO_CONTENT.accentTitleText}</span>
          <br />
          {HERO_CONTENT.subtitleText}
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg text-[#FF7C71] font-bold max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 leading-relaxed"
        >
          {HERO_CONTENT.description}
        </motion.p>

        {/* Animated Floating Search Bar Card with Handoff Scroll Control */}
        <motion.form
          variants={itemVariants}
          style={isMobile ? {} : {
            opacity: searchOpacity,
            scale: searchScale,
            y: searchY,
          }}
          onSubmit={handleSearch}
          className="w-full max-w-3xl mx-auto bg-white rounded-2xl md:rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-2 sm:p-3 flex flex-col md:flex-row items-center gap-2.5 sm:gap-3 md:gap-0"
        >
          {/* Category Dropdown Select */}
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

          {/* Location Text Input */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 w-full px-3 sm:px-4 py-1.5 sm:py-2 md:py-1">
            <MapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full py-1.5"
            />
          </div>

          {/* Vertical Separator */}
          <div className="hidden md:block h-8 w-px bg-slate-200" />

          {/* Date Picker Popover Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 w-full px-3 sm:px-4 py-1.5 sm:py-2 md:py-1 relative">
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2.5 sm:gap-3 w-full py-1.5 cursor-pointer"
            >
              <Calendar className="text-slate-400 w-5 h-5 flex-shrink-0" />
              <span className="text-sm text-slate-700 select-none">
                {selectedDate ? selectedDate.format("DD MMM, YYYY") : "Select Date"}
              </span>
            </div>

            {showCalendar && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCalendar(false)}
                />
                <div className="absolute top-full left-0 md:left-auto md:right-0 mt-3 z-50 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 max-w-[340px]">
                  <CustomCalendar
                    staticInline={true}
                    value={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setShowCalendar(false);
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Book Now Action Button */}
          <Button
            type="submit"
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-extrabold px-6 sm:px-8 py-3.5 h-auto rounded-xl md:rounded-full transition-all duration-200 shadow-sm active:scale-95 text-sm sm:text-base flex-shrink-0 cursor-pointer"
          >
            {HERO_CONTENT.searchButtonText}
          </Button>
        </motion.form>

        {/* Trust Badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-6 md:gap-8 mt-8 sm:mt-10 text-slate-500 font-semibold text-[10px] sm:text-xs md:text-sm w-full max-w-sm sm:max-w-none mx-auto"
        >
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200/40 shadow-xs w-full sm:w-auto justify-center">
            <span className="text-[#FF7C71] text-xs sm:text-sm">★</span>
            <span><strong className="text-slate-800 font-extrabold">4.9/5 Rating</strong> (20k+ Reviews)</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200/40 shadow-xs w-full sm:w-auto justify-center">
            <span className="text-[#FF7C71] text-xs sm:text-sm">⚡</span>
            <span><strong className="text-slate-800 font-extrabold">30 Min</strong> Express Response</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200/40 shadow-xs w-full sm:w-auto justify-center">
            <span className="text-[#FF7C71] text-xs sm:text-sm">🛡️</span>
            <span><strong className="text-slate-800 font-extrabold">100%</strong> Satisfaction Insured</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;