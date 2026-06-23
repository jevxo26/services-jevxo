"use client"
import React, { useMemo } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { useGetPublicNestedServicesQuery } from '@/redux/features/landing/landingApi';

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          strokeWidth={0}
          className={i <= Math.round(rating) ? 'fill-amber-400' : 'fill-slate-200'}
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

export default function TrendingServices() {
  const { data: nestedRes, isLoading } = useGetPublicNestedServicesQuery();
  const allNestedServices = nestedRes?.data || (Array.isArray(nestedRes) ? nestedRes : []);

  const trendingListings = useMemo(() => {
    if (!allNestedServices.length) return [];

    const mapped = allNestedServices.map((item: any) => {
      const id = String(item.id);
      const hash = getHash(id);

      // Reviews count: 1.0k to 5.0k
      const reviews = `${(1.0 + (hash % 40) * 0.1).toFixed(1)}k`;

      // Rating: 4.5 to 5.0
      const rating = parseFloat((4.5 + (hash % 6) * 0.1).toFixed(1));

      // Badge options
      const badges = ["Trending", "Popular", "Best Seller", "Most Booked", "Featured"];
      const badge = hash % 3 === 0 ? badges[hash % badges.length] : undefined;

      const parentService = item.service || {};
      const parentSlug = parentService.slug || "";
      const priceVal = item.price ? Number(item.price) : 0;

      return {
        id,
        title: item.name || "",
        description: item.description || "",
        image: item.image || "/images/service/service-1.png",
        rating,
        reviews,
        price: priceVal,
        badge,
        slug: parentSlug,
      };
    });

    // Return top 3 items to show: 1 large featured, 2 secondary stacked
    return mapped.slice(0, 3);
  }, [allNestedServices]);

  if (isLoading) {
    return (
      <section className="py-14 bg-slate-50/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
            <div className="h-[320px] bg-slate-200 animate-pulse rounded-2xl" />
            <div className="flex flex-col gap-6">
              <div className="h-[148px] bg-slate-200 animate-pulse rounded-2xl" />
              <div className="h-[148px] bg-slate-200 animate-pulse rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!trendingListings.length) return null;

  const featured = trendingListings[0];
  const secondary = trendingListings.slice(1);

  return (
    <section className="py-14 bg-slate-50/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-[#ff5a5f] after:rounded-full">
              Trending Services
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider">
              Highly requested in Dhaka this month
            </p>
          </div>
          <Link
            href="/services"
            className="text-xs font-extrabold text-[#ff5a5f] hover:text-[#e04a4f] hover:underline flex items-center gap-1 uppercase tracking-wider transition-all"
          >
            View all services <ArrowRight size={14} />
          </Link>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
          
          {/* Featured Large Card */}
          {featured && (
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
              <div className="relative min-h-[220px] sm:min-h-full bg-slate-50">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover absolute inset-0"
                />
                {featured.badge && (
                  <span className="absolute top-4 left-4 py-1.5 px-3 bg-[#ff5a5f] text-white text-[9px] font-extrabold tracking-wider rounded-lg uppercase shadow-sm z-10">
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
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {featured.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">
                      Starting from
                    </p>
                    <p className="text-lg font-extrabold text-slate-800">
                      ৳{featured.price.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={featured.slug ? `/categories/service/${featured.slug}` : "/services"}
                    className="px-5 py-2.5 bg-[#ff5a5f] hover:bg-[#e04a4f] text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-rose-100 hover:shadow-lg hover:shadow-rose-200 cursor-pointer"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Stack Cards */}
          <div className="flex flex-col gap-6">
            {secondary.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col sm:flex-row hover:shadow-md transition-all duration-300 h-full"
              >
                <div className="relative w-full sm:w-2/5 min-h-[140px] sm:min-h-full bg-slate-50 shrink-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  {service.badge && (
                    <span className="absolute top-3 left-3 py-1 px-2.5 bg-slate-800/85 backdrop-blur-sm text-white text-[8px] font-extrabold tracking-wider rounded-lg uppercase z-10">
                      {service.badge}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-extrabold text-slate-800 leading-snug truncate max-w-[150px]">
                        {service.title}
                      </h3>
                      <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-[10px] font-extrabold shrink-0">
                        ★ {service.rating}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                    <span className="text-sm font-extrabold text-slate-800">
                      ৳{service.price.toLocaleString()}
                    </span>
                    <Link
                      href={service.slug ? `/categories/service/${service.slug}` : "/services"}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-[#ff5a5f] text-slate-500 hover:text-white border border-slate-100 hover:border-transparent transition-all cursor-pointer shadow-sm"
                      aria-label={`View ${service.title}`}
                    >
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}