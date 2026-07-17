"use client";

import React from "react";
import { Star, MessageSquare, Calendar, ThumbsUp, Award, Quote } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

export function ServiceReviews({ reviews = [] }: { reviews?: Review[] }) {
  const [showAll, setShowAll] = React.useState(false);
  const totalReviews = reviews.length;
  const visibleReviews = showAll ? reviews : reviews.slice(0, 2);
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) / totalReviews).toFixed(1)
      : "0.0";

  const ratingsCount = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const val = Math.max(1, Math.min(5, Math.floor(r.rating || 5)));
    ratingsCount[val - 1]++;
  });

  const satisfactionPct =
    totalReviews > 0
      ? Math.round(((ratingsCount[3] + ratingsCount[4]) / totalReviews) * 100)
      : 0;

  return (
    <section className="py-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            <Award size={12} />
            Verified Feedback
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Customer Reviews
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Real experiences from verified customers.
          </p>
        </div>
        {totalReviews > 0 && (
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#4F46E5]/10 px-4 py-2 rounded-2xl self-start sm:self-auto">
            <ThumbsUp size={13} className="text-[#4F46E5]" />
            <span className="text-xs font-bold text-[#4F46E5]">
              {satisfactionPct}% satisfied
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Rating Summary */}
        <div className="md:sticky md:top-28">
          <div className="bg-white border border-slate-100 rounded-[28px] p-5 shadow-sm">
            {/* Big score */}
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="text-6xl font-black text-slate-800 leading-none tracking-tight">
                {averageRating}
              </div>
              <div className="flex justify-center gap-1 mt-2.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(Number(averageRating))
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-100 text-slate-100"
                    }
                  />
                ))}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Rating distribution bars */}
            <div className="pt-4 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingsCount[stars - 1];
                const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 w-2.5 text-right shrink-0">
                      {stars}
                    </span>
                    <Star size={8} className="fill-amber-400 text-amber-400 shrink-0" />
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                        className="h-full rounded-full"
                        style={{
                          background:
                            percent > 60 ? "#F59E0B" : percent > 30 ? "#FCD34D" : "#E2E8F0",
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 w-4 text-right shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Trust pill */}
            {totalReviews > 0 && (
              <div className="mt-4 bg-[#EEF2FF] border border-[#4F46E5]/10 rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#4F46E5] rounded-xl flex items-center justify-center shrink-0">
                  <ThumbsUp size={12} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {satisfactionPct}% recommend
                  </p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                    Based on 4 & 5 stars
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div>
          {reviews.length === 0 ? (
            /* Empty state */
            <div className="bg-white border border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center gap-4 py-12 px-6 min-h-[220px]">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                <MessageSquare size={20} className="text-[#4F46E5]" />
              </div>
              <div className="text-center">
                <h4 className="text-xs font-bold text-slate-800 mb-1">No reviews yet</h4>
                <p className="text-[11px] text-slate-400 font-medium max-w-[180px] mx-auto leading-relaxed">
                  Reviews will appear once customers complete their bookings.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {visibleReviews.map((review, index) => {
                const dateStr = new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const rating = review.rating || 5;
                const initials = (review.user?.name || "V")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                    className="bg-white border border-slate-100 rounded-[24px] p-5 hover:border-slate-200 hover:shadow-xs transition-all duration-200 group"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black text-white shrink-0 select-none"
                          style={{
                            background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                          }}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">
                            {review.user?.name || "Verified Customer"}
                          </h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Calendar size={9} className="text-slate-300 shrink-0" />
                            <span className="text-[10px] text-slate-400 font-semibold">{dateStr}</span>
                          </div>
                        </div>
                      </div>

                      {/* Star rating pill */}
                      <div
                        className="flex items-center gap-0.5 px-2 py-1 rounded-xl shrink-0 border"
                        style={{
                          background: rating >= 4 ? "#FFFBEB" : "#FAFAF9",
                          borderColor: rating >= 4 ? "#FDE68A" : "#F1F5F9",
                        }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={9}
                            className={
                              i < rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-100 text-slate-100"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quote icon + Comment */}
                    <div className="relative pl-5">
                      <Quote
                        size={12}
                        className="absolute left-0 top-0.5 text-[#4F46E5]/30 fill-[#4F46E5]/10"
                      />
                      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
                        {review.comment ||
                          "Service was completed perfectly and with top-tier professionalism."}
                      </p>
                    </div>

                    {/* Verified badge */}
                    <div className="mt-3 flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#4F46E5] flex items-center justify-center shrink-0">
                        <svg width="6" height="4" viewBox="0 0 8 6" fill="none">
                          <path
                            d="M1 3L3 5L7 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
                        Verified purchase
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {reviews.length > 2 && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    {showAll ? "See Less" : `See More (${reviews.length - 2} more)`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}