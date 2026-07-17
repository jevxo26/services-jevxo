"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Star, MessageSquare, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetPublicReviewsQuery } from "@/redux/features/landing/landingApi";
import { motion, AnimatePresence } from "framer-motion";

/* How many cards visible per viewport */
function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () => setCount(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "60%" : "-60%", opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0, scale: 0.95 }),
};

const Testimonials = () => {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const visibleCount = useVisibleCount();

  const { data: reviewsRes, isLoading } = useGetPublicReviewsQuery();
  const rawReviews: any[] = reviewsRes?.data || (Array.isArray(reviewsRes) ? reviewsRes : []);

  const reviews = rawReviews
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

  const totalPages = Math.ceil(reviews.length / visibleCount);

  const paginate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setPage((prev) => (prev + dir + totalPages) % totalPages);
    },
    [totalPages]
  );

  useEffect(() => { setMounted(true); }, []);

  /* Reset page if visibleCount changes and page is out of range */
  useEffect(() => {
    if (page >= totalPages && totalPages > 0) setPage(0);
  }, [totalPages, page]);

  const visibleReviews = reviews.slice(page * visibleCount, page * visibleCount + visibleCount);

  const Header = () => (
    <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
      <div className="inline-flex items-center gap-2 bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
        <MessageSquare size={13} />
        Customer Reviews
      </div>
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight leading-tight flex items-center justify-center gap-2">
        <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-[#4F46E5]" />
        What our clients <span className="text-[#4F46E5]">say about us</span>
      </h2>
      <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
        Trusted by thousands of happy homes across Bangladesh.
      </p>
    </div>
  );

  if (!mounted) {
    return (
      <div className="py-5 md:py-8 lg:py-10 relative overflow-hidden bg-transparent">
        <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6">
          <Header />
          <div className="flex justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-[#4F46E5]" />
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0 && !isLoading) return null;

  return (
    <div className="py-5 md:py-8 lg:py-10 relative overflow-hidden bg-transparent">
      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6">
        <Header />

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-[#4F46E5]" />
          </div>
        )}

        {!isLoading && reviews.length > 0 && (
          <div className="relative">

            {/* ── Left Arrow ── */}
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous testimonials"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-blue-200 shadow-md hover:border-blue-500 hover:shadow-blue-100 hover:shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer group"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
            </button>

            {/* ── Cards area ── */}
            <div className="overflow-hidden mx-8 md:mx-10">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={page}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 280, damping: 30 }}
                  className={`grid gap-5 ${visibleCount === 1
                    ? "grid-cols-1"
                    : visibleCount === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
                    }`}
                >
                  {visibleReviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="relative bg-white rounded-3xl border border-blue-200 p-7 shadow-sm hover:shadow-lg hover:border-blue-500 hover:shadow-blue-100 transition-all duration-300 flex flex-col min-h-[250px]"
                    >
                      {/* Decorative quote mark */}
                      <span className="absolute top-4 right-6 text-8xl font-serif leading-none select-none pointer-events-none text-[#4F46E5]/8">
                        "
                      </span>

                      {/* Stars */}
                      <div className="flex gap-0.5 mb-4">
                        {[...Array(Math.min(review.rating || 5, 5))].map((_, i) => (
                          <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="text-slate-700 text-[15px] leading-relaxed line-clamp-4 flex-1 mb-6">
                        "{review.comment}"
                      </p>

                      {/* Accent line */}
                      <div className="w-10 h-0.5 bg-[#4F46E5]/30 mb-5" />

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=FF5A5F&color=fff&size=80`;
                            }}
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-tight">{review.name}</h4>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{review.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Right Arrow ── */}
            <button
              onClick={() => paginate(1)}
              aria-label="Next testimonials"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-blue-200 shadow-md hover:border-blue-500 hover:shadow-blue-100 hover:shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer group"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
            </button>

            {/* ── Dot indicators ── */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > page ? 1 : -1); setPage(i); }}
                    aria-label={`Go to page ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === page ? "w-6 bg-blue-500" : "w-2 bg-slate-200 hover:bg-blue-300"
                      }`}
                  />
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;