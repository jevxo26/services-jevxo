"use client";

import React, { useMemo } from "react";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetPublicServicesQuery } from "@/redux/features/landing/landingApi";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 65, damping: 15 },
  },
} as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          strokeWidth={0}
          className={i <= Math.round(rating) ? "fill-amber-400" : "fill-slate-200"}
        />
      ))}
    </span>
  );
}

const getHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

interface TrendingServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  reviews: string;
  price: number;
  badge?: string;
  slug: string;
}

export default function TrendingServices() {
  const { data: servicesRes, isLoading } = useGetPublicServicesQuery();
  const allServices = servicesRes?.data || (Array.isArray(servicesRes) ? servicesRes : []);

  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() || "";
  const categorySlug = searchParams.get("category") || "";

  // Map API services or use exact design match fallbacks
  const trendingListings = useMemo<TrendingServiceItem[]>(() => {
    if (!allServices.length) return [];

    let filteredServices = allServices;
    if (q || categorySlug) {
      filteredServices = allServices.filter((service: any) => {
        let match = true;
        if (q) {
          const nameMatch = service.name?.toLowerCase().includes(q);
          const descMatch = (service.description || service.subtitle || "")?.toLowerCase().includes(q);
          if (!nameMatch && !descMatch) match = false;
        }
        if (categorySlug) {
          if (service.category?.slug !== categorySlug) match = false;
        }
        return match;
      });
    }

    // Sort by most bookings and most reviews
    const sortedServices = [...filteredServices].sort((a: any, b: any) => {
      const aScore = (a.bookings?.length || 0) + (a.reviews?.length || 0);
      const bScore = (b.bookings?.length || 0) + (b.reviews?.length || 0);
      return bScore - aScore;
    });

    const mapped = sortedServices.map((item: any, index: number) => {
      const id = String(item.id);
      const hash = getHash(id);

      // Calculate real rating & reviews if available
      const totalReviews = item.reviews?.length || 0;
      let averageRating = 4.5 + (hash % 6) * 0.1; // fallback

      if (totalReviews > 0) {
        const sumRating = item.reviews.reduce((acc: number, cur: any) => acc + (cur.rating || 0), 0);
        averageRating = sumRating / totalReviews;
      }

      // Format reviews count
      const reviewsStr = totalReviews > 0 ? `${totalReviews}+` : `${(1.0 + (hash % 40) * 0.1).toFixed(1)}k`;

      // Get lowest price from nested services
      let priceVal = 1000;
      if (item.nestedServices && item.nestedServices.length > 0) {
        const prices = item.nestedServices
          .map((ns: any) => Number(ns.starting_price || 0))
          .filter((p: number) => p > 0);
        if (prices.length > 0) {
          priceVal = Math.min(...prices);
        }
      }

      return {
        id,
        title: item.name || "",
        description: item.description || item.subtitle || "",
        image: item.image || "/images/service/service-1.png",
        rating: parseFloat(averageRating.toFixed(1)),
        reviews: reviewsStr,
        price: priceVal,
        badge: index === 0 ? "MOST BOOKED" : index === 1 ? "HOT" : hash % 3 === 0 ? "POPULAR" : undefined,
        slug: item.slug || "",
      };
    });

    // Return the top 6 items
    return mapped.slice(0, 6);
  }, [allServices, q, categorySlug]);

  if (isLoading) {
    return (
      <section className="py-14 bg-[#FFF8F4] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-8 w-48 bg-slate-200/50 animate-pulse rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
            <div className="h-[320px] bg-slate-200/50 animate-pulse rounded-2xl" />
            <div className="h-[320px] bg-slate-200/50 animate-pulse rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!allServices.length) {
    return (
      <section className="py-14 bg-[#FFF8F4] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center py-12">
          <h2 className="text-xl font-extrabold text-slate-800 mb-2">Trending Services</h2>
          <p className="text-sm text-slate-500">No trending services available at the moment.</p>
        </div>
      </section>
    );
  }

  const featured = trendingListings[0];
  const secondary = trendingListings[1];

  return (
    <section className="pt-4 pb-4 md:py-14 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center md:items-start md:text-left mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              Trending Services
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider">
              Highly requested by residents in Dhaka this month
            </p>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        {trendingListings.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-6 items-stretch"
          >

            {/* Featured Large Card */}
            {featured && (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 bg-white rounded-3xl overflow-hidden border border-slate-100/60 hover-card-premium"
              >
                <div className="relative min-h-[220px] sm:min-h-full bg-slate-50">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  {featured.badge && (
                    <span className="absolute top-4 left-4 py-1.5 px-3 bg-[#8b1a1a] text-white text-[9px] font-extrabold tracking-wider rounded-lg uppercase shadow-sm z-10">
                      {featured.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StarRating rating={featured.rating} />
                      <span className="text-[11px] text-slate-400 font-bold">
                        ({featured.rating} • {featured.reviews} reviews)
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-800 leading-snug">
                      {featured.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">
                      {featured.description}
                    </p>
                  </div>
                  <div className="flex items-end justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">
                        Starting from
                      </p>
                      <p className="text-lg font-black text-slate-800">
                        ৳{featured.price.toLocaleString()}
                      </p>
                    </div>
                    <Link
                      href={featured.slug ? `/categories/service/${featured.slug}?book=true` : `/services/${featured.id}?book=true`}
                      className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Secondary Vertical Card */}
            {secondary && (
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100/60 flex flex-col hover-card-premium"
              >
                <div className="relative h-44 w-full bg-slate-50 shrink-0">
                  <img
                    src={secondary.image}
                    alt={secondary.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-extrabold text-slate-800 leading-snug">
                        {secondary.title}
                      </h3>
                      <span className="flex items-center gap-1 bg-[#fff8e1] text-[#b45309] px-2 py-0.5 rounded-lg text-[10px] font-extrabold shrink-0">
                        ★ {secondary.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                      {secondary.description}
                    </p>
                  </div>
                  <div className="flex items-end justify-between pt-4 border-t border-slate-100 mt-auto">
                    <span className="text-lg font-black text-slate-800">
                      ৳{secondary.price.toLocaleString()}
                    </span>
                    <Link
                      href={secondary.slug ? `/categories/service/${secondary.slug}?book=true` : `/services/${secondary.id}?book=true`}
                      className="px-4 py-2 bg-slate-50 hover:bg-[#FF6014] text-slate-700 hover:text-white border border-slate-100 hover:border-transparent text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-3xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-sm font-semibold text-slate-400">
              No trending services available
            </p>
          </div>
        )}
      </div>
    </section>
  );
}