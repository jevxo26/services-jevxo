import {
  Shield,
  Award,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";

const safetyFeatures = [
  { icon: Shield, label: "Insured Work" },
  { icon: Shield, label: "PPE Mandatory" },
  { icon: Award, label: "License Verified" },
  { icon: Wrench, label: "Code Compliant" },
];

export function Commitments() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-linear-to-br from-primary/25 to-primary/10 rounded-3xl p-8 md:p-12">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-primary mb-12">
            Committed to Zero-Risk Safety
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {safetyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 bg-[#fff0f0] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-[#FF7C71]" />
                </div>
                <p className="font-semibold text-slate-800">{feature.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
