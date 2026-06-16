"use client";

import React from "react";
import { Smartphone, Download, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function AppDownload() {
  return (
    <div className="py-12 md:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-br from-[#FF5A5F]/80 to-[#FF3B4F]/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-16 w-80 h-80 bg-white/30 rounded-full blur-3xl" />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between relative z-10">
            {/* Left Content - Compact */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-5/12 text-white"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1 rounded-full mb-5">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">
                  4.9 • Trusted by 12,000+ users
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                Book Home Services{" "}
                <span className="opacity-90">Anywhere, Anytime</span>
              </h2>

              <p className="text-white/90 text-[17px] leading-relaxed mb-8 max-w-md">
                Instant booking, live tracking, expert professionals, and
                exclusive app-only offers.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 bg-white text-[#FF5A5F] hover:bg-slate-100 px-6 py-3.5 rounded-2xl transition-all shadow-lg"
                >
                  <Smartphone className="w-6 h-6" />
                  <div className="text-left text-sm">
                    <div className="text-xs opacity-70">Download on</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 bg-primary text-white  px-6 py-3.5 rounded-2xl transition-all shadow-lg"
                >
                  <Download className="w-6 h-6" />
                  <div className="text-left text-sm">
                    <div className="text-xs text-slate-200">GET IT ON</div>
                    <div className="font-semibold text-white">
                      Google Play
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Right Side - Phone Mockup (Smaller) */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: -6 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:w-5/12 flex justify-center"
            >
              <div className="relative w-[200px] h-[400px] bg-slate-900 rounded-[2.8rem] border-[11px] border-slate-800 shadow-2xl overflow-hidden hover:-rotate-10 transition-transform duration-500">
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30" />

                <div className="h-full bg-gradient-to-b from-slate-50 to-white p-2 pt-12 flex flex-col">
                  <div className="text-center mb-6">
                    <div className="inline-block bg-[#FF5A5F] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                      Rajseba
                    </div>
                    <p className="text-slate-500 text-sm">Home Services</p>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="bg-white rounded-2xl p-3 shadow">
                      <div className="text-sm text-center font-medium mb-3">
                        Quick Book
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {["🧹", "🔧", "💡"].map((e, i) => (
                          <div
                            key={i}
                            className="h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl"
                          >
                            {e}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#FF5A5F]/10 rounded-2xl p-4 text-center">
                      <p className="text-[#FF5A5F] font-semibold text-sm">
                        Next Slot
                      </p>
                      <p className="text-2xl font-bold text-slate-800">
                        Today 4:30 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
