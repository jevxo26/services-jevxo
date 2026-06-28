"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/select";
import { useGetPublicCategoriesQuery } from "@/redux/features/landing/landingApi";
import { useGetAllDevisionsQuery } from "@/redux/features/admin/location";

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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const { data: categoriesRes } = useGetPublicCategoriesQuery();
  const { data: divisionsRes } = useGetAllDevisionsQuery();

  const categoryOptions = useMemo(() => {
    const categories = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);
    return categories
      .filter((cat: { parent?: unknown }) => !cat.parent)
      .map((cat: { id: number; name: string }) => ({
        value: String(cat.id),
        label: cat.name,
      }));
  }, [categoriesRes]);

  const divisionOptions = useMemo(() => {
    const divisions = divisionsRes?.data || [];
    return divisions.map((div: { id: number; name: string }) => ({
      value: String(div.id),
      label: div.name,
    }));
  }, [divisionsRes]);

  const { scrollY } = useScroll();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedDivision) params.set("devision", selectedDivision);
    const qs = params.toString();
    router.push(qs ? `/services?${qs}` : "/services");
  };

  return (
    <div
      className="relative w-full min-h-0 sm:min-h-[60vh] md:min-h-[66vh] lg:min-h-[70vh] flex items-center justify-center py-10 md:py-24"
    >
      <div className="absolute inset-0 z-0 bg-[#FFF8F4] overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-15 md:opacity-20 pointer-events-none select-none">
          <Image
            src="/bg-icons-design.png"
            alt="Service Icons Background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-white/55 sm:from-white/40 via-white/70 sm:via-white/55 to-background backdrop-blur-[1.5px] sm:backdrop-blur-[1px] md:hidden" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#FFF8F4]/60 via-[#FFF8F4]/40 to-transparent pointer-events-none" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 text-center"
      >
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

        <motion.form
          variants={itemVariants}
          style={{
            opacity: searchOpacity,
            scale: searchScale,
            y: searchY,
          }}
          onSubmit={handleSearch}
          className="w-full max-w-3xl mx-auto bg-white rounded-2xl md:rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-2 sm:p-3 flex flex-col md:flex-row items-center gap-2.5 sm:gap-3 md:gap-0"
        >
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

          <div className="hidden md:block h-8 w-px bg-slate-200" />

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

          <Button
            type="submit"
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-extrabold px-6 sm:px-8 py-3.5 h-auto rounded-xl md:rounded-full transition-all duration-200 shadow-sm active:scale-95 text-sm sm:text-base flex-shrink-0 cursor-pointer"
          >
            {HERO_CONTENT.searchButtonText}
          </Button>
        </motion.form>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 lg:flex items-center justify-center gap-2.5 sm:gap-6 md:gap-8 mt-8 sm:mt-10 text-slate-500 font-semibold text-[10px] sm:text-xs md:text-sm w-full max-w-sm lg:max-w-none mx-auto"
        >
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200/40 shadow-xs justify-center w-full lg:w-auto">
            <span className="text-[#FF6014] text-xs sm:text-sm">★</span>
            <span>
              <strong className="text-slate-800 font-extrabold">
                4.9/5 Rating
              </strong>{" "}
              (20k+ Reviews)
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200/40 shadow-xs justify-center w-full lg:w-auto">
            <span className="text-[#FF6014] text-xs sm:text-sm">⚡</span>
            <span>
              <strong className="text-slate-800 font-extrabold">
                30 Min
              </strong>{" "}
              Express Response
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200/40 shadow-xs justify-center w-full col-span-2 lg:col-span-1 lg:w-auto">
            <span className="text-[#FF6014] text-xs sm:text-sm">🛡️</span>
            <span>
              <strong className="text-slate-800 font-extrabold">
                100%
              </strong>{" "}
              Satisfaction Insured
            </span>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Hero;
