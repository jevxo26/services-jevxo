"use client";

import React from "react";
import Image from "next/image";
import {
  Star,
  MessageSquare,
  Loader2,
  Sparkles,
  ThumbsUp,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { useGetPublicReviewsQuery } from "@/redux/features/landing/landingApi";

export default function BlogClientPage() {
  const { data: reviewsRes, isLoading: reviewsLoading } = useGetPublicReviewsQuery();
  const rawReviews: any[] = reviewsRes?.data || (Array.isArray(reviewsRes) ? reviewsRes : []);

  // Format reviews nicely
  const reviews = rawReviews
    .filter((r: any) => (r.comment || r.content || r.review || "").trim().length > 0)
    .map((r: any) => ({
      id: r.id,
      name: r.user?.name || "Valued Customer",
      location: r.user?.profile?.address || "Rajshahi, Bangladesh",
      rating: r.rating || 5,
      comment: r.comment || r.content || r.review || "",
      avatar:
        r.user?.profile?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || "U")}&background=FF7C71&color=fff&size=100`,
    }));

  return (
    <div className="min-h-screen bg-transparent overflow-hidden flex-1 flex flex-col relative font-sans pb-24">
      {/* Background Icon Pattern */}
      <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />

      {/* ─── HERO BANNER ─── */}
      <section className="relative pt-12 pb-10 md:pt-16 md:pb-14 lg:pt-20 border-b border-slate-100 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Trust Badges and Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/20">
                <Sparkles className="w-3.5 h-3.5" /> Client Stories & Feedback
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-slate-900 leading-[1.1]">
                Real Experiences from Our <span className="text-[#FF6014]">Trusted Clients</span>
              </h1>
              <p className="text-[14px] text-slate-500 font-semibold leading-relaxed max-w-xl">
                At Rajseba, we are dedicated to transforming home services with unmatched reliability, safety, and transparency. Read the verified success stories and feedback from families who choose us daily.
              </p>

              {/* Service Trust Metrics Row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 max-w-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[#FF6014] font-extrabold text-lg">
                    4.9 <Star size={16} className="fill-amber-400 text-amber-400" />
                  </div>
                  <p className="text-[11px] text-slate-450 font-bold uppercase tracking-wider">Average Rating</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[#FF6014] font-extrabold text-lg">
                    15K+
                  </div>
                  <p className="text-[11px] text-slate-450 font-bold uppercase tracking-wider">Happy Homes</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[#FF6014] font-extrabold text-lg">
                    100%
                  </div>
                  <p className="text-[11px] text-slate-450 font-bold uppercase tracking-wider">Verified Reviews</p>
                </div>
              </div>
            </div>

            {/* Right Column: Service Image Collage */}
            <div className="lg:col-span-5 relative h-[360px] sm:h-[400px]">
              {/* Image 1: Home Cleaning (Main, Top-Left) */}
              <div className="absolute top-0 left-0 w-[65%] h-[75%] rounded-3xl overflow-hidden border-4 border-white shadow-lg z-0">
                <Image
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop"
                  alt="Home Cleaning Service"
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>

              {/* Image 2: AC Maintenance (Bottom-Right) */}
              <div className="absolute bottom-4 right-0 w-[50%] h-[60%] rounded-3xl overflow-hidden border-4 border-white shadow-xl z-10">
                <Image
                  src="https://images.unsplash.com/photo-1581094288338-2314dddb7eed?q=80&w=600&auto=format&fit=crop"
                  alt="AC Service & Repair"
                  fill
                  className="object-cover"
                  sizes="250px"
                />
              </div>

              {/* Image 3: Sofa Cleaning (Bottom-Left Overlapping) */}
              <div className="absolute -bottom-4 left-6 w-[45%] h-[50%] rounded-3xl overflow-hidden border-4 border-white shadow-2xl z-20">
                <Image
                  src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop"
                  alt="Sofa Steam Cleaning"
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>

              {/* Floating Review Summary Card (Top-Right Overlapping) */}
              <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-xl border border-orange-100 rounded-2xl p-4 shadow-xl max-w-[220px] flex items-start gap-3 z-30">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6014] shrink-0">
                  <ThumbsUp size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-[11px] leading-snug">Highly Recommended</h4>
                  <p className="text-[10px] text-slate-450 font-semibold mt-1">Recommended by 12,000+ local families across Rajshahi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CLIENT REVIEWS SECTION ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 relative z-10">
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <MessageSquare size={18} className="text-[#FF6014]" />
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-800">
                Verified Client Reviews & Feedback
              </h2>
            </div>
            <span className="text-xs text-slate-450 font-bold bg-white border border-slate-150 px-3 py-1.5 rounded-full shadow-sm">
              {reviews.length} Verified Reviews
            </span>
          </div>

          {reviewsLoading ? (
            <div className="flex flex-col justify-center items-center py-24 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
              <span className="text-slate-400 text-xs font-semibold animate-pulse">Loading reviews...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-24 bg-white/70 backdrop-blur-md border border-slate-150 rounded-3xl space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-350 mx-auto" />
              <p className="text-slate-400 font-bold text-sm">No client reviews available yet.</p>
              <p className="text-slate-350 text-xs font-medium">Be the first to share your experience with us!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="relative bg-white/70 backdrop-blur-md rounded-3xl border border-slate-150 p-6 shadow-sm hover:shadow-xl hover:border-[#FF6014]/25 transition-all duration-300 flex flex-col justify-between min-h-[220px] group overflow-hidden"
                >
                  <span className="absolute -top-3 -right-2 text-7xl font-serif leading-none select-none pointer-events-none text-[#FF6014]/5">
                    &ldquo;
                  </span>

                  <div>
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-3.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={`${
                            i < (review.rating || 5)
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200 fill-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-slate-650 text-xs font-semibold leading-relaxed line-clamp-5 flex-1 mb-5">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>

                  <div>
                    {/* Divider Line */}
                    <div className="w-7 h-0.5 bg-[#FF6014]/25 mb-4 group-hover:w-12 transition-all duration-300" />

                    {/* Author */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex-shrink-0">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-100 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              review.name
                            )}&background=FFF4EE&color=FF6014&size=80`;
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs truncate leading-tight">
                          {review.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate leading-none">
                          {review.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
