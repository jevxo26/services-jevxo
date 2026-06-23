import {
  Zap,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";


export function CategorizedHero({ name, description }: { name?: string; description?: string }) {
  const displayName = name || "Certified Electrical Experts in Dhaka";
  const displayDesc = description || "From flickering lights to full-house wiring, our certified technicians ensure your home's safety with premium electrical solutions.";

  return (
    <div className="py-12 md:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Urgent Badge */}
            <div className="inline-flex items-center gap-2 bg-[#fff0f0] text-[#FF7C71] px-4 py-1.5 rounded-full text-sm font-semibold">
              <Zap className="w-4 h-4" />
              Urgent Repairs Available 24/7
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-5xl max-w-xl font-bold leading-tight">
              {displayName}
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              {displayDesc}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#FF7C71] hover:bg-[#E5675D] text-white px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg"
              >
                Book Urgent Repair
                <span className="text-xl">→</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-slate-200 hover:border-slate-300 px-8 py-3.5 rounded-full font-semibold text-slate-700 transition-all"
              >
                View Rate Card
              </motion.button>
            </div>
          </div>

          {/* Right Side - ISO Certified Card */}
          <div className="relative">
            <div className="bg-rose-100 w-55 h-55 md:w-77 md:h-77 lg:w-111 lg:h-111 rounded-2xl" />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white absolute -bottom-5 left-1/2 -translate-x-1/2 md:left-22 lg:left-33 rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-[340px] border border-slate-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#fff0f0] rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-[#FF7C71]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">ISO Certified</p>
                  <p className="text-sm text-slate-500">Safety Standard 2024</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
