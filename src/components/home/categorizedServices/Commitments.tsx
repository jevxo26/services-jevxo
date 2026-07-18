"use client";

import { Shield, Award, Wrench, Clock, HardHat } from "lucide-react";
import { motion } from "framer-motion";

const safetyFeatures = [
  { icon: Shield, label: "Insured Work" },
  { icon: HardHat, label: "PPE Mandatory" },
  { icon: Award, label: "License Verified" },
  { icon: Wrench, label: "Code Compliant" },
  { icon: Clock, label: "On-Time Arrival" },
];

export function Commitments() {
  return (
    <section className="py-6 w-full">
      <div className="bg-gradient-to-br from-[#1E4E8C]/15 to-[#1E4E8C]/5 rounded-[32px] p-6 md:p-8 border border-[#1E4E8C]/10">
        <h2 className="text-center text-xl md:text-2xl font-black text-[#1E4E8C] mb-8">
          Committed to Zero-Risk Safety
        </h2>

        <div className="flex flex-wrap justify-center items-start gap-x-8 gap-y-6 sm:gap-x-12 md:gap-x-16">
          {safetyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex flex-col items-center text-center group min-w-[90px] sm:min-w-[120px]"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_12px_rgba(30, 78, 140,0.08)] border border-[#1E4E8C]/10">
                <feature.icon className="w-6 h-6 text-[#1E4E8C]" />
              </div>
              <p className="font-bold text-slate-700 text-xs tracking-tight group-hover:text-[#1E4E8C] transition-colors">{feature.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}