"use client";

import React, { useState, useEffect } from "react";
import { Star, Quote, MessageSquare, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetPublicReviewsQuery } from "@/redux/features/landing/landingApi";

// Fallback testimonials
const FALLBACK_TESTIMONIALS = [
  {
    name: "Adnan Sami",
    location: "Gulshan, Dhaka",
    rating: 5,
    comment: "The AC service was professional and on-time. Best experience in Dhaka so far.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    accent: "from-[#FF7C71] to-rose-500",
  },
  {
    name: "Mehjabin R.",
    location: "Uttara, Dhaka",
    rating: 5,
    comment: "Finding a reliable plumber was impossible before Rajseba. Life-changing app!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    accent: "from-violet-500 to-purple-600",
  },
  {
    name: "Saif Islam",
    location: "Banani, Dhaka",
    rating: 5,
    comment: "Fast, reliable and high-quality cleaning service. I highly recommend them.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    name: "Tasnim Jahan",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    comment: "Very satisfied with the plumbing repair. Diagnosed and fixed quickly at a great price.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    accent: "from-amber-500 to-orange-500",
  },
  {
    name: "Adnan Chowdhury",
    location: "Mirpur, Dhaka",
    rating: 5,
    comment: "Courteous electricians who fixed my wiring issues professionally. Even cleaned up after!",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    name: "Sabrina Yasmin",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    comment: "Booked a deep cleaning — they exceeded expectations. Spotless corners, great team!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    accent: "from-pink-500 to-rose-500",
  },
];

const ACCENTS = [
  "from-[#FF7C71] to-rose-500",
  "from-[#FF7C71] to-orange-500",
  "from-rose-500 to-pink-650",
  "from-amber-500 to-[#FF7C71]",
  "from-[#FF7C71] to-pink-500",
  "from-orange-500 to-red-500",
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);

  const { data: reviewsRes, isLoading } = useGetPublicReviewsQuery();
  const rawReviews: any[] = reviewsRes?.data || (Array.isArray(reviewsRes) ? reviewsRes : []);

  const testimonials = rawReviews.length > 0
    ? rawReviews.map((r: any, i: number) => ({
      name: r.user?.name || "Valued Customer",
      location: r.user?.profile?.address || "Dhaka, Bangladesh",
      rating: r.rating || 5,
      comment: r.comment || r.content || r.review || "",
      avatar: r.user?.profile?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || "U")}&background=FF5A5F&color=fff&size=100`,
      accent: ACCENTS[i % ACCENTS.length],
    }))
    : FALLBACK_TESTIMONIALS;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardsToShow = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3;
  const maxIndex = Math.max(0, testimonials.length - cardsToShow);

  useEffect(() => {
    if (activeIndex > maxIndex) setActiveIndex(maxIndex);
  }, [cardsToShow, maxIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [maxIndex]);

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FF7C71]/10 border border-[#FF7C71]/20 text-[#FF7C71] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
              <MessageSquare size={13} />
              Customer Reviews
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              What Our Clients Say
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">
              Trusted by thousands of happy homes across Bangladesh.
            </p>
          </div>

          {/* Nav controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveIndex((p) => Math.max(0, p - 1))}
              disabled={activeIndex === 0}
              className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#FF7C71] hover:text-[#FF7C71] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setActiveIndex((p) => Math.min(maxIndex, p + 1))}
              disabled={activeIndex === maxIndex}
              className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#FF7C71] hover:text-[#FF7C71] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="w-7 h-7 animate-spin text-[#FF7C71]" />
          </div>
        )}

        {/* Carousel */}
        {!isLoading && (
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out animate-none"
              style={{ transform: `translateX(-${activeIndex * (100 / cardsToShow)}%)` }}
            >
              {testimonials.map((test: any, idx: number) => (
                <div key={idx} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2.5">
                  {/* Card */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between h-[210px] md:h-[220px]">

                    {/* Colored top bar */}
                    <div className={`h-1 w-full bg-gradient-to-r ${test.accent}`} />

                    <div className="p-5 flex flex-col justify-between flex-1">
                      {/* Quote icon + stars row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${test.accent} flex items-center justify-center`}>
                          <Quote size={14} className="text-white fill-white" />
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(Math.min(test.rating || 5, 5))].map((_, i) => (
                            <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 flex-1 mb-2 italic">
                        "{test.comment}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                        <img
                          src={test.avatar}
                          alt={test.name}
                          className="w-9 h-9 rounded-full object-cover border-2 border-slate-100 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(test.name)}&background=FF5A5F&color=fff&size=80`;
                          }}
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs leading-tight">{test.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{test.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dot indicators */}
        {!isLoading && testimonials.length > cardsToShow && (
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-6 bg-[#FF7C71]" : "w-1.5 bg-slate-200"
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;