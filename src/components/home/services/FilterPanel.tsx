"use client"
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  CalendarDays,
  Check,
  Clock,
  Siren,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaBolt, FaBug, FaFaucet, FaLeaf, FaPaintRoller, FaTv } from "react-icons/fa";
import { MdOutlineCleaningServices, MdOutlineSecurity } from "react-icons/md";
import { TbAirConditioning, TbScissors, TbTruck } from "react-icons/tb";

interface FilterState {
  activeCategory: string;
  searchQuery: string;
  selectedRating: string;
  sortBy: string;
  priceMax: number;
  selectedAvailability: string[];
  currentPage: number;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (f: Partial<FilterState>) => void;
  ratingCounts: Record<string, number>;
  resultCount: number;
  onClearAll: () => void;
}

const categories = [
  {
    id: "ac-repair",
    label: "AC Repair",
    slug: "ac-repair",
    icon: TbAirConditioning,
  },
  { id: "plumbing", label: "Plumbing", slug: "plumbing", icon: FaFaucet },
  {
    id: "cleaning",
    label: "Cleaning",
    slug: "cleaning",
    icon: MdOutlineCleaningServices,
  },
  { id: "electrical", label: "Electrical", slug: "electrical", icon: FaBolt },
  { id: "shifting", label: "Shifting", slug: "shifting", icon: TbTruck },
  { id: "cctv", label: "CCTV", slug: "cctv", icon: MdOutlineSecurity },
  {
    id: "appliance-repair",
    label: "Appliance Repair",
    slug: "appliance-repair",
    icon: FaTv,
  },
  { id: "painting", label: "Painting", slug: "painting", icon: FaPaintRoller },
  { id: "gardening", label: "Gardening", slug: "gardening", icon: FaLeaf },
  {
    id: "pest-control",
    label: "Pest Control",
    slug: "pest-control",
    icon: FaBug,
  },
  {
    id: "home-salon",
    label: "Home Salon",
    slug: "home-salon",
    icon: TbScissors,
  },
  { id: "carpentry", label: "Carpentry", slug: "carpentry", icon: FaPaintRoller },
];

const RATING_OPTIONS = [
  { value: "5.0", label: "5.0 only" },
  { value: "4.5", label: "4.5 & up" },
  { value: "4.0", label: "4.0 & up" },
];

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity", icon: TrendingUp },
  { value: "price-low", label: "Price: Low → High", icon: ArrowUpNarrowWide },
  {
    value: "price-high",
    label: "Price: High → Low",
    icon: ArrowDownNarrowWide,
  },
  { value: "rating", label: "Rating", icon: Star },
  { value: "newest", label: "Newest first", icon: Sparkles },
];

const AVAILABILITY_OPTIONS = [
  { id: "today", label: "Today", icon: Clock },
  { id: "weekend", label: "This weekend", icon: CalendarDays },
  { id: "emergency", label: "Emergency (24h)", icon: Siren },
];

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${checked ? "bg-[#ff5a5f]" : "bg-[#e5e7eb]"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}


const PRICE_FLOOR = 500;
const PRICE_CEIL = 5000;

