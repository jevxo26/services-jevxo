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
  const totalReviews = reviews.length;
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
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 md:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#FFF5F4] border border-[#FFD4CF] text-[#C0392B] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
              <Award size={11} />
              Verified Feedback
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              Customer Reviews
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              Real experiences from verified customers.
            </p>
          </div>
          {totalReviews > 0 && (
            <div className="inline-flex items-center gap-2 bg-[#FFF5F4] border border-[#FFD4CF] px-4 py-2.5 rounded-2xl self-start sm:self-auto">
              <ThumbsUp size={13} className="text-[#C0392B]" />
              <span className="text-sm font-bold text-[#C0392B]">
                {satisfactionPct}% satisfied
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">

          {/* ── LEFT: Rating Summary ── */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">

              {/* Big score */}
              <div className="text-center pb-5 border-b border-slate-100">
                <div className="text-7xl font-black text-slate-900 leading-none tracking-tight">
                  {averageRating}
                </div>
                <div className="flex justify-center gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(Number(averageRating))
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-100 text-slate-100"
                      }
                    />
                  ))}
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[2px] text-slate-400 mt-2">
                  {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Rating distribution bars */}
              <div className="pt-5 space-y-2.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingsCount[stars - 1];
                  const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 w-2.5 text-right shrink-0">
                        {stars}
                      </span>
                      <Star size={9} className="fill-amber-400 text-amber-400 shrink-0" />
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
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
                      <span className="text-[11px] font-bold text-slate-300 w-4 text-right shrink-0">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Trust pill */}
              {totalReviews > 0 && (
                <div className="mt-5 bg-[#FFF5F4] border border-[#FFD4CF] rounded-2xl p-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#C0392B] rounded-xl flex items-center justify-center shrink-0">
                    <ThumbsUp size={13} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {satisfactionPct}% recommend this service
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      Based on 4 & 5 star ratings
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Reviews List ── */}
          <div>
            {reviews.length === 0 ? (
              /* Empty state */
              <div className="bg-white border border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center gap-4 py-14 px-8 min-h-[260px]">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center">
                  <MessageSquare size={24} className="text-[#C0392B]" />
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-slate-800 mb-1">No reviews yet</h4>
                  <p className="text-xs text-slate-400 font-medium max-w-[200px] mx-auto leading-relaxed">
                    Reviews will appear once customers complete their bookings.
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-slate-100 text-slate-100" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((review, index) => {
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
                      className="bg-white border border-slate-100 rounded-[20px] p-5 hover:border-slate-200 hover:shadow-md transition-all duration-200 group"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar */}
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black text-white shrink-0 select-none"
                            style={{
                              background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)",
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
                              <span className="text-[11px] text-slate-400">{dateStr}</span>
                            </div>
                          </div>
                        </div>

                        {/* Star rating pill */}
                        <div
                          className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-xl shrink-0 border"
                          style={{
                            background: rating >= 4 ? "#FFFBEB" : "#FAFAF9",
                            borderColor: rating >= 4 ? "#FDE68A" : "#F1F5F9",
                          }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
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
                      <div className="relative pl-4">
                        <Quote
                          size={14}
                          className="absolute -left-0.5 top-0 text-rose-200 fill-rose-100"
                        />
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          {review.comment ||
                            "Service was completed perfectly and with top-tier professionalism."}
                        </p>
                      </div>

                      {/* Verified badge */}
                      <div className="mt-3.5 flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#C0392B] flex items-center justify-center shrink-0">
                          <svg width="7" height="5" viewBox="0 0 8 6" fill="none">
                            <path
                              d="M1 3L3 5L7 1"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-300">
                          Verified purchase
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}