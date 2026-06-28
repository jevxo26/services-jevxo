"use client";

import React from "react";
import { Star, User } from "lucide-react";
import { motion } from "framer-motion";

interface Expert {
  name: string;
  title: string;
  rating: number;
  jobs: string;
  image?: string;
}

const fallbackExperts: Expert[] = [
  {
    name: "Ariful Islam",
    title: "Senior Technician (8yr Exp)",
    rating: 4.9,
    jobs: "420+ jobs",
    image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Tanvir Ahmed",
    title: "Wiring Specialist",
    rating: 4.8,
    jobs: "215+ jobs",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Md. Zahid Ahmed",
    title: "Master Electrician",
    rating: 5.0,
    jobs: "580+ jobs",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Salman Khan",
    title: "Installation Pro",
    rating: 4.7,
    jobs: "180+ jobs",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  },
];

export function Experts({ employees }: { employees?: any[] }) {
  const displayExperts =
    employees && employees.length > 0
      ? employees.map((emp, idx) => ({
        name: emp.name,
        title: emp.role || "Expert Technician",
        rating: parseFloat((4.8 + (idx % 3) * 0.1).toFixed(1)),
        jobs: `${120 + idx * 35}+ jobs`,
        image: emp.image || emp.avatar,
      }))
      : fallbackExperts;

  /* Duplicate list 3× so the marquee loops smoothly */
  const marqueeItems = [...displayExperts, ...displayExperts, ...displayExperts];

  /* Each card is 280px wide + 24px gap = 304px per step */
  const totalWidth = displayExperts.length * 304;

  return (
    <section className="py-6 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            Top Professionals
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Meet Our Top Rated Experts
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-md font-medium">
            Background-checked and highly-skilled technicians ready to serve you.
          </p>
        </div>
      </div>

      {/* Marquee container with fading edges */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-50/30 border border-slate-100 p-6 shadow-inner">
        {/* Left fade */}
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-slate-50/80 to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-slate-50/80 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6"
          animate={{ x: [0, -totalWidth] }}
          transition={{
            duration: Math.max(12, displayExperts.length * 4),
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {marqueeItems.map((expert, index) => (
            <div key={index} className="min-w-[280px] flex-shrink-0">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center hover:shadow-md transition-all duration-300 group h-full">
                {/* Avatar */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-rose-100/50 flex items-center justify-center shrink-0 shadow-xs bg-white">
                  {expert.image ? (
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#fff0f0] flex items-center justify-center text-[#FF6014]">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-800 mb-0.5">
                  {expert.name}
                </h3>
                <p className="text-slate-400 text-xs font-semibold mb-3">{expert.title}</p>

                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-[#FF6014] text-[#FF6014]" />
                  <span className="font-extrabold text-sm text-slate-800">
                    {expert.rating}
                  </span>
                  <p className="text-slate-400 text-xs font-medium">({expert.jobs})</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}