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
    <div className="relative w-full min-h-[240px] md:min-h-[66vh] lg:min-h-[70vh] flex items-center justify-center py-8 md:py-24">
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



      </motion.div>
    </div>
  );
};

export default Hero;