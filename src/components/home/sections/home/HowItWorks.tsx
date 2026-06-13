"use client";

import React from "react";
import { motion } from "framer-motion";

// Clean Data Architecture - Dynamic timeline step configurations
const HOW_IT_WORKS_CONTENT = {
  title: "How It Works",
  subtitle: "Get your household tasks solved in 3 simple, hassle-free steps",
  steps: [
    {
      stepNumber: "01",
      title: "Select Service",
      description: "Choose from our wide range of premium, verified home services",
    },
    {
      stepNumber: "02",
      title: "Schedule",
      description: "Pick a convenient date and time that fits perfectly in your schedule",
    },
    {
      stepNumber: "03",
      title: "Get Service",
      description: "Relax while our certified expert takes care of everything professionally",
    }
  ]
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
} as const;

const nodeVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 14
    }
  }
} as const;

const HowItWorks = () => {
  return (
    <div className="bg-transparent border-y border-slate-100 py-12 md:py-16 lg:py-20 overflow-hidden relative">
      {/* Decorative light blurs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#FF5A5F]/5 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header Block */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-wide">
            {HOW_IT_WORKS_CONTENT.title}
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
            {HOW_IT_WORKS_CONTENT.subtitle}
          </p>
        </div>

        {/* Timeline Path container */}
        <div className="relative">
          {/* Connecting SVG Arrow 1 (Desktop) */}
          <div className="absolute left-[21%] w-[24%] top-6 hidden md:block z-0 pointer-events-none">
            <svg
              className="w-full h-8 text-[#FF5A5F]"
              viewBox="0 0 100 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M2 12H96M96 12L88 5M96 12L88 19"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 4"
                animate={{ strokeDashoffset: [0, -24] }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              />
            </svg>
          </div>

          {/* Connecting SVG Arrow 2 (Desktop) */}
          <div className="absolute left-[56%] w-[24%] top-6 hidden md:block z-0 pointer-events-none">
            <svg
              className="w-full h-8 text-[#FF5A5F]"
              viewBox="0 0 100 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M2 12H96M96 12L88 5M96 12L88 19"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 4"
                animate={{ strokeDashoffset: [0, -24] }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              />
            </svg>
          </div>

          {/* Staggered cardless step points */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-10 md:gap-8 lg:gap-16 z-10 relative"
          >
            {HOW_IT_WORKS_CONTENT.steps.map((step, i) => (
              <React.Fragment key={i}>
                <motion.div
                  variants={nodeVariants}
                  className="text-center group flex flex-col items-center"
                >
                  {/* Timeline Step node bubble */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="w-20 h-20 bg-white group-hover:bg-primary group-hover:scale-105 border border-slate-200 text-slate-800 rounded-full flex items-center justify-center text-xl font-extrabold mb-6 shadow-lg relative z-10 group-hover:border-[#FF5A5F]/40  group-hover:shadow-xl transition-all duration-300"
                  >
                    <span className="text-primary group-hover:text-white">
                      {step.stepNumber}
                    </span>
                  </motion.div>

                  <h3 className="font-extrabold text-slate-800 text-xl mb-3 group-hover:text-[#FF5A5F] transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>

                {/* Vertical SVG Arrow for Mobile Screens */}
                {i < 2 && (
                  <div className="flex md:hidden my-2 items-center justify-center text-[#FF5A5F] z-0 pointer-events-none">
                    <svg
                      className="w-6 h-10"
                      viewBox="0 0 24 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <motion.path
                        d="M12 2V36M12 36L6 30M12 36L18 30"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="6 4"
                        animate={{ strokeDashoffset: [0, 20] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: "linear",
                        }}
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
