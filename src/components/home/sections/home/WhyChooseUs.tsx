"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Award } from "lucide-react";

const WHY_CHOOSE_US_CONTENT = {
  title: "Why Choose Us",
  subtitle: "Because we care about your safety",
  features: [
    {
      title: "Verified Professionals",
      description:
        "Every service provider undergoes a rigorous multi-step background check.",
      icon: ShieldCheck,
    },
    {
      title: "Safe Payments",
      description:
        "Secure online transactions with local and international payment methods.",
      icon: CreditCard,
    },
    {
      title: "Quality Guarantee",
      description:
        "We ensure the highest service quality with a money-back guarantee.",
      icon: Award,
    },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 14 },
  },
} as const;

export default function WhyChooseUs() {
  return (
    <div className="bg-transparent py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Title block */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-wide">
            {WHY_CHOOSE_US_CONTENT.title}
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-md mx-auto">
            {WHY_CHOOSE_US_CONTENT.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {WHY_CHOOSE_US_CONTENT.features.map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
                className="
                  group relative overflow-hidden
                  flex flex-col items-center justify-center
                  text-center h-full
                  rounded-[32px] p-8 md:p-10
                  bg-gradient-to-br from-white to-[#e8eaed]
                  border border-white/80
                  cursor-default
                  transition-all duration-300
                  shadow-[8px_8px_20px_rgba(174,180,190,0.55),_-6px_-6px_16px_rgba(255,255,255,0.95)]
                  hover:shadow-[12px_18px_30px_rgba(150,158,170,0.45),_-6px_-6px_18px_rgba(255,255,255,1)]
                "
              >
                {/* Top gloss sheen */}
                <span
                  className="
                    pointer-events-none absolute inset-x-0 top-0
                    h-1/2 rounded-t-[32px]
                    bg-gradient-to-b from-white/65 to-transparent
                  "
                  aria-hidden
                />

                {/* Icon orb */}
                <div
                  className="
                    relative overflow-hidden
                    w-20 h-20 rounded-full mb-8
                    flex items-center justify-center
                    bg-gradient-to-br from-[#f5f7fa] to-[#e8eaed]
                    shadow-[4px_4px_10px_rgba(174,180,190,0.5),_-4px_-4px_10px_rgba(255,255,255,1)]
                    transition-all duration-300
                    group-hover:from-[#ff6b6b] group-hover:to-[#e53935]
                    group-hover:shadow-[4px_4px_14px_rgba(229,57,53,0.35),_-3px_-3px_10px_rgba(255,200,200,0.6)]
                  "
                >
                  {/* Orb inner gloss */}
                  <span
                    className="
                      pointer-events-none absolute
                      top-[6px] left-[10px]
                      w-10 h-5 rounded-full
                      bg-[radial-gradient(ellipse,rgba(255,255,255,0.75)_0%,transparent_70%)]
                    "
                    aria-hidden
                  />
                  <IconComponent
                    className="
                      w-8 h-8 relative z-10
                      text-primary
                      transition-colors duration-300
                      group-hover:text-white
                    "
                  />
                </div>

                <h3 className="font-extrabold text-slate-900 text-xl mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
