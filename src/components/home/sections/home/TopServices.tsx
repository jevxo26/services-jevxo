"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";

// Clean Data Architecture - Dynamic Services configs
const SERVICES_CONTENT = {
  title: "Top Rated Services",
  subtitle: "Handpicked vendors with the highest customer satisfaction.",
  viewAllText: "View All Services",
  viewAllHref: "/services",
  services: [
    {
      title: "Dhaka Cool Experts",
      description: "Master AC Servicing & Gas Refill",
      price: 750,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
      slug: "ac-repair"
    },
    {
      title: "ProFlow Plumbing",
      description: "Kitchen & Bathroom Specialist",
      price: 500,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop",
      slug: "plumbing"
    },
    {
      title: "Sparkle Home Care",
      description: "Deep Cleaning & Sanitization",
      price: 1200,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
      slug: "home-cleaning"
    },
    {
      title: "VoltGuard Solutions",
      description: "Full Home Wiring & Panel Fix",
      price: 850,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=600&auto=format&fit=crop",
      slug: "appliance-repair"
    }
  ]
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 14
    }
  }
} as const;

export default function TopServices() {
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const toggleLike = (index: number) => {
    setLiked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="bg-transparent py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12 md:mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {SERVICES_CONTENT.title}
            </h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              {SERVICES_CONTENT.subtitle}
            </p>
          </div>
          <Link
            href={SERVICES_CONTENT.viewAllHref}
            className="text-[#FF5A5F] font-bold hover:text-[#FF4449] transition-colors text-sm md:text-base cursor-pointer"
          >
            {SERVICES_CONTENT.viewAllText}
          </Link>
        </div>

        {/* Dynamic Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {SERVICES_CONTENT.services.map((service, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-[#FF5A5F]/15 shadow-xs hover:shadow-[0_20px_45px_rgba(255,90,95,0.04)] transition-all duration-300 group flex flex-col h-full"
            >
              {/* Image Block */}
              <div className="h-52 md:h-56 bg-slate-100 relative overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* VERIFIED floating badge */}
                <div className="absolute top-4 left-4 bg-white px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider flex items-center gap-1 shadow-xs text-slate-800 uppercase">
                  <svg className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>

                {/* Heart Toggle wishlist */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleLike(i);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs border border-slate-100/40 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-4 h-4 transition-colors ${liked[i] ? "fill-[#FF5A5F] text-[#FF5A5F]" : "text-slate-700"}`} />
                </button>
              </div>

              {/* Text metadata block */}
              <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug tracking-tight">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-0.5 text-[#FF5A5F] font-black text-sm whitespace-nowrap">
                      <span className="text-xs">★</span>
                      <span>{service.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">
                    {service.description}
                  </p>
                </div>

                {/* Price and Action Book */}
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-50">
                  <div className="text-sm font-black text-slate-900">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Starting at</span>
                    <span>${service.price}</span>
                  </div>
                  <Link href={`/book/${service.slug}`}>
                    <button className="bg-rose-50 hover:bg-[#FFF0F1] text-[#FF5A5F] text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 border-none">
                      Book Service
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
