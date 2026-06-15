"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  X, Star, SlidersHorizontal, Check, Search, MapPin, Calendar,
  ChevronDown, Sparkles, Wind, Wrench, Zap, PaintRoller, Camera,
  Truck, Settings2, TrendingUp, ArrowUpNarrowWide, ArrowDownNarrowWide,
  Clock, CalendarDays, Siren,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ServiceListing {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  categoryLabel: string;
  price: number;
  priceDisplay: string;
  done: string;
  rating: number;
  availability: string[];
  daysAgo: number;
}

interface TrendingService {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  reviews: string;
  price: number;
  badge?: string;
  featured: boolean;
}

interface FilterState {
  activeCategory: string;
  searchQuery: string;
  selectedRating: string;
  sortBy: string;
  priceMax: number;
  selectedAvailability: string[];
  currentPage: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRICE_FLOOR = 500;
const PRICE_CEIL = 5000;
const PER_PAGE = 6;

const SERVICE_CATEGORIES = [
  { id: "premium-deep-cleaning", label: "Cleaning", icon: "🧹" },
  { id: "master-ac-service", label: "AC Repair", icon: "❄️" },
  { id: "expert-plumbing", label: "Plumbing", icon: "🔧" },
  { id: "electrical-solution", label: "Electrical", icon: "⚡" },
  { id: "luxe-painting", label: "Painting", icon: "🎨" },
  { id: "cctv", label: "CCTV", icon: "📷" },
  { id: "premium-shifting", label: "Shifting", icon: "🚚" },
  { id: "appliance-repair", label: "Appliance Repair", icon: "🔌" },
] as const;

const FILTER_CATEGORIES = [
  { id: "cleaning", label: "Cleaning", icon: Sparkles },
  { id: "ac-repair", label: "AC Repair", icon: Wind },
  { id: "plumbing", label: "Plumbing", icon: Wrench },
  { id: "electrical", label: "Electrical", icon: Zap },
  { id: "painting", label: "Painting", icon: PaintRoller },
  { id: "cctv", label: "CCTV", icon: Camera },
  { id: "shifting", label: "Shifting", icon: Truck },
  { id: "appliance", label: "Appliance", icon: Settings2 },
];

const RATING_OPTIONS = [
  { value: "5.0", label: "5.0 only" },
  { value: "4.5", label: "4.5 & up" },
  { value: "4.0", label: "4.0 & up" },
];

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity", icon: TrendingUp },
  { value: "price-low", label: "Price: Low → High", icon: ArrowUpNarrowWide },
  { value: "price-high", label: "Price: High → Low", icon: ArrowDownNarrowWide },
  { value: "rating", label: "Rating", icon: Star },
  { value: "newest", label: "Newest first", icon: Sparkles },
];

const AVAILABILITY_OPTIONS = [
  { id: "today", label: "Today", icon: Clock },
  { id: "weekend", label: "This weekend", icon: CalendarDays },
  { id: "emergency", label: "Emergency (24h)", icon: Siren },
];

const TRENDING_SERVICES: TrendingService[] = [
  {
    id: "premium-deep-cleaning",
    title: "Premium Deep Cleaning",
    description: "Full home sanitization using industrial equipment. Perfect for move-ins or seasonal refreshes.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    rating: 4.9, reviews: "2.4k", price: 4500, badge: "MOST BOOKED", featured: true,
  },
  {
    id: "master-ac-service",
    title: "Master AC Service",
    description: "Comprehensive cleaning and gas top-up for all split AC brands.",
    image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=600&auto=format&fit=crop",
    rating: 4.8, reviews: "1.8k", price: 1200, badge: "5.0 ★", featured: false,
  },
];

