"use client";
import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import { useGetPublicReviewsQuery } from "@/redux/features/landing/landingApi";
import { motion } from "framer-motion";

const Testimonials = () => {
  const [mounted, setMounted] = useState(false);
  const { data: reviewsRes, isLoading } = useGetPublicReviewsQuery();
  const rawReviews: any[] = reviewsRes?.data || (Array.isArray(reviewsRes) ? reviewsRes : []);

  const realReviews = rawReviews
    .filter((r: any) => (r.comment || r.content || r.review || "").trim().length > 0)
    .map((r: any) => ({
      name: r.user?.name || "Valued Customer",
      location: r.user?.profile?.address || "Dhaka, Bangladesh",
      rating: r.rating || 5,
      comment: r.comment || r.content || r.review || "",
      avatar:
        r.user?.profile?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || "U")}&background=FF7C71&color=fff&size=100`,
    }));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-5 md:py-16 lg:py-24 relative overflow-hidden bg-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
              <MessageSquare size={13} />
              Customer Reviews
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              What our clients <span className="text-[#FF6014]">say about us</span>
            </h2>
            <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Trusted by thousands of happy homes across Bangladesh.
            </p>
          </div>
          <div className="flex justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-[#FF6014]" />
          </div>
        </div>
      </div>
    );
  }

  if (realReviews.length === 0 && !isLoading) {
    return null;
  }

  /* Each card is 340px wide + 24px gap = 364px per step */
  const cardWidth = 340;
  const marqueeItems = [...realReviews, ...realReviews, ...realReviews];
  const totalWidth = realReviews.length * (cardWidth + 24);

  return (
    <div className="py-5 md:py-16 lg:py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            <MessageSquare size={13} />
            Customer Reviews
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            What our clients
            <span className="text-[#FF6014]"> say about us</span>
          </h2>

          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Trusted by thousands of happy homes across Bangladesh.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-[#FF6014]" />
          </div>
        )}

        {/* Marquee slider */}
        {!isLoading && realReviews.length > 0 && (
          <div className="relative overflow-hidden rounded-[32px] bg-slate-50/30 border border-slate-100 p-6 shadow-inner">
            {/* Left fade */}
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-slate-50/80 to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-slate-50/80 to-transparent z-10 pointer-events-none" />

            <motion.div
              className="flex gap-6"
              animate={{ x: [0, -totalWidth] }}
              transition={{
                duration: Math.max(15, realReviews.length * 5),
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {marqueeItems.map((test: any, idx: number) => (
                <div key={idx} className="min-w-[340px] flex-shrink-0" style={{ width: cardWidth }}>
                  <div className="relative bg-white rounded-3xl border border-slate-100 p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full min-h-[250px]">
                    {/* Decorative quote */}
                    <span className="absolute top-4 right-6 text-8xl font-serif leading-none select-none pointer-events-none text-[#FF6014]/8">
                      "
                    </span>

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(Math.min(test.rating || 5, 5))].map((_, i) => (
                        <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-slate-700 text-[15px] leading-relaxed line-clamp-4 flex-1 mb-6">
                      "{test.comment}"
                    </p>

                    {/* Accent line */}
                    <div className="w-10 h-0.5 bg-[#FF6014]/30 mb-5" />

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={test.avatar}
                          alt={test.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(test.name)}&background=FF5A5F&color=fff&size=80`;
                          }}
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{test.name}</h4>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{test.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;