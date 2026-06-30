"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchPublicServicesQuery } from "@/redux/features/landing/landingApi";
import { useGetAllHeroesQuery } from "@/redux/features/admin/hero";

const HERO_CONTENT = {
  titleText: "Expert Home",
  accentTitleText: "Services,",
  subtitleText: "Simplified.",
  description: "Premium marketplace for all your household needs in Bangladesh.",
  bgImage: "/images/service/pre cleaning service-21.png",
  bgAlt: "Expert home services background",
  searchButtonText: "Search",
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: searchRes, isFetching: isSearching } = useSearchPublicServicesQuery(
    { q: searchQuery || undefined },
    { skip: !searchQuery }
  );

  const searchResults = searchRes?.data || [];

  const { data: apiHeroesRes } = useGetAllHeroesQuery();
  const heroes = apiHeroesRes?.data || (Array.isArray(apiHeroesRes) ? apiHeroesRes : []);

  const slides = heroes.length > 0
    ? heroes.flatMap((hero: any) => {
      const imgs = Array.isArray(hero.images)
        ? hero.images
        : typeof hero.images === 'string'
          ? hero.images.split(',').filter(Boolean)
          : [];
      return imgs.map((img: string) => ({
        image: img,
        hero: hero,
      }));
    })
    : [{ image: HERO_CONTENT.bgImage, hero: null }];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(0);
    }
  }, [slides.length, currentSlideIndex]);

  const activeSlide = slides[currentSlideIndex];
  const activeHero = activeSlide?.hero || heroes[0];
  const activeImage = activeSlide?.image;



  const { scrollY } = useScroll();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const searchOpacity = useTransform(scrollY, (y) => {
    if (isMobile) return 1;
    if (y <= 0) return 1;
    if (y >= 200) return 0;
    return 1 - y / 200;
  });
  const searchScale = useTransform(scrollY, (y) => {
    if (isMobile) return 1;
    if (y <= 0) return 1;
    if (y >= 200) return 0.85;
    return 1 - (y / 200) * 0.15;
  });
  const searchY = useTransform(scrollY, (y) => {
    if (isMobile) return 0;
    if (y <= 0) return 0;
    if (y >= 200) return -60;
    return -(y / 200) * 60;
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    const qs = params.toString();
    router.push(qs ? `/services?${qs}` : "/services");
  };

  return (
    <div className="relative w-full min-h-[300px] sm:min-h-[60vh] md:min-h-[66vh] lg:min-h-[70vh] flex items-center justify-center py-8 md:py-24">
      <div className="absolute inset-0 z-0 bg-[#FFF8F4] overflow-hidden">
        {/* Sliding images background */}
        {slides.length > 0 && activeImage && (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.img
                key={currentSlideIndex}
                src={activeImage}
                alt="Hero Slide Background"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", ease: "easeInOut", duration: 1.0 }}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            </AnimatePresence>
          </div>
        )}




      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 text-center"
      >
        {/* Desktop View: Title & Subtitle */}
        <div className="hidden md:block">
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight md:leading-[1.15] mb-4 sm:mb-5"
          >
            {HERO_CONTENT.titleText}{" "}
            <span className="text-[#FF6014]">{HERO_CONTENT.accentTitleText}</span>
            <br />
            {HERO_CONTENT.subtitleText}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-[#FF6014] font-bold max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 leading-relaxed"
          >
            {HERO_CONTENT.description}
          </motion.p>
        </div>

        {/* Mobile View: API-provided text and CTA button */}
        <div className="md:hidden flex flex-col items-center gap-3 px-4 mb-6 text-center">
          <motion.h1
            variants={itemVariants}
            className="text-xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
          >
            {activeHero?.text || "Expert Home Services, Simplified."}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xs text-white/90 font-bold leading-relaxed drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)] max-w-[280px]"
          >
            {activeHero?.subtext || "Premium marketplace for all your household needs in Bangladesh."}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-1">
            <Link
              href={activeHero?.link || "/services"}
              className="inline-flex items-center justify-center bg-[#FF6014] hover:bg-[#E0530A] text-white py-2 px-6 rounded-full font-bold text-xs transition-all shadow-md active:scale-95"
            >
              Book Now
            </Link>
          </motion.div>
        </div>

        {/* Search Bar - Desktop Only */}
        <div className="hidden md:block relative w-full max-w-2xl mx-auto mb-10" ref={dropdownRef}>
          <motion.form
            variants={itemVariants}
            style={{
              opacity: searchOpacity,
              scale: searchScale,
              y: searchY,
            }}
            onSubmit={handleSearch}
            className="w-full bg-[#FF6014]/5 rounded-2xl md:rounded-full shadow-[0_10px_30px_rgba(255,96,20,0.04)] border border-[#FF6014]/10 p-2 sm:p-3 flex items-center"
          >
            <div className="flex items-center gap-3 flex-1 w-full px-4 py-2 relative">
              <Search className="text-[#FF6014] w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full border-none bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400 focus:ring-0"
              />
            </div>

            {/* Round Search Button */}
            <button
              type="submit"
              onClick={() => handleSearch()}
              className="bg-[#FF6014] hover:bg-[#FF5000] text-white rounded-full p-3 sm:p-4 flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex-shrink-0"
            >
              <Search className="w-5 h-5" />
            </button>
          </motion.form>

          {/* Search Results Dropdown */}
          {showResults && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-[#FFFDFB] rounded-2xl shadow-xl border border-[#FF6014]/20 overflow-hidden z-50 max-h-[400px] overflow-y-auto text-left">
              {isSearching ? (
                <div className="p-8 flex justify-center items-center">
                  <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="flex flex-col">
                  {searchResults.map((service: any) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.id}`}
                      onClick={() => setShowResults(false)}
                      className="group flex items-center gap-4 p-4 hover:bg-[#FF6014]/5 transition-all border-b border-[#FF6014]/10 last:border-0"
                    >
                      <div className="w-12 h-12 bg-[#FF6014]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                        <Search className="w-6 h-6 text-[#FF6014]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm md:text-base group-hover:text-[#FF6014] transition-colors duration-200">
                          {service.name}
                        </h4>
                        <p className="text-xs md:text-sm text-slate-500 font-medium">
                          {service.category?.name || 'Service'} • {service.price ? `৳${service.price}` : 'Price varies'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-[#FF6014]/80 font-bold">No services found.</p>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trust Badges - Desktop Only */}
        <motion.div
          variants={itemVariants}
          className="hidden md:grid lg:flex items-center justify-center gap-2.5 sm:gap-6 md:gap-8 mt-8 sm:mt-10 text-slate-500 font-semibold text-[10px] sm:text-xs md:text-sm w-full max-w-sm lg:max-w-none mx-auto"
        >
          <div className="flex items-center gap-2 bg-[#FF6014]/5 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#FF6014]/15 shadow-xs justify-center w-full lg:w-auto transition-all duration-200 hover:bg-[#FF6014]/10 hover:border-[#FF6014]/30">
            <span className="text-[#FF6014] text-xs sm:text-sm">★</span>
            <span className="text-slate-600">
              <strong className="text-[#FF6014] font-extrabold">4.9/5 Rating</strong> (20k+ Reviews)
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#FF6014]/5 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#FF6014]/15 shadow-xs justify-center w-full lg:w-auto transition-all duration-200 hover:bg-[#FF6014]/10 hover:border-[#FF6014]/30">
            <span className="text-[#FF6014] text-xs sm:text-sm">⚡</span>
            <span className="text-slate-600">
              <strong className="text-[#FF6014] font-extrabold">30 Min</strong> Express Response
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#FF6014]/5 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#FF6014]/15 shadow-xs justify-center w-full col-span-2 lg:col-span-1 lg:w-auto transition-all duration-200 hover:bg-[#FF6014]/10 hover:border-[#FF6014]/30">
            <span className="text-[#FF6014] text-xs sm:text-sm">🛡️</span>
            <span className="text-slate-600">
              <strong className="text-[#FF6014] font-extrabold">100%</strong> Satisfaction Insured
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;