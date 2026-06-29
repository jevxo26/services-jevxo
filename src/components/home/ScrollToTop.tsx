"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    setClicked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Reset click animation state after scroll completes
    setTimeout(() => {
      setClicked(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-[148px] right-[20px] md:bottom-24 md:right-[28px] z-[999]">
      <div className="relative flex items-center justify-center">
        {/* Premium breathing aura glow when active (scrolled down) */}
        {!isAtTop && (
          <motion.span
            animate={{
              scale: [1, 1.35, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF6014] to-[#FF7C71] blur-md pointer-events-none z-[-1]"
          />
        )}

        <motion.button
          animate={{
            borderRadius: isAtTop ? "14px" : "9999px",
            scale: isAtTop ? 0.82 : 1,
            opacity: isAtTop ? 0.45 : 1,
            y: isAtTop ? 8 : 0,
            pointerEvents: isAtTop ? "none" : "auto",
            boxShadow: isAtTop
              ? "0 4px 12px rgba(0, 0, 0, 0.02)"
              : "0 10px 25px rgba(255, 96, 20, 0.25)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          whileHover={{ 
            scale: 1.08,
            boxShadow: "0 14px 32px rgba(255, 96, 20, 0.4)"
          }}
          whileTap={{ scale: 0.92 }}
          onClick={handleClick}
          className="relative w-12 h-12 bg-gradient-to-r from-[#FF6014] to-[#FF7C71] text-white flex items-center justify-center border border-white/10 cursor-pointer overflow-hidden"
          aria-label="Scroll to top"
        >
          {/* Shimmer overlay effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Premium sliding chevron animation */}
          <div className="relative overflow-hidden w-5 h-5 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={clicked ? { y: -24, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute"
            >
              <ChevronUp size={20} className="stroke-[3]" />
            </motion.div>
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={clicked ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute"
            >
              <ChevronUp size={20} className="stroke-[3]" />
            </motion.div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
