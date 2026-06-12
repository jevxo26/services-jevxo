"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Content exactly matching the screenshot
const TESTIMONIALS_CONTENT = {
  testimonials: [
    {
      name: "Adnan Sami",
      text: '"The AC service was professional and on-time. Best experience in Dhaka so far."',
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Mehjabin R.",
      text: '"Finding a reliable plumber was impossible before Rajseba. Life-changing app!"',
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Saif Islam",
      text: '"Fast, reliable and high-quality cleaning service. I highly recommend them to everyone."',
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    }
  ]
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
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

const Testimonials = () => {
  const testimonials = TESTIMONIALS_CONTENT.testimonials;

  return (
    <div className="bg-transparent py-12 md:py-16 lg:py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Block matching the screenshot */}
        <div className="text-left mb-10 md:mb-12">
          <span className="text-xs font-bold tracking-wider uppercase text-[#FF5A5F] block mb-1">
            SOME HAPPY FACES
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Real Happy Customers, Real Stories
          </h2>
        </div>

        {/* Testimonials Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-300 flex flex-col h-full"
            >
              {/* Header Profile with Avatar & Stars */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                  <Image
                    src={test.avatar}
                    alt={test.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm md:text-base leading-snug">
                    {test.name}
                  </h4>
                  <div className="flex gap-0.5 mt-1 text-[#FF5A5F]">
                    {[...Array(5)].map((_, sIdx) => (
                      <Star key={sIdx} className="w-3.5 h-3.5 text-[#FF5A5F]" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">
                {test.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default Testimonials;
