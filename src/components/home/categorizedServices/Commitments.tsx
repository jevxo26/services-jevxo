"use client";

import { Shield, Award, Wrench, Clock } from "lucide-react";
import { motion } from "framer-motion";

const safetyFeatures = [
  { icon: Shield, label: "Insured Work" },
  { icon: Shield, label: "PPE Mandatory" },
  { icon: Award, label: "License Verified" },
  { icon: Wrench, label: "Code Compliant" },
  { icon: Clock, label: "On-Time Arrival" },
];

export function Commitments() {
  return (
    <section className="py-6 w-full">
      <div className="bg-gradient-to-br from-[#FF6014]/15 to-[#FF6014]/5 rounded-[32px] p-6 md:p-8 border border-[#FF6014]/10">
        <h2 className="text-center text-xl md:text-2xl font-black text-[#FF6014] mb-8">
          Committed to Zero-Risk Safety
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {safetyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs border border-rose-100/50">
                <feature.icon className="w-6 h-6 text-[#FF6014]" />
              </div>
              <p className="font-bold text-slate-700 text-xs">{feature.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}