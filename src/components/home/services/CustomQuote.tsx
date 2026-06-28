"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, MessageSquare } from "lucide-react";

interface CustomQuoteProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
}

export default function CustomQuote({
  title = "Didn't find what you need?",
  description = "Tell us your requirement and we'll match you with the right professional within 24 hours.",
  primaryButtonText = "Request Custom Quote",
  secondaryButtonText = "📞 Call Support",
  onPrimaryClick,
  onSecondaryClick,
  className = "",
}: CustomQuoteProps) {
  return (
    <section
      className={`max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-16 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-primary/10 to-primary/30 rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#ffd0d1] shadow-sm"
      >
        {/* Left Content */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#FF6014] leading-tight">
            {title}
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-md text-[15px]">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onPrimaryClick}
            className="px-8 py-4 bg-[#FF6014] hover:bg-[#E0530A] text-white font-semibold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
          >
            <MessageSquare className="w-5 h-5" />
            {primaryButtonText}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSecondaryClick}
            className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl border border-[#ffd0d1] transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
          >
            <Phone className="w-5 h-5" />
            {secondaryButtonText}
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
