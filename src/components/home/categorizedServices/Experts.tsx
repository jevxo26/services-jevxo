"use client";

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
  {
    name: "Sadikul Ahmed",
    title: "Senior Technician (8yr Exp)",
    rating: 4.9,
    jobs: "420+ jobs",
    image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Muntasir Alam",
    title: "Wiring Specialist",
    rating: 4.8,
    jobs: "215+ jobs",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Muntahara",
    title: "Master Electrician",
    rating: 5.0,
    jobs: "580+ jobs",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "John Doe",
    title: "Installation Pro",
    rating: 4.7,
    jobs: "180+ jobs",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
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
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Meet Our Top Rated Experts
          </h2>
        </div>

        {/* Marquee container with fading edges */}
        <div className="relative overflow-hidden">
          {/* Left fade */}
          <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-6"
            animate={{ x: [0, -totalWidth] }}
            transition={{
              duration: displayExperts.length * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {marqueeItems.map((expert, index) => (
              <div key={index} className="min-w-[280px] flex-shrink-0">
                <div className="bg-[#fff9f8] rounded-3xl p-8 text-center hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 group h-full">

                  {/* Avatar */}
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden border-2 border-rose-100/50 flex items-center justify-center shrink-0 shadow-sm bg-white">
                    {expert.image ? (
                      <img
                        src={expert.image}
                        alt={expert.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#fff0f0] flex items-center justify-center text-[#FF7C71]">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg text-slate-900 mb-1">
                    {expert.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">{expert.title}</p>

                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-5 h-5 fill-[#FF7C71] text-[#FF7C71]" />
                    <span className="font-bold text-lg text-slate-900">
                      {expert.rating}
                    </span>
                    <p className="text-slate-500 text-sm">({expert.jobs})</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}