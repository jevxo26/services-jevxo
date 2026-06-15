"use client";

import React, { useRef, useEffect } from "react";
import { Search, SlidersHorizontal, Map as MapIcon, List as ListIcon, Star, CheckCircle2, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Expert } from "./types";

interface SidebarListProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  activeTab: "map" | "list";
  setActiveTab: (tab: "map" | "list") => void;
  filteredExperts: Expert[];
  selectedExpertId: string;
  setSelectedExpertId: (id: string) => void;
  onOpenFilters: () => void;
}

const CATEGORIES = [
  "All Services",
  "AC Repair",
  "Plumbing",
  "Cleaning",
  "Electrical",
  "Shifting",
  "CCTV",
  "Appliance Repair",
  "Painting",
  "Gardening",
  "Pest Control",
  "Home Salon",
  "Carpentry"
];

export default function SidebarList({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  activeTab,
  setActiveTab,
  filteredExperts,
  selectedExpertId,
  setSelectedExpertId,
  onOpenFilters
}: SidebarListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);

  return (
    <div className="w-full md:w-[380px] bg-white border border-slate-200 rounded-3xl flex flex-col h-[60vh] md:h-full z-10 shadow-md overflow-hidden">
      {/* Sidebar Header Filters */}
      <div className="p-4 border-b border-slate-100 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services in Dhaka..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm placeholder-slate-400 text-slate-800 outline-none focus:bg-white focus:border-[#FF5A5F] focus:ring-1 focus:ring-red-200 transition-all"
          />
        </div>

        {/* Horizontal category scroll chips */}
        <div 
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
        >
          {CATEGORIES.map((cat) => (
            <Button
              variant="ghost"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 h-auto rounded-full text-xs font-bold whitespace-nowrap tracking-wide border transition-all duration-200 cursor-pointer flex-shrink-0 hover:bg-slate-50 ${
                selectedCategory === cat
                  ? "bg-[#FF5A5F] border-[#FF5A5F] text-white shadow-sm hover:bg-[#FF5A5F] hover:text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
              }`}
            >
              {cat}
            </Button>
          ))}        </div>

        {/* Tab switcher and filters trigger */}
        <div className="flex items-center justify-between">
          <div className="bg-slate-100 p-1 rounded-full flex items-center w-40">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("map")}
              className={`flex-1 py-1 h-auto rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === "map"
                  ? "bg-[#FF5A5F] hover:bg-[#FF5A5F]/90 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Map
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("list")}
              className="flex-1 py-1 h-auto rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
            >
              <ListIcon className="w-3.5 h-3.5" />
              List
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={onOpenFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 transition-colors shadow-xs cursor-pointer h-auto"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </Button>
        </div>
      </div>

      {/* Sidebar List Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
        <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase px-1">
          Nearby Professionals ({filteredExperts.length})
        </h3>

        {filteredExperts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-6">
            <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No experts found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting search queries or matching filter ranges.</p>
          </div>
        ) : (
          filteredExperts.map((expert) => {
            const isSelected = selectedExpertId === expert.id;
            return (
              <div
                key={expert.id}
                onClick={() => setSelectedExpertId(expert.id)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative bg-white ${
                  isSelected
                    ? "border-[#FF5A5F] shadow-[0_8px_30px_rgb(255,90,95,0.06)] ring-1 ring-red-100"
                    : "border-slate-100 hover:border-slate-300 shadow-sm"
                }`}
              >
                {/* Rating floating badge */}
                <div className="absolute top-4 right-4 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5 flex items-center gap-1 text-[11px] font-extrabold text-amber-700">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {expert.rating}
                </div>

                {/* Top: Header Metadata */}
                <div>
                  <span className="text-[10px] font-extrabold tracking-wider bg-rose-50 border border-rose-100 text-[#FF5A5F] px-2.5 py-0.5 rounded-full inline-block mb-2 uppercase">
                    {expert.category}
                  </span>
                  
                  <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                    {expert.name}
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                  </h4>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 pr-12 leading-relaxed">
                    {expert.description}
                  </p>
                </div>

                {/* Bottom: Location & Pricing */}
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400 font-semibold">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                    <span className="truncate max-w-[150px]">{expert.location} ({expert.distance})</span>
                  </div>
                  
                  <div className="font-black text-slate-900 text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">STARTING AT</span>
                    <span className="text-[#FF5A5F] text-sm font-black">৳{expert.price}+</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
