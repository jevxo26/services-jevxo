"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Award } from "lucide-react";

// Clean Data Architecture - Dynamic configurations
const WHY_CHOOSE_US_CONTENT = {
  title: "Why Choose Us",
  subtitle: "Because we care about your safety",
  features: [
    {
      title: "Verified Professionals",
      description: "Every service provider undergoes a rigorous multi-step background check.",
      icon: ShieldCheck,
    },
    {
      title: "Safe Payments",
      description: "Secure online transactions with local and international payment methods.",
      icon: CreditCard,
    },
    {
      title: "Quality Guarantee",
      description: "We ensure the highest service quality with a money-back guarantee.",
      icon: Award,
    }
  ]
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
} as const;

const itemVariants = {
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

export default function WhyChooseUs() {
  return (
    <div className="bg-transparent py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Title block */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {WHY_CHOOSE_US_CONTENT.title}
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-md mx-auto">
            {WHY_CHOOSE_US_CONTENT.subtitle}
          </p>
        </div>

        {/* Dynamic Features Grid */}
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
                key={i}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="text-center p-8 md:p-10 bg-gradient-to-b from-white to-slate-50/50 rounded-[32px] border border-slate-100 hover:border-[#FF5A5F]/10 shadow-xs hover:shadow-[0_25px_50px_-12px_rgba(15,23,42,0.04)] transition-all duration-300 flex flex-col justify-center h-full relative overflow-hidden"
              >
                {/* 3D Circular Floating Icon Badge */}
                <div className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#FF5A5F] mb-6 shadow-[0_8px_24px_rgba(255,90,95,0.15)] border border-slate-100/50 relative hover:scale-105 transition-transform duration-300">
                  {/* Concentric red boundary highlight */}
                  <div className="absolute inset-1 rounded-full border border-[#FF5A5F]/5 bg-slate-50/10" />
                  <IconComponent className="w-6 h-6 relative z-10" />
                </div>
                
                <h3 className="font-extrabold text-slate-900 text-lg md:text-xl mb-3">
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
