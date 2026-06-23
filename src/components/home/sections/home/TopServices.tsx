"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetPublicNestedServicesQuery } from "@/redux/features/landing/landingApi";

// ─── Color pairs for cards (cycling) ────────────────────────────────────────
const COLOR_PAIRS = [
  { bgColor: "bg-blue-50", iconColor: "text-blue-500" },
  { bgColor: "bg-teal-50", iconColor: "text-teal-500" },
  { bgColor: "bg-amber-50", iconColor: "text-amber-500" },
  { bgColor: "bg-yellow-50", iconColor: "text-yellow-500" },
  { bgColor: "bg-rose-50", iconColor: "text-rose-500" },
  { bgColor: "bg-purple-50", iconColor: "text-purple-500" },
  { bgColor: "bg-green-50", iconColor: "text-green-500" },
  { bgColor: "bg-indigo-50", iconColor: "text-indigo-500" },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 14 },
  },
} as const;

// ─── Placeholder illustration ────────────────────────────────────────────────
function ServiceIllustration({ bgColor, iconColor }: { bgColor: string; iconColor: string }) {
  return (
    <div className={`relative h-48 md:h-52 ${bgColor} flex items-center justify-center overflow-hidden`}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-32 h-32 rounded-full opacity-10 border-[12px] border-current ${iconColor}`} />
      </div>
      <div className={`relative z-10 ${iconColor} drop-shadow-sm`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-16 h-16">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        </svg>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TopServices() {
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const { data: nestedRes, isLoading, isError } = useGetPublicNestedServicesQuery();

  // Support both { data: [...] } and [...] shapes
  const allNestedServices: any[] = nestedRes?.data || (Array.isArray(nestedRes) ? nestedRes : []);

  // Show top 8 services
  const displayServices = allNestedServices.slice(0, 8);

  const toggleLike = (id: number) =>
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-transparent mt-15 py-8 md:py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <div className="space-y-4 mb-8 md:mb-10">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-[#FF7C71]" />
              Top Rated Services
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Handpicked services with the highest customer satisfaction.
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <Link
              href="/services"
              className="rounded-xl flex items-center gap-2 px-5 py-2 bg-white hover:bg-[#FFF8F7] hover:text-[#FF7C71] border border-slate-200 shadow-sm text-sm font-semibold transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF7C71]" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <p className="text-center text-slate-400 text-sm py-8">
            Unable to load services right now. Please try again later.
          </p>
        )}

        {/* ── Cards grid ── */}
        {!isLoading && !isError && displayServices.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {displayServices.map((service: any, i: number) => {
              const colors = COLOR_PAIRS[i % COLOR_PAIRS.length];
              const slug = service.service?.slug || String(service.id);
              const category = service.service?.name || service.service?.category?.name || "";
              const price = service.price ? Number(service.price) : null;

              return (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 group flex flex-col h-full hover-card-premium"
                >
                  {/* ── Illustration or image ── */}
                  <div className="relative">
                    {service.image ? (
                      <div className="relative h-48 md:h-52 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    ) : (
                      <ServiceIllustration bgColor={colors.bgColor} iconColor={colors.iconColor} />
                    )}

                    {/* Verified badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider flex items-center gap-1 shadow-sm text-slate-700 uppercase">
                      <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </div>

                    {/* Category pill */}
                    {category && (
                      <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                        {category}
                      </div>
                    )}

                    {/* Wishlist heart */}
                    <Button
                      variant="ghost"
                      onClick={(e) => { e.preventDefault(); toggleLike(service.id); }}
                      className="absolute top-3 right-3 w-8 h-8 p-0 rounded-full bg-white/90 flex items-center justify-center shadow-sm border border-slate-100/60 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${liked[service.id] ? "fill-[#FF7C71] text-[#FF7C71]" : "text-slate-500"}`}
                      />
                    </Button>
                  </div>

                  {/* ── Text + CTA ── */}
                  <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug tracking-tight">
                          {service.name}
                        </h3>
                        <div className="flex items-center gap-0.5 text-[#FF7C71] font-black text-sm whitespace-nowrap">
                          <Star className="w-3 h-3 fill-[#FF7C71]" />
                          <span>4.8</span>
                        </div>
                      </div>
                      {service.description && (
                        <p className="text-xs font-semibold text-slate-400 line-clamp-2">{service.description}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-50">
                      <div className="text-sm font-black text-slate-900">
                        {price ? (
                          <>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Starting at</span>
                            <span>৳{price.toLocaleString()}</span>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold">Contact for price</span>
                        )}
                      </div>
                      <Link href={`/categories/service/${slug}`}>
                        <Button className="bg-[#FF7C71] hover:bg-[#E5675D] text-white text-xs font-extrabold px-4 py-2 h-auto rounded-xl transition-all cursor-pointer hover:scale-105 border-none shadow-md hover:shadow-lg">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && displayServices.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8">No services found.</p>
        )}

      </div>
    </div>
  );
}