const SERVICE_LISTINGS: ServiceListing[] = [
  { id: "luxury-wall-painting", title: "Luxury Wall Painting", description: "Italian finish textures and moisture-proof coating.", image: "/images/service/service-3.png", category: "painting", categoryLabel: "Painting", price: 15, priceDisplay: "৳15/sq.ft", done: "3k+ done", rating: 4.8, availability: ["weekend"], daysAgo: 2 },
  { id: "emergency-leak-repair", title: "Emergency Leak Repair", description: "60-minute response for all plumbing emergencies.", image: "/images/service/service-4.png", category: "plumbing", categoryLabel: "Plumbing", price: 600, priceDisplay: "৳600", done: "1.2k+ done", rating: 4.6, availability: ["today", "emergency"], daysAgo: 5 },
  { id: "smart-home-setup", title: "Smart Home Setup", description: "Installation of smart switches, hubs and automation.", image: "/images/service/service-5.png", category: "electrical", categoryLabel: "Electrical", price: 2500, priceDisplay: "৳2,500", done: "800+ done", rating: 4.7, availability: ["today", "weekend"], daysAgo: 1 },
  { id: "refrigerator-servicing", title: "Refrigerator Servicing", description: "Gas charge, compressor checks and cooling fixes.", image: "/images/service/service-6.png", category: "appliance", categoryLabel: "Appliance", price: 1500, priceDisplay: "৳1,500", done: "2.1k+ done", rating: 4.5, availability: ["today"], daysAgo: 10 },
  { id: "sofa-carpet-shampoo", title: "Sofa & Carpet Shampoo", description: "Deep vacuuming and shampooing for all fabric types.", image: "/images/service/service-7.png", category: "cleaning", categoryLabel: "Cleaning", price: 800, priceDisplay: "৳800/seat", done: "4k+ done", rating: 4.9, availability: ["today", "weekend"], daysAgo: 7 },
  { id: "cabinet-wood-polishing", title: "Cabinet Wood Polishing", description: "Restore the natural shine of your premium wood.", image: "/images/service/service-8.png", category: "painting", categoryLabel: "Renovation", price: 3500, priceDisplay: "৳3,500", done: "500+ done", rating: 4.4, availability: ["weekend"], daysAgo: 15 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildURL(params: Record<string, string>): string {
  const filtered = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
  const qs = new URLSearchParams(filtered).toString();
  return qs ? `?${qs}` : "";
}

function slug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${checked ? "bg-[#ff5a5f]" : "bg-[#e5e7eb]"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12} strokeWidth={0} className={i <= Math.round(rating) ? "fill-[#f59e0b]" : "fill-[#e5e7eb]"} />
      ))}
    </span>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (f: Partial<FilterState>) => void;
  ratingCounts: Record<string, number>;
  resultCount: number;
  onClearAll: () => void;
}

