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
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-br from-[#FF7C71]/20 to-[#FF7C71]/8 rounded-3xl p-8 md:p-12">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-[#FF7C71] mb-12">
            Committed to Zero-Risk Safety
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
            {safetyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 bg-[#fff0f0] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <feature.icon className="w-8 h-8 text-[#FF7C71]" />
                </div>
                <p className="font-semibold text-slate-800 text-sm">{feature.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}