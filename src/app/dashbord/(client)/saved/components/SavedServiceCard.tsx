"use client";

import React from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

interface SavedServiceCardProps {
  service: any;
  handleUnsave: (id: string | number, title: string) => void;
}

export default function SavedServiceCard({ service, handleUnsave }: SavedServiceCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden">
        <img
          src={
            service.image ||
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80"
          }
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Category badge */}
        {service.category?.name && (
          <span className="absolute top-3 left-3 py-1 px-2.5 bg-white/95 text-[10px] font-bold rounded-lg uppercase tracking-wide shadow-sm text-slate-700">
            {service.category.name}
          </span>
        )}
        {/* Remove heart */}
        <button
          onClick={() => handleUnsave(service.id, service.name)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-[#FF6014] text-white shadow-md hover:scale-110 transition-all cursor-pointer"
          aria-label="Remove from wishlist"
        >
          <Heart size={14} className="fill-white" />
        </button>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-sm line-clamp-1">{service.name}</h3>
            {service.reviews?.length > 0 && (
              <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                <Star size={11} className="fill-current" />
                {(
                  service.reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / service.reviews.length
                ).toFixed(1)}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 font-semibold line-clamp-2">
            {service.subtitle || (service.description ? service.description.replace(/<[^>]*>/g, "") : "Top-rated service.")}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50 gap-2">
          <Link
            href={`/services/${service.id}`}
            className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-all"
          >
            Details
          </Link>
          <Link
            href={`/categories/service/${service.slug || service.id}`}
            className="flex-1 text-center bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