function FilterPanel({ isOpen, onClose, filters, setFilters, ratingCounts, resultCount, onClearAll }: FilterPanelProps) {
  const { activeCategory, searchQuery, selectedRating, sortBy, priceMax, selectedAvailability } = filters;
  const fillPct = ((priceMax - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100;

  // Active filter chips
  const chips: { label: string; onRemove: () => void }[] = [];
  if (activeCategory !== "all") {
    const cat = FILTER_CATEGORIES.find(c => c.id === activeCategory);
    chips.push({ label: cat?.label ?? activeCategory, onRemove: () => setFilters({ activeCategory: "all", currentPage: 1 }) });
  }
  if (searchQuery) chips.push({ label: `"${searchQuery}"`, onRemove: () => setFilters({ searchQuery: "", currentPage: 1 }) });
  if (selectedRating) chips.push({ label: `${selectedRating}+ ★`, onRemove: () => setFilters({ selectedRating: "", currentPage: 1 }) });
  if (priceMax < PRICE_CEIL) chips.push({ label: `≤ ৳${priceMax.toLocaleString()}`, onRemove: () => setFilters({ priceMax: PRICE_CEIL, currentPage: 1 }) });
  selectedAvailability.forEach(slot => {
    const opt = AVAILABILITY_OPTIONS.find(o => o.id === slot);
    chips.push({ label: opt?.label ?? slot, onRemove: () => setFilters({ selectedAvailability: selectedAvailability.filter(a => a !== slot), currentPage: 1 }) });
  });

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`
          fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[88vh] overflow-y-auto
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          md:static md:translate-y-0 md:max-h-none md:rounded-2xl md:shadow-md md:border md:border-[#e5e7eb]
          md:w-72 md:shrink-0 md:sticky md:top-24 md:h-fit
          p-5 md:p-6
        `}
        role="dialog" aria-modal="true" aria-label="Service filters"
      >
        {/* Drag handle (mobile) */}
        <div className="md:hidden w-10 h-1 bg-[#d1d5db] rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#ff5a5f]" strokeWidth={2.5} />
            <h3 className="text-base font-bold text-[#1a1a1a] m-0">Filters</h3>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="text-sm font-semibold text-[#6b7280] hover:text-[#ff5a5f] transition-colors" onClick={onClearAll}>
              Clear all
            </button>
            <button type="button" className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-[#f3f4f6] text-[#6b7280] hover:text-[#ff5a5f] transition-colors" onClick={onClose} aria-label="Close filters">
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Active chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {chips.map((chip, i) => (
              <span key={i} className="flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-[#fff0ef] text-[#ff5a5f] text-xs font-semibold border border-[#ffd0d1]">
                {chip.label}
                <button type="button" onClick={chip.onRemove} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#ff5a5f]/20 transition-colors">
                  <X size={10} strokeWidth={3} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Category */}
        <section className="mb-5">
          <h4 className="text-[10px] font-bold text-[#9ca3af] tracking-widest mb-3 uppercase">Category</h4>
          <div className="grid grid-cols-2 gap-2">
            {FILTER_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id} type="button"
                  onClick={() => setFilters({ activeCategory: isActive ? "all" : cat.id, currentPage: 1 })}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${isActive ? "border-[#ff5a5f] bg-[#fff0ef] text-[#ff5a5f]" : "border-[#e5e7eb] text-[#4b5563] hover:border-[#ff5a5f] hover:text-[#ff5a5f]"}`}
                >
                  <Icon size={14} strokeWidth={2.5} className="shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Price Range */}
        <section className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-bold text-[#9ca3af] tracking-widest uppercase">Price Range</h4>
            <span className="text-xs font-semibold text-[#ff5a5f] bg-[#fff0ef] px-2 py-0.5 rounded-md">
              ৳{PRICE_FLOOR.toLocaleString()}–{priceMax.toLocaleString()}
            </span>
          </div>
          <div className="relative h-1.5 bg-[#e5e7eb] rounded-full mb-3">
            <div className="absolute h-full bg-[#ff5a5f] rounded-full" style={{ width: `${fillPct}%` }} />
            <input
              type="range" min={PRICE_FLOOR} max={PRICE_CEIL} step={100} value={priceMax}
              onChange={e => setFilters({ priceMax: Number(e.target.value), currentPage: 1 })}
              className="absolute w-full h-1.5 top-0 left-0 appearance-none bg-transparent z-10 cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ff5a5f]
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
              aria-label="Maximum price"
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#9ca3af] font-medium">
            <span>৳{PRICE_FLOOR.toLocaleString()}</span>
            <span>৳{PRICE_CEIL.toLocaleString()}</span>
          </div>
        </section>

        {/* Min Rating */}
        <section className="mb-5">
          <h4 className="text-[10px] font-bold text-[#9ca3af] tracking-widest mb-3 uppercase">Min Rating</h4>
          <div className="flex flex-col gap-2">
            {RATING_OPTIONS.map(opt => {
              const isActive = selectedRating === opt.value;
              return (
                <label key={opt.value} className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${isActive ? "border-[#ff5a5f] bg-[#fff0ef]" : "border-[#e5e7eb] hover:border-[#ff5a5f]/50"}`}>
                  <span className="flex items-center gap-2">
                    <input
                      type="radio" name="rating" value={opt.value} checked={isActive}
                      onChange={() => setFilters({ selectedRating: isActive ? "" : opt.value, currentPage: 1 })}
                      className="w-3.5 h-3.5 accent-[#ff5a5f] cursor-pointer"
                    />
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a1a]">
                      <Star size={12} className="fill-[#f59e0b] text-[#f59e0b]" strokeWidth={0} />
                      {opt.label}
                    </span>
                  </span>
                  <span className="text-[10px] font-semibold text-[#9ca3af] bg-[#f3f4f6] px-2 py-0.5 rounded-md">
                    {ratingCounts[opt.value] ?? 0}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Sort By */}
        <section className="mb-5">
          <h4 className="text-[10px] font-bold text-[#9ca3af] tracking-widest mb-3 uppercase">Sort By</h4>
          <div className="flex flex-col gap-2">
            {SORT_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const isActive = sortBy === opt.value;
              return (
                <button
                  key={opt.value} type="button"
                  onClick={() => setFilters({ sortBy: opt.value, currentPage: 1 })}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${isActive ? "border-[#ff5a5f] bg-[#fff0ef] text-[#ff5a5f]" : "border-[#e5e7eb] text-[#4b5563] hover:border-[#ff5a5f]/50"}`}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={14} strokeWidth={2.5} />
                    {opt.label}
                  </span>
                  {isActive && <Check size={14} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Availability */}
        <section>
          <h4 className="text-[10px] font-bold text-[#9ca3af] tracking-widest mb-3 uppercase">Availability</h4>
          <div className="flex flex-col gap-3">
            {AVAILABILITY_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const checked = selectedAvailability.includes(opt.id);
              return (
                <div key={opt.id} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#1a1a1a]">
                    <Icon size={14} className="text-[#9ca3af]" strokeWidth={2.5} />
                    {opt.label}
                  </span>
                  <ToggleSwitch
                    checked={checked} label={opt.label}
                    onChange={() => setFilters({
                      selectedAvailability: checked
                        ? selectedAvailability.filter(a => a !== opt.id)
                        : [...selectedAvailability, opt.id],
                      currentPage: 1,
                    })}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Mobile Apply button */}
        <div className="md:hidden sticky bottom-0 bg-white pt-4 mt-5 -mx-5 px-5 border-t border-[#f3f4f6]">
          <button type="button" onClick={onClose} className="w-full py-3 rounded-xl bg-[#ff5a5f] text-white font-bold text-sm shadow-lg hover:bg-[#e04a4f] active:scale-95 transition-all">
            Show {resultCount} result{resultCount !== 1 ? "s" : ""}
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: ServiceListing }) {
  return (
    <Link
      href={`/services/${service.id}`}
      className="group bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm no-underline flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-[#ff5a5f]"
    >
      <div className="relative h-48 overflow-hidden">
        <Image src={service.image} alt={service.title} fill style={{ objectFit: "cover" }} className="transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute top-3 left-3 py-1 px-2.5 bg-white/95 text-[#1a1a1a] text-[10px] font-bold rounded-lg uppercase tracking-wide shadow-sm">
          {service.categoryLabel}
        </span>
        <span className="absolute top-3 right-3 flex items-center gap-1 py-1 px-2 bg-white/95 rounded-lg text-[10px] font-bold text-[#1a1a1a] shadow-sm">
          <Star size={10} className="fill-[#f59e0b] text-[#f59e0b]" strokeWidth={0} />
          {service.rating}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-1 leading-snug">{service.title}</h3>
        <p className="text-xs text-[#6b7280] leading-relaxed flex-1">{service.description}</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f3f4f6]">
          <span className="text-base font-extrabold text-[#ff5a5f]">{service.priceDisplay}</span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#9ca3af]">
            <Clock size={10} strokeWidth={2.5} />
            {service.done}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Service Listings ─────────────────────────────────────────────────────────

function ServiceListings({ filters, setFilters, onClearAll, isFilterOpen, setIsFilterOpen }: {
  filters: FilterState;
  setFilters: (f: Partial<FilterState>) => void;
  onClearAll: () => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (v: boolean) => void;
}) {
  const { activeCategory, searchQuery, selectedRating, sortBy, priceMax, selectedAvailability, currentPage } = filters;

  const filteredListings = useMemo(() => {
    let list = [...SERVICE_LISTINGS];
    if (activeCategory !== "all") list = list.filter(s => s.category === activeCategory);
    if (searchQuery) { const q = searchQuery.toLowerCase(); list = list.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)); }
    if (selectedRating) list = list.filter(s => s.rating >= parseFloat(selectedRating));
    list = list.filter(s => s.price <= priceMax);
    if (selectedAvailability.length) list = list.filter(s => selectedAvailability.every(slot => s.availability.includes(slot)));
    switch (sortBy) {
      case "price-low": list.sort((a, b) => a.price - b.price); break;
      case "price-high": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "newest": list.sort((a, b) => a.daysAgo - b.daysAgo); break;
    }
    return list;
  }, [activeCategory, searchQuery, selectedRating, sortBy, priceMax, selectedAvailability]);

  const totalPages = Math.ceil(filteredListings.length / PER_PAGE);
  const pagedItems = filteredListings.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const ratingCounts = useMemo(() => {
    const base = SERVICE_LISTINGS.filter(s => {
      if (activeCategory !== "all" && s.category !== activeCategory) return false;
      if (searchQuery) { const q = searchQuery.toLowerCase(); if (!s.title.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) return false; }
      if (s.price > priceMax) return false;
      if (selectedAvailability.length && !selectedAvailability.every(slot => s.availability.includes(slot))) return false;
      return true;
    });
    return RATING_OPTIONS.reduce<Record<string, number>>((acc, opt) => {
      acc[opt.value] = base.filter(s => s.rating >= parseFloat(opt.value)).length;
      return acc;
    }, {});
  }, [activeCategory, searchQuery, priceMax, selectedAvailability]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (activeCategory !== "all") n++;
    if (selectedRating) n++;
    if (priceMax < PRICE_CEIL) n++;
    n += selectedAvailability.length;
    return n;
  }, [activeCategory, selectedRating, priceMax, selectedAvailability]);

  return (
    <section className="py-16 px-4 sm:px-6 bg-[#f9fafb]">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8">
        <FilterPanel
          isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}
          filters={filters} setFilters={setFilters}
          ratingCounts={ratingCounts} resultCount={filteredListings.length}
          onClearAll={onClearAll}
        />

        <div className="flex-1 min-w-0">
          {/* Mobile filter trigger + result count */}
          <div className="flex items-center justify-between mb-5 md:hidden">
            <button
              type="button" onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm font-semibold text-[#1a1a1a] shadow-sm"
            >
              <SlidersHorizontal size={16} className="text-[#ff5a5f]" strokeWidth={2.5} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#ff5a5f] text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <span className="text-xs font-semibold text-[#6b7280]">{filteredListings.length} result{filteredListings.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Desktop result count */}
          <div className="hidden md:flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1a1a1a]">
              All Services
              <span className="ml-2 text-sm font-normal text-[#9ca3af]">({filteredListings.length} results)</span>
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {pagedItems.map(service => <ServiceCard key={service.id} service={service} />)}
          </div>

          {/* Empty state */}
          {pagedItems.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white rounded-2xl border border-[#e5e7eb]">
              <div className="w-12 h-12 rounded-full bg-[#fff0ef] flex items-center justify-center text-[#ff5a5f] mb-4">
                <SlidersHorizontal size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-bold text-[#1a1a1a] mb-1">No services found</h3>
              <p className="text-sm text-[#6b7280] mb-5 max-w-xs">Try widening your filters or clearing your search.</p>
              <button type="button" onClick={onClearAll} className="px-6 py-2.5 rounded-xl bg-[#ff5a5f] text-white text-sm font-bold hover:bg-[#e04a4f] transition-all shadow-md">
                Clear filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e5e7eb] text-[#4b5563] text-lg disabled:opacity-40 hover:border-[#ff5a5f] hover:text-[#ff5a5f] transition-all"
                disabled={currentPage === 1}
                onClick={() => setFilters({ currentPage: Math.max(1, currentPage - 1) })}
                aria-label="Previous"
              >‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold border transition-all ${currentPage === page ? "bg-[#ff5a5f] text-white border-[#ff5a5f]" : "border-[#e5e7eb] text-[#4b5563] hover:border-[#ff5a5f] hover:text-[#ff5a5f]"}`}
                  onClick={() => setFilters({ currentPage: page })}
                >{page}</button>
              ))}
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e5e7eb] text-[#4b5563] text-lg disabled:opacity-40 hover:border-[#ff5a5f] hover:text-[#ff5a5f] transition-all"
                disabled={currentPage === totalPages}
                onClick={() => setFilters({ currentPage: Math.min(totalPages, currentPage + 1) })}
                aria-label="Next"
              >›</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Category Sections ────────────────────────────────────────────────────────

function CategorySection({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="py-14 px-4 sm:px-6 bg-white border-t border-[#f3f4f6]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-extrabold text-[#1a1a1a] border-b-2 border-[#ff5a5f] pb-1.5">{title}</h2>
          <Link href={href} className="text-sm font-bold text-[#ff5a5f] no-underline hover:underline">View all →</Link>
        </div>
        {children}
      </div>
    </section>
  );
}

function CategoryCleaning() {
  const items = [
    { title: "Deep Cleaning", desc: "Intensive whole-home sanitization.", icon: "🧹" },
    { title: "Kitchen Cleaning", desc: "Degreasing and detailed cabinet care.", icon: "🍳" },
    { title: "Bathroom Cleaning", desc: "Scale removal and sparkling sanitization.", icon: "🚿" },
  ];
  return (
    <CategorySection title="Cleaning" href="/services/cleaning">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {items.map(item => (
          <Link key={item.title} href={`/services/cleaning/${slug(item.title)}`}
            className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-md hover:border-[#ff5a5f] hover:-translate-y-0.5 transition-all duration-200 no-underline text-inherit"
          >
            <span className="text-3xl">{item.icon}</span>
            <h3 className="text-sm font-bold text-[#1a1a1a] m-0">{item.title}</h3>
            <p className="text-xs text-[#6b7280] m-0 leading-relaxed">{item.desc}</p>
          </Link>
        ))}
      </div>
    </CategorySection>
  );
}

function CategoryHomeRepairs() {
  const items = [
    { title: "AC Service", icon: "❄️" },
    { title: "Plumbing", icon: "🔧" },
    { title: "Electrical", icon: "⚡" },
    { title: "Carpentry", icon: "🪵" },
    { title: "Painting", icon: "🎨" },
  ];
  return (
    <CategorySection title="Home Repairs" href="/services/repairs">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {items.map(item => (
          <Link key={item.title} href={`/services/repairs/${slug(item.title)}`}
            className="flex flex-col items-center justify-center gap-2.5 p-5 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-md hover:border-[#ff5a5f] hover:-translate-y-0.5 transition-all duration-200 no-underline text-inherit min-h-[96px]"
          >
            <span className="text-2xl">{item.icon}</span>
            <h3 className="text-xs font-bold text-[#4b5563] tracking-wide uppercase m-0">{item.title}</h3>
          </Link>
        ))}
      </div>
    </CategorySection>
  );
}

function CategoryLifestyle() {
  return (
    <section className="py-14 px-4 sm:px-6 bg-white border-t border-[#f3f4f6]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <h2 className="text-2xl font-extrabold text-[#ff5a5f] mb-2">Lifestyle</h2>
          <p className="text-sm text-[#6b7280] max-w-md leading-relaxed m-0">Premium home salon, spa, and garden maintenance services.</p>
        </div>
        <Link href="/services/lifestyle" className="shrink-0 px-6 py-2.5 bg-[#ff5a5f] text-white text-sm font-bold rounded-xl hover:bg-[#e04a4f] transition-all shadow-md no-underline">
          Explore More
        </Link>
      </div>
    </section>
  );
}

function CategoryOtherServices() {
  const items = [
    { title: "Premium Shifting", desc: "Packers & movers for stress-free transitions.", href: "/services/premium-shifting", icon: "🚚" },
    { title: "CCTV & Security", desc: "Complete surveillance installation & setup.", href: "/services/cctv", icon: "📷" },
    { title: "Appliance Repair", desc: "Certified technicians for all home appliances.", href: "/services/appliance-repair", icon: "🔌" },
  ];
  return (
    <CategorySection title="Other Services" href="/services">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {items.map(item => (
          <Link key={item.title} href={item.href}
            className="flex flex-col gap-3 p-6 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-md hover:border-[#ff5a5f] hover:-translate-y-0.5 transition-all duration-200 no-underline text-inherit"
          >
            <span className="text-3xl">{item.icon}</span>
            <h3 className="text-sm font-bold text-[#1a1a1a] m-0">{item.title}</h3>
            <p className="text-xs text-[#6b7280] m-0 leading-relaxed">{item.desc}</p>
          </Link>
        ))}
      </div>
    </CategorySection>
  );
}

function CustomQuoteSection() {
  return (
    <section className="py-14 px-4 sm:px-6 bg-[#f9fafb] border-t border-[#f3f4f6]">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#fff0ef] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#ffd0d1]">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#ff5a5f] mb-3 leading-tight">Didn't find what you need?</h2>
            <p className="text-sm text-[#6b7280] leading-relaxed mb-0 max-w-sm">Tell us your requirement and we'll match you with the right professional within 24 hours.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button className="px-6 py-3 bg-[#ff5a5f] text-white text-sm font-bold rounded-xl shadow-lg hover:bg-[#e04a4f] hover:-translate-y-0.5 transition-all active:scale-95">
              Request Custom Quote
            </button>
            <button className="px-6 py-3 bg-white text-[#4b5563] text-sm font-bold rounded-xl border border-[#ffd0d1] hover:-translate-y-0.5 transition-all">
              📞 Call Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function ServicesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFiltersState] = useState<FilterState>({
    activeCategory: searchParams.get("category") || "all",
    searchQuery: searchParams.get("q") || "",
    selectedRating: searchParams.get("min_rating") || "",
    sortBy: searchParams.get("sort") || "popularity",
    priceMax: Number(searchParams.get("price_max")) || PRICE_CEIL,
    selectedAvailability: (searchParams.get("availability") || "").split(",").filter(Boolean),
    currentPage: Number(searchParams.get("page")) || 1,
  });

  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const setFilters = useCallback((partial: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  const syncURL = useCallback(() => {
    const { activeCategory, searchQuery, selectedRating, sortBy, priceMax, selectedAvailability, currentPage } = filters;
    const params: Record<string, string> = {
      category: activeCategory !== "all" ? activeCategory : "",
      q: searchQuery,
      min_rating: selectedRating,
      sort: sortBy !== "popularity" ? sortBy : "",
      price_max: priceMax < PRICE_CEIL ? String(priceMax) : "",
      availability: selectedAvailability.join(","),
      page: currentPage > 1 ? String(currentPage) : "",
    };
    router.replace(pathname + buildURL(params), { scroll: false });
  }, [filters, router, pathname]);

  useEffect(() => { syncURL(); }, [syncURL]);

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFilterOpen]);

  const handleClearAll = useCallback(() => {
    setFiltersState({ activeCategory: "all", searchQuery: "", selectedRating: "", sortBy: "popularity", priceMax: PRICE_CEIL, selectedAvailability: [], currentPage: 1 });
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#fff0ef] via-white to-[#fff7f7] py-10 md:py-16 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">

          {/* Badge */}
          <div className="flex justify-center lg:justify-start mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#ffe1e2] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a5f]" />
              <span className="text-xs font-semibold text-[#ff5a5f]">Trusted Home Services in Bangladesh</span>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a1a1a] leading-tight mb-3 max-w-3xl mx-auto lg:mx-0">
              Find the Best Home Services for Your Lifestyle
            </h1>
            <p className="text-sm md:text-base text-[#6b7280] max-w-xl mx-auto lg:mx-0 mb-8">
              Premium, reliable, and effortless home service solutions across Bangladesh.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full max-w-4xl mx-auto lg:mx-0 bg-white rounded-2xl shadow-lg border border-[#f3f4f6] p-2 mb-6">
            <div className="flex flex-col sm:flex-row items-stretch">

              {/* Category */}
              <div className="relative flex items-center gap-2 px-4 py-3 flex-1 min-w-0">
                <Search size={16} className="text-[#9ca3af] shrink-0" strokeWidth={2.5} />
                <select
                  value={filters.activeCategory}
                  onChange={e => setFilters({ activeCategory: e.target.value, currentPage: 1 })}
                  className="w-full bg-transparent outline-none text-sm font-semibold text-[#1a1a1a] appearance-none cursor-pointer pr-5"
                >
                  <option value="all">All Categories</option>
                  {FILTER_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 text-[#9ca3af] pointer-events-none" />
              </div>

              <div className="hidden sm:block w-px bg-[#f3f4f6] self-stretch" />

              {/* Location */}
              <div className="flex items-center gap-2 px-4 py-3 flex-1 min-w-0 border-t sm:border-t-0 border-[#f3f4f6]">
                <MapPin size={16} className="text-[#9ca3af] shrink-0" strokeWidth={2.5} />
                <input
                  type="text" placeholder="Enter location" value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm font-semibold text-[#1a1a1a] placeholder:text-[#9ca3af]"
                />
              </div>

              <div className="hidden sm:block w-px bg-[#f3f4f6] self-stretch" />

              {/* Date */}
              <div className="relative flex items-center gap-2 px-4 py-3 flex-1 min-w-0 border-t sm:border-t-0 border-[#f3f4f6]">
                <Calendar size={16} className="text-[#9ca3af] shrink-0" strokeWidth={2.5} />
                <input
                  type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                  className={`w-full bg-transparent outline-none text-sm font-semibold cursor-pointer ${selectedDate ? "text-[#1a1a1a]" : "text-transparent"}`}
                />
                {!selectedDate && <span className="absolute left-10 text-sm font-semibold text-[#9ca3af] pointer-events-none">Select Date</span>}
              </div>

              {/* CTA */}
              <div className="pt-2 sm:pt-0 sm:pl-2">
                <button type="button" className="w-full sm:w-auto px-6 py-3 bg-[#ff5a5f] hover:bg-[#e04a4f] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-8">
            {[["⭐", "4.9 Customer Rating"], ["👨‍🔧", "500+ Professionals"], ["🛡️", "Verified & Trusted"]].map(([icon, label]) => (
              <div key={label as string} className="flex items-center gap-1.5">
                <span>{icon}</span>
                <span className="text-xs font-medium text-[#6b7280]">{label}</span>
              </div>
            ))}
          </div>

          {/* Quick-nav category pills */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            {SERVICE_CATEGORIES.map(cat => (
              <Link
                key={cat.id} href={`/services/${cat.id}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border font-semibold text-xs transition-all duration-200 hover:-translate-y-0.5 no-underline border-[#e5e7eb] text-[#4b5563] bg-white hover:border-[#ff5a5f] hover:text-[#ff5a5f] hover:shadow-sm"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending ── */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-7">
            <div>
              <h2 className="text-2xl font-extrabold text-[#1a1a1a] border-b-2 border-[#ff5a5f] pb-1.5 inline-block">Trending Services</h2>
              <p className="text-sm text-[#6b7280] mt-1">Highly requested in Dhaka this month</p>
            </div>
            <Link href="#" className="text-sm font-bold text-[#ff5a5f] no-underline hover:underline">View all →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
            {/* Featured card */}
            {TRENDING_SERVICES.filter(s => s.featured).map(service => (
              <div key={service.id} className="grid grid-cols-1 sm:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-md border border-[#f3f4f6] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative min-h-[260px] sm:min-h-[auto] overflow-hidden">
                  <Image src={service.image} alt={service.title} fill style={{ objectFit: "cover" }} />
                  {service.badge && (
                    <span className="absolute top-3 left-3 py-1.5 px-3 bg-[#8b1a1a] text-white text-[10px] font-bold tracking-wider rounded-lg uppercase">{service.badge}</span>
                  )}
                </div>
                <div className="p-6 flex flex-col justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <Stars rating={service.rating} />
                    <span className="text-xs text-[#6b7280] font-semibold">({service.rating} • {service.reviews} reviews)</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1a1a1a] m-0 leading-snug">{service.title}</h3>
                  <p className="text-xs text-[#6b7280] leading-relaxed m-0">{service.description}</p>
                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-[#f3f4f6]">
                    <div>
                      <p className="text-[10px] font-bold text-[#9ca3af] tracking-widest uppercase mb-0.5">Starting from</p>
                      <p className="text-xl font-extrabold text-[#1a1a1a] m-0">৳{service.price.toLocaleString()}</p>
                    </div>
                    <Link href={`/services/${service.id}`} className="px-5 py-2.5 bg-[#ff5a5f] text-white text-xs font-bold rounded-full no-underline hover:bg-[#e04a4f] transition-all shadow-md">Book Now</Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Secondary cards */}
            {TRENDING_SERVICES.filter(s => !s.featured).map(service => (
              <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#f3f4f6] flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative h-44 overflow-hidden">
                  <Image src={service.image} alt={service.title} fill style={{ objectFit: "cover" }} />
                </div>
                <div className="p-5 flex flex-col flex-1 gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-[#1a1a1a] m-0 leading-snug">{service.title}</h3>
                    <span className="bg-[#fff8e1] text-[#b45309] px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap">★ {service.rating}</span>
                  </div>
                  <p className="text-xs text-[#6b7280] leading-relaxed m-0 flex-1">{service.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-[#f3f4f6]">
                    <span className="text-base font-extrabold text-[#1a1a1a]">৳{service.price.toLocaleString()}</span>
                    <Link href={`/services/${service.id}`} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f3f4f6] text-[#4b5563] no-underline hover:bg-[#ff5a5f] hover:text-white transition-all text-base font-bold" aria-label={`View ${service.title}`}>→</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Listings ── */}
      <ServiceListings
        filters={filters}
        setFilters={setFilters}
        onClearAll={handleClearAll}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      {/* ── Category sections ── */}
      <CategoryCleaning />
      <CategoryHomeRepairs />
      <CategoryLifestyle />
      <CategoryOtherServices />
      <CustomQuoteSection />
    </>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-400 text-sm">
        Loading services…
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}