export default function FilterPanel({
  isOpen,
  onClose,
  filters,
  setFilters,
  ratingCounts,
  resultCount,
  onClearAll,
}: FilterPanelProps) {
  const {
    activeCategory,
    searchQuery,
    selectedRating,
    sortBy,
    priceMax,
    selectedAvailability,
  } = filters;
  const fillPct = ((priceMax - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100;

  // Active filter chips
  const chips: { label: string; onRemove: () => void }[] = [];
  if (activeCategory !== "all") {
    const cat = categories.find((c) => c.id === activeCategory);
    chips.push({
      label: cat?.label ?? activeCategory,
      onRemove: () => setFilters({ activeCategory: "all", currentPage: 1 }),
    });
  }
  if (searchQuery)
    chips.push({
      label: `"${searchQuery}"`,
      onRemove: () => setFilters({ searchQuery: "", currentPage: 1 }),
    });
  if (selectedRating)
    chips.push({
      label: `${selectedRating}+ ★`,
      onRemove: () => setFilters({ selectedRating: "", currentPage: 1 }),
    });
  if (priceMax < PRICE_CEIL)
    chips.push({
      label: `≤ ৳${priceMax.toLocaleString()}`,
      onRemove: () => setFilters({ priceMax: PRICE_CEIL, currentPage: 1 }),
    });
  selectedAvailability.forEach((slot) => {
    const opt = AVAILABILITY_OPTIONS.find((o) => o.id === slot);
    chips.push({
      label: opt?.label ?? slot,
      onRemove: () =>
        setFilters({
          selectedAvailability: selectedAvailability.filter((a) => a !== slot),
          currentPage: 1,
        }),
    });
  });


  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-x-0 bottom-0 z-20 bg-white rounded-t-3xl shadow-2xl max-h-[88vh] overflow-y-auto
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          md:static md:translate-y-0 md:max-h-none md:rounded-2xl md:shadow-md md:border md:border-[#e5e7eb]
          md:w-72 md:shrink-0 md:sticky md:top-24 md:h-fit
          p-5 md:p-6 space-y-8
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Service filters"
      >
        {/* Drag handle (mobile) */}
        <div className="md:hidden w-10 h-1 bg-[#d1d5db] rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              size={18}
              className="text-[#ff5a5f]"
              strokeWidth={2.5}
            />
            <h3 className="text-base font-bold text-[#1a1a1a] m-0">Filters</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-sm font-semibold text-[#6b7280] hover:text-[#ff5a5f] transition-colors"
              onClick={onClearAll}
            >
              Clear all
            </button>
            <button
              type="button"
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-[#f3f4f6] text-[#6b7280] hover:text-[#ff5a5f] transition-colors"
              onClick={onClose}
              aria-label="Close filters"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Active chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {chips.map((chip, i) => (
              <span
                key={i}
                className="flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-[#fff0ef] text-[#ff5a5f] text-xs font-semibold border border-[#ffd0d1]"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#ff5a5f]/20 transition-colors"
                >
                  <X size={10} strokeWidth={3} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Category */}
        <section className="">
          <h4 className="text-[10px] font-bold text-[#9ca3af] tracking-widest mb-3 uppercase">
            Category
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setFilters({
                      activeCategory: isActive ? "all" : cat.id,
                      currentPage: 1,
                    })
                  }
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
        <section className="">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-bold text-[#9ca3af] tracking-widest uppercase">
              Price Range
            </h4>
            <span className="text-xs font-semibold text-[#ff5a5f] bg-[#fff0ef] px-2 py-0.5 rounded-md">
              ৳{PRICE_FLOOR.toLocaleString()}–{priceMax.toLocaleString()}
            </span>
          </div>
          <div className="relative h-1.5 bg-[#e5e7eb] rounded-full mb-3">
            <div
              className="absolute h-full bg-[#ff5a5f] rounded-full"
              style={{ width: `${fillPct}%` }}
            />
            <input
              type="range"
              min={PRICE_FLOOR}
              max={PRICE_CEIL}
              step={100}
              value={priceMax}
              onChange={(e) =>
                setFilters({ priceMax: Number(e.target.value), currentPage: 1 })
              }
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
        <section className="">
          <h4 className="text-[10px] font-bold text-[#9ca3af] tracking-widest mb-3 uppercase">
            Min Rating
          </h4>
          <div className="flex flex-col gap-2">
            {RATING_OPTIONS.map((opt) => {
              const isActive = selectedRating === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${isActive ? "border-[#ff5a5f] bg-[#fff0ef]" : "border-[#e5e7eb] hover:border-[#ff5a5f]/50"}`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rating"
                      value={opt.value}
                      checked={isActive}
                      onChange={() =>
                        setFilters({
                          selectedRating: isActive ? "" : opt.value,
                          currentPage: 1,
                        })
                      }
                      className="w-3.5 h-3.5 accent-[#ff5a5f] cursor-pointer"
                    />
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a1a]">
                      <Star
                        size={12}
                        className="fill-[#f59e0b] text-[#f59e0b]"
                        strokeWidth={0}
                      />
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
        <section className="">
          <h4 className="text-[10px] font-bold text-[#9ca3af] tracking-widest mb-3 uppercase">
            Sort By
          </h4>
          <div className="flex flex-col gap-2">
            {SORT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = sortBy === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setFilters({ sortBy: opt.value, currentPage: 1 })
                  }
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
          <h4 className="text-[10px] font-bold text-[#9ca3af] tracking-widest mb-3 uppercase">
            Availability
          </h4>
          <div className="flex flex-col gap-3">
            {AVAILABILITY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const checked = selectedAvailability.includes(opt.id);
              return (
                <div key={opt.id} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#1a1a1a]">
                    <Icon
                      size={14}
                      className="text-[#9ca3af]"
                      strokeWidth={2.5}
                    />
                    {opt.label}
                  </span>
                  <ToggleSwitch
                    checked={checked}
                    label={opt.label}
                    onChange={() =>
                      setFilters({
                        selectedAvailability: checked
                          ? selectedAvailability.filter((a) => a !== opt.id)
                          : [...selectedAvailability, opt.id],
                        currentPage: 1,
                      })
                    }
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Mobile Apply button */}
        <div className="md:hidden sticky bottom-0 bg-white pt-4 mt-5 -mx-5 px-5 border-t border-[#f3f4f6]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#ff5a5f] text-white font-bold text-sm shadow-lg hover:bg-[#e04a4f] active:scale-95 transition-all"
          >
            Show {resultCount} result{resultCount !== 1 ? "s" : ""}
          </button>
        </div>
      </aside>
    </>
  );
}
