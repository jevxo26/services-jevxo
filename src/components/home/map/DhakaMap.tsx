"use client";

import React, { useRef } from "react";
import { Compass, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaSnowflake, FaBroom, FaBolt, FaFaucet, FaPaintRoller } from "react-icons/fa";
import { TbTruck, TbScissors } from "react-icons/tb";
import { MdOutlineSecurity } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Expert } from "./types";

interface DhakaMapProps {
  filteredExperts: Expert[];
  selectedExpertId: string;
  setSelectedExpertId: (id: string) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function DhakaMap({
  filteredExperts,
  selectedExpertId,
  setSelectedExpertId,
  zoom,
  setZoom,
  pan,
  setPan,
  isDragging,
  setIsDragging,
  mapContainerRef
}: DhakaMapProps) {
  const dragStart = useRef({ x: 0, y: 0 });

  // Handle Drag / Pan mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan drag gestures for mobile layout compatibility
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.current.x,
      y: e.touches[0].clientY - dragStart.current.y
    });
  };

  const adjustZoom = (amount: number) => {
    setZoom((prev) => Math.max(0.75, Math.min(3, prev + amount)));
  };

  const resetMap = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setSelectedExpertId("zaman-ac");
  };

  const renderCategoryIcon = (iconName: string, className: string = "w-4 h-4") => {
    if (iconName === "ac") return <FaSnowflake className={className} />;
    if (iconName === "cleaning") return <FaBroom className={className} />;
    if (iconName === "plumbing") return <FaFaucet className={className} />;
    if (iconName === "shifting") return <TbTruck className={className} />;
    if (iconName === "painting") return <FaPaintRoller className={className} />;
    if (iconName === "cctv") return <MdOutlineSecurity className={className} />;
    if (iconName === "salon") return <TbScissors className={className} />;
    return <FaBolt className={className} />;
  };

  return (
    <div 
      ref={mapContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      className="flex-1 h-[50vh] md:h-full bg-[#FFF5F2] rounded-3xl border border-slate-200 shadow-md relative overflow-hidden select-none outline-none"
    >
      {/* SVG-based Stylized Dhaka Map Canvas */}
      <motion.div
        animate={{
          x: pan.x,
          y: pan.y,
          scale: zoom
        }}
        transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20 }}
        className="w-full h-full min-w-[800px] min-h-[600px] relative origin-center"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <svg
          viewBox="0 0 1000 800"
          className="w-full h-full object-cover select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft Background */}
          <rect width="1000" height="800" fill="#FFF5F2" />

          {/* Water / Lakes Grid */}
          {/* Banani Lake */}
          <path 
            d="M 320 50 Q 380 250 340 450 T 380 750" 
            fill="none" 
            stroke="#D6ECFF" 
            strokeWidth="32" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Gulshan Lake */}
          <path 
            d="M 520 80 Q 560 300 510 520 T 580 780" 
            fill="none" 
            stroke="#D6ECFF" 
            strokeWidth="36" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Dhanmondi Lake */}
          <path 
            d="M 120 450 C 140 500, 80 580, 160 680 S 130 750, 150 800" 
            fill="none" 
            stroke="#D6ECFF" 
            strokeWidth="24" 
            strokeLinecap="round" 
          />

          {/* Sector Accents */}
          <path d="M 50 50 L 300 50 L 300 400 L 50 400 Z" fill="#FFFFFF" fillOpacity="0.15" />
          <path d="M 360 80 L 500 80 L 500 500 L 360 500 Z" fill="#FFFFFF" fillOpacity="0.1" />

          {/* Major Roads Grid */}
          {/* Kemal Ataturk Avenue */}
          <line x1="100" y1="220" x2="520" y2="220" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
          <line x1="100" y1="220" x2="520" y2="220" stroke="#F1E3DF" strokeWidth="2" strokeLinecap="round" />
          
          {/* Gulshan Avenue */}
          <line x1="440" y1="100" x2="440" y2="600" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
          <line x1="440" y1="100" x2="440" y2="600" stroke="#F1E3DF" strokeWidth="2" strokeLinecap="round" />

          {/* Banani Road 11 */}
          <line x1="330" y1="310" x2="440" y2="310" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />

          {/* Mirpur Road */}
          <line x1="80" y1="300" x2="260" y2="780" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />

          {/* Satmasjid Road */}
          <line x1="140" y1="380" x2="140" y2="750" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />

          {/* Pragati Sarani */}
          <line x1="680" y1="80" x2="720" y2="720" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" />

          {/* District Labels */}
          <text x="210" y="160" fill="#EAD4CD" fontSize="18" fontWeight="900" letterSpacing="0.2em" textAnchor="middle">BANANI</text>
          <text x="440" y="150" fill="#EAD4CD" fontSize="18" fontWeight="900" letterSpacing="0.2em" textAnchor="middle">GULSHAN 2</text>
          <text x="630" y="120" fill="#EAD4CD" fontSize="18" fontWeight="900" letterSpacing="0.2em" textAnchor="middle">BARIDHARA</text>
          <text x="180" y="550" fill="#EAD4CD" fontSize="18" fontWeight="900" letterSpacing="0.2em" textAnchor="middle">DHANMONDI</text>

          {/* Landscaping Parks */}
          <circle cx="440" cy="310" r="14" fill="#E1F3E2" />
          <circle cx="210" cy="220" r="12" fill="#E1F3E2" />
        </svg>

        {/* Map Pins overlay layer */}
        {filteredExperts.map((expert) => {
          const isSelected = selectedExpertId === expert.id;
          return (
            <motion.div
              key={expert.id}
              style={{
                left: `${expert.coords.x}%`,
                top: `${expert.coords.y}%`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedExpertId(expert.id);
              }}
            >
              {/* Price Tooltip */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#FF5A5F] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md whitespace-nowrap flex flex-col items-center"
                  >
                    <span>৳{expert.price}</span>
                    <div className="w-2 h-2 bg-[#FF5A5F] rotate-45 -mt-1" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Map Pin Anchor Ring */}
              <motion.div
                animate={{
                  scale: isSelected ? 1.25 : 1.0,
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center border-2 shadow-md transition-colors duration-300 relative ${
                  isSelected
                    ? "bg-[#FF5A5F] border-white text-white"
                    : "bg-white border-[#FF5A5F]/20 text-[#FF5A5F]"
                }`}
              >
                {renderCategoryIcon(expert.icon, "w-4.5 h-4.5")}
                
                {/* Selected Pin Bottom Stem Line */}
                {isSelected && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-2 bg-[#FF5A5F]" />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-30">
        <Button
          variant="ghost"
          onClick={resetMap}
          className="w-12 h-12 p-0 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-700 hover:text-[#FF5A5F] shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer hover:bg-slate-50"
          title="Reset Map View"
        >
          <Compass className="w-5 h-5" />
        </Button>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col overflow-hidden">
          <Button
            variant="ghost"
            onClick={() => adjustZoom(0.25)}
            className="w-12 h-12 p-0 rounded-none flex items-center justify-center text-slate-700 hover:text-[#FF5A5F] hover:bg-slate-50 transition-colors border-b border-slate-100 cursor-pointer shadow-none"
          >
            <Plus className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => adjustZoom(-0.25)}
            className="w-12 h-12 p-0 rounded-none flex items-center justify-center text-slate-700 hover:text-[#FF5A5F] hover:bg-slate-50 transition-colors cursor-pointer shadow-none"
          >
            <Minus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
