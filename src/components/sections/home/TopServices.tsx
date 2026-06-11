"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Clean Data Architecture - Dynamic Services configs
const SERVICES_CONTENT = {
  title: "Top Rated Services",
  viewAllText: "View all",
  viewAllHref: "/services",
  services: [
    {
      title: "Expert AC Repair",
      description: "Fast cooling restoration by certified professionals",
      price: 700,
      unit: "service",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
      slug: "ac-repair"
    },
    {
      title: "Premium Painting",
      description: "Interior & exterior painting with quality materials",
      price: 3500,
      unit: "room",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=600&auto=format&fit=crop",
      slug: "painting"
    },
    {
      title: "Sparkle Home Clean",
      description: "Deep, sanitizing clean by trained personnel",
      price: 1800,
      unit: "session",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
      slug: "home-cleaning"
    },
    {
      title: "Washing Machine Repair",
      description: "Quick diagnostic and fix for all major appliance brands",
      price: 650,
      unit: "service",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1582730147233-ac81111d024d?q=80&w=600&auto=format&fit=crop",
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
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 14
    }
  }
} as const;

const TopServices = () => {
  return (
    <div className="bg-slate-50/50 py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header Block */}
        <div className="flex justify-between items-end mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {SERVICES_CONTENT.title}
          </h2>
          <Link
            href={SERVICES_CONTENT.viewAllHref}
            className="text-[#FF5A5F] font-bold flex items-center gap-1 hover:text-[#FF4449] transition-colors group text-sm md:text-base"
          >
            {SERVICES_CONTENT.viewAllText} 
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
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
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group flex flex-col h-full"
            >
              {/* Image Block */}
              <div className="h-52 md:h-56 bg-slate-100 relative overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Dynamic Rating badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm text-slate-800">
                  <Star className="w-3.5 h-3.5 fill-[#FF5A5F] text-[#FF5A5F]" />
                  {service.rating}
                </div>
              </div>

              {/* Text metadata block */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-[#FF5A5F] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Price and Action Book */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <div>
                    <span className="text-xl font-extrabold text-slate-900">৳{service.price}</span>
                    <span className="text-xs text-slate-400 font-medium">/{service.unit}</span>
                  </div>
                  <Link href={`/book/${service.slug}`}>
                    <button className="bg-[#FF5A5F] hover:bg-[#FF4449] text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95">
                      Book Now
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
};

export default TopServices;
