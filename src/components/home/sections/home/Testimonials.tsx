"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Expanded mock reviews (10 total)
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
    },
    {
      name: "Sharmin R.",
      location: "Banani, Dhaka",
      rating: 5,
      text: '"Painting my apartment was seamless. The team was punctual, handled furniture carefully, and did an amazing job."',
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Kazi Farhan",
      location: "Uttara, Dhaka",
      rating: 5,
      text: '"Best cleaning service I\'ve ever used. My home has never looked cleaner. Highly recommended for busy professionals!"',
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Tasnim Jahan",
      location: "Dhanmondi, Dhaka",
      rating: 5,
      text: '"Very satisfied with the plumbing repair. They diagnosed the leak quickly and fixed it at a very reasonable price."',
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Adnan Chowdhury",
      location: "Mirpur, Dhaka",
      rating: 5,
      text: '"Courteous electricians who fixed my wiring issues professionally. They even cleaned up after completing the service."',
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Sabrina Yasmin",
      location: "Dhanmondi, Dhaka",
      rating: 5,
      text: '"I booked a deep cleaning service and they exceeded expectations. Spotless corners, clean smell, and great team work!"',
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Imtiaz Hossain",
      location: "Mirpur, Dhaka",
      rating: 5,
      text: '"AC was leaking and not cooling. The technician found the root cause instantly and resolved it. Reliable and transparent!"',
      avatar: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Nusrat Jahan",
      location: "Banani, Dhaka",
      rating: 5,
      text: '"Very efficient shifting service! They packed all fragile items safely and transported them without a single scratch."',
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Farhan Malik",
      location: "Gulshan, Dhaka",
      rating: 5,
      text: '"Had a persistent pest problem. Their control treatment was highly effective. Haven\'t seen any pests in weeks now."',
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Mehnaz Chowdhury",
      location: "Uttara, Dhaka",
      rating: 5,
      text: '"The salon service was so relaxing. Professional beautician, followed proper hygiene rules. Wonderful experience at home!"',
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
    }
  ]
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1024);

  // Resize listener to adapt cards per view dynamically
  useEffect(() => {
    if (typeof window === "undefined") return;
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const testimonials = TESTIMONIALS_CONTENT.testimonials;
  const N = testimonials.length;

  // Determine cards to show based on width
  const cardsToShow = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3;
  const maxIndex = N - cardsToShow;

  useEffect(() => {
    if (activeIndex > maxIndex) {
      setActiveIndex(maxIndex);
    }
  }, [cardsToShow, maxIndex, activeIndex]);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay, maxIndex]);

  // const handleNext = () => {
  //   setAutoplay(false);
  //   setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  // };

  // const handlePrev = () => {
  //   setAutoplay(false);
  //   setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  // };

  return (
    <div className="bg-transparent py-12 md:py-16 lg:py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-wide">
            {TESTIMONIALS_CONTENT.title}
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
            {TESTIMONIALS_CONTENT.subtitle}
          </p>
        </div>

        {/* Testimonial slider wrapper */}
        <div className="relative overflow-hidden w-full px-2 py-4">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * (100 / cardsToShow)}%)` }}
          >
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
              >
                <div className="bg-slate-50 border border-slate-100/80 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[280px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1">
                  <div>
                    {/* Rating stars */}
                    <div className="flex gap-0.5 mb-4 text-[#FF5A5F]">
                      {[...Array(test.rating)].map((_, sIdx) => (
                        <Star key={sIdx} className="w-4 h-4 fill-[#FF5A5F] text-[#FF5A5F]" />
                      ))}
                    </div>

                    <p className="text-slate-650 italic leading-relaxed text-sm md:text-base mb-6 font-medium line-clamp-4">
                      {test.text}
                    </p>
                  </div>

                  {/* Profile detail bottom */}
                  <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/50">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-200 border border-slate-100 flex-shrink-0">
                      <Image
                        src={memberAvatarFallback(test.avatar)}
                        alt={test.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm md:text-base leading-snug">
                        {test.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">
                        {test.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Buttons & Indicators */}
        <div className="flex flex-col items-center gap-6 mt-8">
          {/* Arrow Buttons
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
          </div> */}

          {/* Dots Indicator */}
          <div className="flex gap-2.5">
            {[...Array(maxIndex + 1)].map((_, dotIdx) => (
              <Button
                variant="ghost"
                key={dotIdx}
                onClick={() => {
                  setAutoplay(false);
                  setActiveIndex(dotIdx);
                }}
                className={`h-2 p-0 min-w-0 rounded-full transition-all duration-300 cursor-pointer ${
                  dotIdx === activeIndex ? "w-6 bg-[#FF5A5F] hover:bg-[#FF5A5F]" : "w-2 bg-slate-200 hover:bg-slate-300"
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

// Fallback helper to prevent compilation issues with external unsplash urls
function memberAvatarFallback(url: string) {
  return url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150";
}

export default Testimonials;
