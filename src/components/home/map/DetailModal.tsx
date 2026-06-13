"use client";

import React from "react";
import { Star, MapPin, CheckCircle2, Calendar, Phone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Expert } from "./types";

interface DetailModalProps {
  expert: Expert | null;
  onClose: () => void;
}

export default function DetailModal({ expert, onClose }: DetailModalProps) {
  return (
    <AnimatePresence>
      {expert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 relative flex flex-col max-h-[85vh]"
          >
            
            {/* Header Visual Cover */}
            <div className="p-6 bg-gradient-to-r from-rose-500 to-[#FF5A5F] text-white relative">
              <Button
                variant="ghost"
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 h-auto rounded-full cursor-pointer border-none outline-none"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <span className="text-[10px] font-extrabold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-2 uppercase">
                {expert.badge}
              </span>
              
              <h3 className="text-2xl font-black tracking-tight">{expert.name}</h3>
              <p className="text-xs text-white/95 mt-1 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {expert.location} ({expert.distance})
              </p>
            </div>

            {/* Main Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Scorecards */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Rating</span>
                  <span className="text-lg font-black text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    {expert.rating}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Jobs Done</span>
                  <span className="text-lg font-black text-slate-900 block mt-0.5">{expert.completedJobs}+</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Reviews</span>
                  <span className="text-lg font-black text-slate-900 block mt-0.5">{expert.reviews}</span>
                </div>
              </div>

              {/* About Profile */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">About Expert</h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  {expert.description}
                </p>
              </div>

              {/* Details info */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expertise Details</h4>
                
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Vetted Service Provider ({expert.status})</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <div className="w-7 h-7 rounded-lg bg-[#FF5A5F]/5 text-[#FF5A5F] flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span>Book online instantly with secure checkout</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>Direct Phone Support: {expert.phone}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Action booking footer */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Pricing</span>
                <span className="text-xl font-black text-slate-900">৳{expert.price.toLocaleString()}+</span>
              </div>

              <div className="flex gap-3">
                <a
                  href={`tel:${expert.phone}`}
                  className="p-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center"
                  title="Call Provider"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <Button
                  onClick={() => {
                    alert(`Successfully booked ${expert.name}!`);
                    onClose();
                  }}
                  className="px-6 py-3 bg-[#FF5A5F] hover:bg-[#FF4449] text-white font-bold rounded-xl text-sm shadow-sm transition-all active:scale-97 border-none cursor-pointer h-auto"
                >
                  Book Appointment
                </Button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
