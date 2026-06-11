"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

// Clean Data Architecture - Dynamic reviews and client testimonies
const TESTIMONIALS_CONTENT = {
  title: "Real Happy Customers, Real Stories",
  subtitle: "Read reviews from families and businesses who trust our experts daily",
  testimonials: [
    {
      name: "Rahim Ahmed",
      location: "Gulshan, Dhaka",
      rating: 5,
      text: '"The AC technician was professional, polite, and fixed my unit in under an hour. Very satisfied with the quick service!"',
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      glowColor: "from-cyan-400 to-blue-500",
    },
    {
      name: "Sharmin R.",
      location: "Banani, Dhaka",
      rating: 5,
      text: '"Painting my apartment was seamless. The team was punctual, handled furniture carefully, and did an amazing job."',
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      glowColor: "from-rose-400 to-orange-400",
    },
    {
      name: "Kazi Farhan",
      location: "Uttara, Dhaka",
      rating: 5,
      text: '"Best cleaning service I\'ve ever used. My home has never looked cleaner. Highly recommended for busy professionals!"',
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      glowColor: "from-emerald-400 to-teal-500",
    }
  ]
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 250 : -250,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 250 : -250,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.25
    }
  })
} as const;

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_CONTENT.testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoplay]);

  const handleNext = () => {
    setAutoplay(false);
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_CONTENT.testimonials.length);
  };

  const handlePrev = () => {
    setAutoplay(false);
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS_CONTENT.testimonials.length) % TESTIMONIALS_CONTENT.testimonials.length);
  };

  const current = TESTIMONIALS_CONTENT.testimonials[activeIndex];

  return (
    <div className="bg-slate-50/50 py-20 lg:py-24 overflow-hidden relative">
      {/* Decorative gradient background glows that fade out */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-slate-200/30 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {TESTIMONIALS_CONTENT.title}
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
            {TESTIMONIALS_CONTENT.subtitle}
          </p>
        </div>

        {/* Carousel Slider Card Wrapper */}
        <div className="relative max-w-2xl mx-auto min-h-[360px] md:min-h-[320px] flex items-center justify-center px-4">
          
          {/* Shifting background color glow behind card (fading color design) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className={`w-80 h-80 bg-gradient-to-r ${current.glowColor} opacity-10 blur-[80px] rounded-full transition-all duration-700`} />
          </div>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between w-full z-10 relative"
            >
              <div>
                {/* SVG Star rating */}
                <div className="flex gap-1 mb-6 text-[#FF5A5F]">
                  {[...Array(current.rating)].map((_, starIdx) => (
                    <Star key={starIdx} className="w-5 h-5 fill-[#FF5A5F]" />
                  ))}
                </div>
                
                <p className="text-slate-700 italic leading-relaxed text-base md:text-lg mb-8 font-medium">
                  {current.text}
                </p>
              </div>
              
              {/* Customer Avatar & Location metadata */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <div className="relative w-12 h-12 bg-slate-100 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                  <Image
                    src={current.avatar}
                    alt={current.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm md:text-base">
                    {current.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-bold tracking-wide">
                    {current.location}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Carousel Navigation Buttons & Indicators */}
        <div className="flex flex-col items-center gap-6 mt-8 md:mt-12">
          {/* Arrow Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:border-[#FF5A5F] hover:text-[#FF5A5F] flex items-center justify-center text-slate-500 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95 z-20"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:border-[#FF5A5F] hover:text-[#FF5A5F] flex items-center justify-center text-slate-500 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95 z-20"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2.5">
            {TESTIMONIALS_CONTENT.testimonials.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => {
                  setAutoplay(false);
                  setDirection(dotIdx > activeIndex ? 1 : -1);
                  setActiveIndex(dotIdx);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  dotIdx === activeIndex ? "w-7 bg-[#FF5A5F]" : "w-2.5 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Testimonials;
