"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, Workflow } from "lucide-react";

// Clean Data Architecture - Dynamic timeline step configurations
const HOW_IT_WORKS_CONTENT = {
  title: "How It Works",
  subtitle: "Get your household tasks solved in 4 simple, hassle-free steps",
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
    },
    {
      stepNumber: "04",
      title: "Pay & Relax",
      description: "Pay securely after the service is done and leave a review",
    }
  ]
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
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
      stiffness: 65,
      damping: 15
    }
  }
} as const;

const HowItWorks = () => {
  return (
    <div className="py-5 md:py-8 lg:py-10 overflow-hidden relative">
      {/* Decorative light blurs */}
      {/* <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#4F46E5]/5 blur-[90px] rounded-full pointer-events-none" /> */}

      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            <Workflow size={13} />
            Timeline
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <Workflow className="w-5 h-5 md:w-6 md:h-6 text-[#4F46E5]" />
            How It <span className="text-[#4F46E5]">Works</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {HOW_IT_WORKS_CONTENT.subtitle}
          </p>
        </div>

        {/* Timeline Path container */}
        <div className="relative">
          {/* Connecting SVG Arrow 1 (Desktop) */}
          <div className="absolute left-[15%] w-[18%] top-6 hidden lg:block z-0 pointer-events-none">
            <svg
              className="w-full h-8 text-[#4F46E5]"
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
          <div className="absolute left-[41%] w-[18%] top-6 hidden lg:block z-0 pointer-events-none">
            <svg
              className="w-full h-8 text-[#4F46E5]"
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

          {/* Connecting SVG Arrow 3 (Desktop) */}
          <div className="absolute left-[67%] w-[18%] top-6 hidden lg:block z-0 pointer-events-none">
            <svg
              className="w-full h-8 text-[#4F46E5]"
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
            viewport={{ once: true, amount: 0.15 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-12 z-10 relative"
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
                    className="w-20 h-20 bg-white group-hover:bg-primary group-hover:scale-105 border border-slate-200 text-slate-800 rounded-full flex items-center justify-center text-xl font-extrabold mb-3 sm:mb-6 shadow-lg relative z-10 group-hover:border-[#4F46E5]/40  group-hover:shadow-xl transition-all duration-300"
                  >
                    <span className="text-primary group-hover:text-white">
                      {step.stepNumber}
                    </span>
                  </motion.div>

                  <h3 className="font-extrabold text-slate-800 text-xl mb-2 sm:mb-3 group-hover:text-[#4F46E5] transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>

                {/* Vertical SVG Arrow for Mobile Screens */}
                {i < HOW_IT_WORKS_CONTENT.steps.length - 1 && (
                  <div className="flex sm:hidden my-0.5 items-center justify-center text-[#4F46E5] z-0 pointer-events-none">
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
