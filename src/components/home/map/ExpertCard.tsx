"use client";

import React from "react";
import { Star, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Expert } from "./types";

interface ExpertCardProps {
  expert: Expert;
  onViewDetails: () => void;
}

export default function ExpertCard({ expert, onViewDetails }: ExpertCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-shadow p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 relative">
      
      {/* Left: Metadata block */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold tracking-wider bg-rose-50 border border-rose-100 text-[#FF5A5F] px-3 py-1 rounded-full uppercase">
            {expert.badge}
          </span>
          
          <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            {expert.rating}
            <span className="text-xs text-slate-400 font-bold ml-1">({expert.reviews} reviews)</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {expert.name}
          </h3>
          
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              {expert.location}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <div className="flex items-center gap-1.5 text-emerald-600">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              {expert.status}
            </div>
          </div>
        </div>

        <p className="text-sm md:text-base text-slate-500 leading-relaxed pr-0 md:pr-10">
          {expert.description}
        </p>
      </div>

      {/* Right: Booking price action block */}
      <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-4">
        <div>
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
            Starting At
          </span>
          <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            ৳{expert.price.toLocaleString()}
          </span>
        </div>

        <Button
          onClick={onViewDetails}
          className="px-6 py-3 bg-[#FF5A5F] hover:bg-[#FF4449] text-white font-bold rounded-2xl text-sm md:text-base transition-all shadow-sm hover:shadow-md active:scale-97 text-center w-auto md:w-full cursor-pointer h-auto"
        >
          View Details
        </Button>
      </div>

    </div>
  );
}
