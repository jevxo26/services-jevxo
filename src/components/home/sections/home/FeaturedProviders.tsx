"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, BadgeCheck, MapPin, ThumbsUp } from "lucide-react";
import Link from "next/link";

const PROVIDERS = [
  {
    id: 1,
    name: "Md. Rahim Uddin",
    specialty: "Deep Cleaning Expert",
    location: "Dhaka, Mirpur",
    rating: 4.9,
    reviews: 312,
    jobs: "800+",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahim&backgroundColor=b6e3f4",
    tags: ["Cleaning", "Laundry"],
    badge: "Top Rated",
    badgeColor: "bg-[#FF7C71]/10 text-[#FF7C71] border-[#FF7C71]/20 border",
  },
  {
    id: 2,
    name: "Suman Das",
    specialty: "AC & Electrical Technician",
    location: "Dhaka, Gulshan",
    rating: 4.8,
    reviews: 228,
    jobs: "550+",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=suman&backgroundColor=c0aede",
    tags: ["AC Service", "Electrical"],
    badge: "Verified Pro",
    badgeColor: "bg-orange-500/10 text-orange-600 border-orange-500/20 border",
  },
  {
    id: 3,
    name: "Farida Khanam",
    specialty: "Home Organizer & Cleaner",
    location: "Dhaka, Dhanmondi",
    rating: 5.0,
    reviews: 189,
    jobs: "400+",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=farida&backgroundColor=ffdfbf",
    tags: ["Organization", "Cleaning"],
    badge: "5★ Provider",
    badgeColor: "bg-rose-500/10 text-rose-600 border-rose-500/20 border",
  },
  {
    id: 4,
    name: "Karim Hossain",
    specialty: "Plumbing & Renovation",
    location: "Chittagong",
    rating: 4.7,
    reviews: 164,
    jobs: "300+",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=karim&backgroundColor=d1f4d1",
    tags: ["Plumbing", "Renovation"],
    badge: "Trusted",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20 border",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 65, damping: 14 } },
} as const;

export default function FeaturedProviders() {
  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FF7C71]/10 border border-[#FF7C71]/20 text-[#FF7C71] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            <BadgeCheck size={13} />
            Verified Professionals
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <ThumbsUp className="w-7 h-7 text-[#FF7C71]" />
            Our Top Providers
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Background-checked, highly rated professionals trusted by thousands of happy customers.
          </p>
        </div>

        {/* Provider Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {PROVIDERS.map((provider) => (
            <motion.div
              key={provider.id}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.015 }}
              className="relative bg-white rounded-3xl border border-slate-100 p-5 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all cursor-pointer group"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${provider.badgeColor}`}>
                  {provider.badge}
                </span>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center text-center gap-2 pt-2">
                <div className="relative">
                  <img
                    src={provider.avatar}
                    alt={provider.name}
                    className="w-20 h-20 rounded-full border-4 border-[#FF7C71]/20 object-cover bg-slate-100"
                  />
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{provider.name}</h3>
                  <p className="text-xs text-[#FF7C71] font-semibold">{provider.specialty}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center justify-center gap-1 text-xs text-slate-400 font-medium">
                <MapPin size={12} />
                {provider.location}
              </div>

              {/* Rating + Jobs */}
              <div className="flex items-center justify-center gap-4 py-3 border-y border-slate-100">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-slate-800">{provider.rating}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{provider.reviews} reviews</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center">
                  <p className="text-sm font-black text-slate-800">{provider.jobs}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Jobs done</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {provider.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Book CTA */}
              <Link
                href="/services"
                className="w-full text-center text-xs font-bold text-white bg-gradient-to-r from-[#FF7C71] to-rose-600 py-2.5 rounded-xl shadow-md shadow-rose-300/30 hover:shadow-rose-400/40 transition-all active:scale-[0.98]"
              >
                Book Now
              </Link>
            </motion.div>
          ))}
        </motion.div>


      </div>
    </section>
  );
}
