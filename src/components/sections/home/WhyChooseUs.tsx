"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaUserShield, FaLock, FaAward } from "react-icons/fa";

// Clean Data Architecture - Dynamic configurations
const WHY_CHOOSE_US_CONTENT = {
  title: "Why Choose Us",
  subtitle: "We connect you with the best local service professionals",
  features: [
    {
      title: "Verified Professionals",
      description: "Every service provider is background checked and highly rated",
      icon: FaUserShield,
      bg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Safe Payments",
      description: "Pay securely online and only release funds when you are 100% satisfied",
      icon: FaLock,
      bg: "bg-amber-50 text-amber-600",
    },
    {
      title: "Quality Guarantee",
      description: "Not happy with the result? We will send another expert at no extra cost",
      icon: FaAward,
      bg: "bg-rose-50 text-rose-600",
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

const WhyChooseUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 lg:py-24 overflow-hidden">
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
              className="text-center p-6 bg-white rounded-3xl border border-slate-100 hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)] transition-all duration-300"
            >
              <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm ${feature.bg}`}>
                <IconComponent className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-xl mb-3">
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
  );
};

export default WhyChooseUs;
