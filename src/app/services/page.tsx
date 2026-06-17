import CustomQuote from '@/components/home/services/CustomQuote';
import ServiceHero from '@/components/home/services/ServiceHero';
import ServiceLists from '@/components/home/services/ServiceLists';
import TrendingServices from '@/components/home/services/TrendingServices';

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  X,
  Star,
  SlidersHorizontal,
  Check,
  Search,
  MapPin,
  Calendar,
  ChevronDown,
  Sparkles,
  Wind,
  Wrench,
  Zap,
  PaintRoller,
  Camera,
  Truck,
  Settings2,
  TrendingUp,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  Clock,
  CalendarDays,
  Siren,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomCalendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
import { motion, useScroll, useTransform } from "framer-motion";
import { CustomSelect } from "@/components/ui/select";
import { TbAirConditioning, TbTruck, TbScissors } from "react-icons/tb";
import {
  FaFaucet,
  FaBolt,
  FaTv,
  FaPaintRoller,
  FaLeaf,
  FaBug,
  FaHammer,
} from "react-icons/fa";
import { MdOutlineCleaningServices, MdOutlineSecurity } from "react-icons/md";
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

const categories = [
  { id: "ac-repair", label: "AC Repair", slug: "ac-repair", icon: TbAirConditioning },
  { id: "plumbing", label: "Plumbing", slug: "plumbing", icon: FaFaucet },
  { id: "cleaning", label: "Cleaning", slug: "cleaning", icon: MdOutlineCleaningServices },
  { id: "electrical", label: "Electrical", slug: "electrical", icon: FaBolt },
  { id: "shifting", label: "Shifting", slug: "shifting", icon: TbTruck },
  { id: "cctv", label: "CCTV", slug: "cctv", icon: MdOutlineSecurity },
  { id: "appliance-repair", label: "Appliance Repair", slug: "appliance-repair", icon: FaTv },
  { id: "painting", label: "Painting", slug: "painting", icon: FaPaintRoller },
  { id: "gardening", label: "Gardening", slug: "gardening", icon: FaLeaf },
  { id: "pest-control", label: "Pest Control", slug: "pest-control", icon: FaBug },
  { id: "home-salon", label: "Home Salon", slug: "home-salon", icon: TbScissors },
  { id: "carpentry", label: "Carpentry", slug: "carpentry", icon: FaHammer },
];

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

const TRENDING_SERVICES: TrendingService[] = [
  {
    id: "premium-deep-cleaning",
    title: "Premium Deep Cleaning",
    description:
      "Full home sanitization using industrial equipment. Perfect for move-ins or seasonal refreshes.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviews: "2.4k",
    price: 4500,
    badge: "MOST BOOKED",
    featured: true,
  },
  {
    id: "master-ac-service",
    title: "Master AC Service",
    description:
      "Comprehensive cleaning and gas top-up for all split AC brands.",
    image:
      "https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviews: "1.8k",
    price: 1200,
    badge: "5.0 ★",
    featured: false,
  },
];

const SERVICE_LISTINGS: ServiceListing[] = [
  {
    id: "luxury-wall-painting",
    title: "Luxury Wall Painting",
    description: "Italian finish textures and moisture-proof coating.",
    image: "/images/service/service-3.png",
    category: "painting",
    categoryLabel: "Painting",
    price: 15,
    priceDisplay: "৳15/sq.ft",
    done: "3k+ done",
    rating: 4.8,
    availability: ["weekend"],
    daysAgo: 2,
  },
  {
    id: "emergency-leak-repair",
    title: "Emergency Leak Repair",
    description: "60-minute response for all plumbing emergencies.",
    image: "/images/service/service-4.png",
    category: "plumbing",
    categoryLabel: "Plumbing",
    price: 600,
    priceDisplay: "৳600",
    done: "1.2k+ done",
    rating: 4.6,
    availability: ["today", "emergency"],
    daysAgo: 5,
  },
  {
    id: "smart-home-setup",
    title: "Smart Home Setup",
    description: "Installation of smart switches, hubs and automation.",
    image: "/images/service/service-5.png",
    category: "electrical",
    categoryLabel: "Electrical",
    price: 2500,
    priceDisplay: "৳2,500",
    done: "800+ done",
    rating: 4.7,
    availability: ["today", "weekend"],
    daysAgo: 1,
  },
  {
    id: "refrigerator-servicing",
    title: "Refrigerator Servicing",
    description: "Gas charge, compressor checks and cooling fixes.",
    image: "/images/service/service-6.png",
    category: "appliance",
    categoryLabel: "Appliance",
    price: 1500,
    priceDisplay: "৳1,500",
    done: "2.1k+ done",
    rating: 4.5,
    availability: ["today"],
    daysAgo: 10,
  },
  {
    id: "sofa-carpet-shampoo",
    title: "Sofa & Carpet Shampoo",
    description: "Deep vacuuming and shampooing for all fabric types.",
    image: "/images/service/service-7.png",
    category: "cleaning",
    categoryLabel: "Cleaning",
    price: 800,
    priceDisplay: "৳800/seat",
    done: "4k+ done",
    rating: 4.9,
    availability: ["today", "weekend"],
    daysAgo: 7,
  },
  {
    id: "cabinet-wood-polishing",
    title: "Cabinet Wood Polishing",
    description: "Restore the natural shine of your premium wood.",
    image: "/images/service/service-8.png",
    category: "painting",
    categoryLabel: "Renovation",
    price: 3500,
    priceDisplay: "৳3,500",
    done: "500+ done",
    rating: 4.4,
    availability: ["weekend"],
    daysAgo: 15,
  },
];

const categoryOptions = categories.map((cat) => ({
  value: cat.slug,
  label: cat.label,
}));

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18,
    },
  },
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildURL(params: Record<string, string>): string {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v),
  );
  const qs = new URLSearchParams(filtered).toString();
  return qs ? `?${qs}` : "";
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

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

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          strokeWidth={0}
          className={
            i <= Math.round(rating) ? "fill-[#f59e0b]" : "fill-[#e5e7eb]"
          }
        />
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

function FilterPanel({
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
    const cat = FILTER_CATEGORIES.find((c) => c.id === activeCategory);
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
          className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
          style={{ backgroundSize: "auto" }}
        />
        <div className="relative z-10 space-y-16 md:space-y-24 lg:space-y-32">
          <TrendingServices />
          <ServiceLists />
          <CustomQuote />
        </div>
      </div>
    );
};

// ─── Service Listings ─────────────────────────────────────────────────────────

function ServiceListings({
  filters,
  setFilters,
  onClearAll,
  isFilterOpen,
  setIsFilterOpen,
}: {
  filters: FilterState;
  setFilters: (f: Partial<FilterState>) => void;
  onClearAll: () => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (v: boolean) => void;
}) {
  const {
    activeCategory,
    searchQuery,
    selectedRating,
    sortBy,
    priceMax,
    selectedAvailability,
    currentPage,
  } = filters;

  const filteredListings = useMemo(() => {
    let list = [...SERVICE_LISTINGS];
    if (activeCategory !== "all")
      list = list.filter((s) => s.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q),
      );
    }
    if (selectedRating)
      list = list.filter((s) => s.rating >= parseFloat(selectedRating));
    list = list.filter((s) => s.price <= priceMax);
    if (selectedAvailability.length)
      list = list.filter((s) =>
        selectedAvailability.every((slot) => s.availability.includes(slot)),
      );
    switch (sortBy) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => a.daysAgo - b.daysAgo);
        break;
    }
    return list;
  }, [
    activeCategory,
    searchQuery,
    selectedRating,
    sortBy,
    priceMax,
    selectedAvailability,
  ]);

  const totalPages = Math.ceil(filteredListings.length / PER_PAGE);
  const pagedItems = filteredListings.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const ratingCounts = useMemo(() => {
    const base = SERVICE_LISTINGS.filter((s) => {
      if (activeCategory !== "all" && s.category !== activeCategory)
        return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !s.title.toLowerCase().includes(q) &&
          !s.description.toLowerCase().includes(q)
        )
          return false;
      }
      if (s.price > priceMax) return false;
      if (
        selectedAvailability.length &&
        !selectedAvailability.every((slot) => s.availability.includes(slot))
      )
        return false;
      return true;
    });
    return RATING_OPTIONS.reduce<Record<string, number>>((acc, opt) => {
      acc[opt.value] = base.filter(
        (s) => s.rating >= parseFloat(opt.value),
      ).length;
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
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          setFilters={setFilters}
          ratingCounts={ratingCounts}
          resultCount={filteredListings.length}
          onClearAll={onClearAll}
        />

        <div className="flex-1 min-w-0">
          {/* Mobile filter trigger + result count */}
          <div className="flex items-center justify-between mb-5 md:hidden">
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm font-semibold text-[#1a1a1a] shadow-sm"
            >
              <SlidersHorizontal
                size={16}
                className="text-[#ff5a5f]"
                strokeWidth={2.5}
              />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#ff5a5f] text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <span className="text-xs font-semibold text-[#6b7280]">
              {filteredListings.length} result
              {filteredListings.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Desktop result count */}
          <div className="hidden md:flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1a1a1a]">
              All Services
              <span className="ml-2 text-sm font-normal text-[#9ca3af]">
                ({filteredListings.length} results)
              </span>
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {pagedItems.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Empty state */}
          {pagedItems.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white rounded-2xl border border-[#e5e7eb]">
              <div className="w-12 h-12 rounded-full bg-[#fff0ef] flex items-center justify-center text-[#ff5a5f] mb-4">
                <SlidersHorizontal size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-bold text-[#1a1a1a] mb-1">
                No services found
              </h3>
              <p className="text-sm text-[#6b7280] mb-5 max-w-xs">
                Try widening your filters or clearing your search.
              </p>
              <button
                type="button"
                onClick={onClearAll}
                className="px-6 py-2.5 rounded-xl bg-[#ff5a5f] text-white text-sm font-bold hover:bg-[#e04a4f] transition-all shadow-md"
              >
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
                onClick={() =>
                  setFilters({ currentPage: Math.max(1, currentPage - 1) })
                }
                aria-label="Previous"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold border transition-all ${currentPage === page ? "bg-[#ff5a5f] text-white border-[#ff5a5f]" : "border-[#e5e7eb] text-[#4b5563] hover:border-[#ff5a5f] hover:text-[#ff5a5f]"}`}
                    onClick={() => setFilters({ currentPage: page })}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e5e7eb] text-[#4b5563] text-lg disabled:opacity-40 hover:border-[#ff5a5f] hover:text-[#ff5a5f] transition-all"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setFilters({
                    currentPage: Math.min(totalPages, currentPage + 1),
                  })
                }
                aria-label="Next"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Category Sections ────────────────────────────────────────────────────────

function CategorySection({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-14 px-4 sm:px-6 bg-white border-t border-[#f3f4f6]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-extrabold text-[#1a1a1a] border-b-2 border-[#ff5a5f] pb-1.5">
            {title}
          </h2>
          <Link
            href={href}
            className="text-sm font-bold text-[#ff5a5f] no-underline hover:underline"
          >
            View all →
          </Link>
        </div>
        {children}
      </div>
    </section>
  );
}

function CategoryCleaning() {
  const items = [
    {
      title: "Deep Cleaning",
      desc: "Intensive whole-home sanitization.",
      icon: "🧹",
    },
    {
      title: "Kitchen Cleaning",
      desc: "Degreasing and detailed cabinet care.",
      icon: "🍳",
    },
    {
      title: "Bathroom Cleaning",
      desc: "Scale removal and sparkling sanitization.",
      icon: "🚿",
    },
  ];
  return (
    <CategorySection title="Cleaning" href="/services/cleaning">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {items.map((item) => (
          <Link
            key={item.title}
            href={`/services/cleaning/${slug(item.title)}`}
            className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-md hover:border-[#ff5a5f] hover:-translate-y-0.5 transition-all duration-200 no-underline text-inherit"
          >
            <span className="text-3xl">{item.icon}</span>
            <h3 className="text-sm font-bold text-[#1a1a1a] m-0">
              {item.title}
            </h3>
            <p className="text-xs text-[#6b7280] m-0 leading-relaxed">
              {item.desc}
            </p>
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
        {items.map((item) => (
          <Link
            key={item.title}
            href={`/services/repairs/${slug(item.title)}`}
            className="flex flex-col items-center justify-center gap-2.5 p-5 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-md hover:border-[#ff5a5f] hover:-translate-y-0.5 transition-all duration-200 no-underline text-inherit min-h-[96px]"
          >
            <span className="text-2xl">{item.icon}</span>
            <h3 className="text-xs font-bold text-[#4b5563] tracking-wide uppercase m-0">
              {item.title}
            </h3>
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
          <h2 className="text-2xl font-extrabold text-[#ff5a5f] mb-2">
            Lifestyle
          </h2>
          <p className="text-sm text-[#6b7280] max-w-md leading-relaxed m-0">
            Premium home salon, spa, and garden maintenance services.
          </p>
        </div>
        <Link
          href="/services/lifestyle"
          className="shrink-0 px-6 py-2.5 bg-[#ff5a5f] text-white text-sm font-bold rounded-xl hover:bg-[#e04a4f] transition-all shadow-md no-underline"
        >
          Explore More
        </Link>
      </div>
    </section>
  );
}

function CategoryOtherServices() {
  const items = [
    {
      title: "Premium Shifting",
      desc: "Packers & movers for stress-free transitions.",
      href: "/services/premium-shifting",
      icon: "🚚",
    },
    {
      title: "CCTV & Security",
      desc: "Complete surveillance installation & setup.",
      href: "/services/cctv",
      icon: "📷",
    },
    {
      title: "Appliance Repair",
      desc: "Certified technicians for all home appliances.",
      href: "/services/appliance-repair",
      icon: "🔌",
    },
  ];
  return (
    <CategorySection title="Other Services" href="/services">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="flex flex-col gap-3 p-6 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-md hover:border-[#ff5a5f] hover:-translate-y-0.5 transition-all duration-200 no-underline text-inherit"
          >
            <span className="text-3xl">{item.icon}</span>
            <h3 className="text-sm font-bold text-[#1a1a1a] m-0">
              {item.title}
            </h3>
            <p className="text-xs text-[#6b7280] m-0 leading-relaxed">
              {item.desc}
            </p>
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
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#ff5a5f] mb-3 leading-tight">
              Didn't find what you need?
            </h2>
            <p className="text-sm text-[#6b7280] leading-relaxed mb-0 max-w-sm">
              Tell us your requirement and we'll match you with the right
              professional within 24 hours.
            </p>
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
    selectedAvailability: (searchParams.get("availability") || "")
      .split(",")
      .filter(Boolean),
    currentPage: Number(searchParams.get("page")) || 1,
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const setFilters = useCallback((partial: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  }, []);

  const syncURL = useCallback(() => {
    const {
      activeCategory,
      searchQuery,
      selectedRating,
      sortBy,
      priceMax,
      selectedAvailability,
      currentPage,
    } = filters;
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

  useEffect(() => {
    syncURL();
  }, [syncURL]);

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  const handleClearAll = useCallback(() => {
    setFiltersState({
      activeCategory: "all",
      searchQuery: "",
      selectedRating: "",
      sortBy: "popularity",
      priceMax: PRICE_CEIL,
      selectedAvailability: [],
      currentPage: 1,
    });
  }, []);

  const { scrollY } = useScroll();
  // Visual scroll-driven handoff to the header search bar
  const searchOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const searchScale = useTransform(scrollY, [0, 200], [1, 0.85]);
  const searchY = useTransform(scrollY, [0, 200], [0, -60]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      let url = `/categories/${selectedCategory}`;
      const params = [];
      if (location) params.push(`location=${encodeURIComponent(location)}`);
      if (selectedDate)
        params.push(`date=${selectedDate.format("YYYY-MM-DD")}`);
      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }
      router.push(url);
    } else {
      router.push("/categories/ac-repair");
    }
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#fff0ef] via-white to-[#fff7f7] py-10 md:py-16 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#ffe1e2] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a5f]" />
              <span className="text-xs font-semibold text-[#ff5a5f]">
                Trusted Home Services in Bangladesh
              </span>
            </div>
          </div>

          <div className="text-center max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a1a1a] leading-tight mb-3 max-w-3xl mx-auto lg:mx-0">
              Find the Best Home{" "}
              <span className="text-primary"> Services </span> for Your
              Lifestyle
            </h1>
            <p className="text-sm md:text-base text-[#6b7280] max-w-xl mx-auto lg:mx-0 mb-4">
              Premium, reliable, and effortless home service solutions across
              Bangladesh.
            </p>
          </div>

          {/* Animated Floating Search Bar Card with Handoff Scroll Control */}
          <motion.form
            variants={itemVariants}
            style={{
              opacity: searchOpacity,
              scale: searchScale,
              y: searchY,
            }}
            onSubmit={handleSearch}
            className="w-full max-w-3xl mx-auto bg-white rounded-2xl md:rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-3 flex flex-col md:flex-row items-center gap-3 md:gap-0"
          >
            {/* Category Dropdown Select */}
            <div className="flex items-center gap-3 flex-1 w-full px-4 py-2 md:py-1 relative">
              <Search className="text-slate-400 w-5 h-5 flex-shrink-0" />
              <CustomSelect
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Select Category"
                className="w-full"
                triggerClassName="border-none bg-transparent hover:bg-transparent shadow-none px-0 py-1.5 h-auto text-slate-700 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none"
              />
            </div>

            {/* Vertical Separator */}
            <div className="hidden md:block h-8 w-px bg-slate-200" />

            {/* Location Text Input */}
            <div className="flex items-center gap-3 flex-1 w-full px-4 py-2 md:py-1">
              <MapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full py-1.5"
              />
            </div>

            {/* Vertical Separator */}
            <div className="hidden md:block h-8 w-px bg-slate-200" />

            {/* Date Picker Popover Trigger */}
            <div className="flex items-center gap-3 flex-1 w-full px-4 py-2 md:py-1 relative">
              <div
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-3 w-full py-1.5 cursor-pointer"
              >
                <Calendar className="text-slate-400 w-5 h-5 flex-shrink-0" />
                <span className="text-sm text-slate-700 select-none">
                  {selectedDate
                    ? selectedDate.format("DD MMM, YYYY")
                    : "Select Date"}
                </span>
              </div>

              {showCalendar && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCalendar(false)}
                  />
                  <div className="absolute top-full left-0 md:left-auto md:right-0 mt-3 z-50 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 max-w-[340px]">
                    <CustomCalendar
                      staticInline={true}
                      value={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setShowCalendar(false);
                      }}
                    />
                  </div>
                </>
              )}
            </div>
            {/* Book Now Action Button */}
            <Button
              type="submit"
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3.5 h-auto rounded-xl md:rounded-full transition-all duration-200 shadow-sm active:scale-95 text-base flex-shrink-0 cursor-pointer"
            >
              Book Now
            </Button>
          </motion.form>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 my-8">
            {[
              ["⭐", "4.9 Customer Rating"],
              ["👨‍🔧", "500+ Professionals"],
              ["🛡️", "Verified & Trusted"],
            ].map(([icon, label]) => (
              <div key={label as string} className="flex items-center gap-1.5">
                <span>{icon}</span>
                <span className="text-xs font-medium text-[#6b7280]">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Quick-nav category pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`categories/service/${cat.id}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border font-semibold text-xs transition-all duration-200 hover:-translate-y-0.5 no-underline border-[#e5e7eb] text-[#4b5563] bg-white hover:border-[#ff5a5f] hover:text-[#ff5a5f] hover:shadow-sm"
              >
                {/* <span>{cat.icon}</span> */}
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
              <h2 className="text-2xl font-extrabold text-[#1a1a1a] border-b-2 border-[#ff5a5f] pb-1.5 inline-block">
                Trending Services
              </h2>
              <p className="text-sm text-[#6b7280] mt-1">
                Highly requested in Dhaka this month
              </p>
            </div>
            <Link
              href="#"
              className="text-sm font-bold text-[#ff5a5f] no-underline hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
            {/* Featured card */}
            {TRENDING_SERVICES.filter((s) => s.featured).map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-1 sm:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-md border border-[#f3f4f6] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="relative min-h-[260px] sm:min-h-[auto] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  {service.badge && (
                    <span className="absolute top-3 left-3 py-1.5 px-3 bg-[#8b1a1a] text-white text-[10px] font-bold tracking-wider rounded-lg uppercase">
                      {service.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <Stars rating={service.rating} />
                    <span className="text-xs text-[#6b7280] font-semibold">
                      ({service.rating} • {service.reviews} reviews)
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1a1a1a] m-0 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#6b7280] leading-relaxed m-0">
                    {service.description}
                  </p>
                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-[#f3f4f6]">
                    <div>
                      <p className="text-[10px] font-bold text-[#9ca3af] tracking-widest uppercase mb-0.5">
                        Starting from
                      </p>
                      <p className="text-xl font-extrabold text-[#1a1a1a] m-0">
                        ৳{service.price.toLocaleString()}
                      </p>
                    </div>
                    <Link
                      href={`/services/${service.id}`}
                      className="px-5 py-2.5 bg-[#ff5a5f] text-white text-xs font-bold rounded-full no-underline hover:bg-[#e04a4f] transition-all shadow-md"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Secondary cards */}
            {TRENDING_SERVICES.filter((s) => !s.featured).map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#f3f4f6] flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-5 flex flex-col flex-1 gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-[#1a1a1a] m-0 leading-snug">
                      {service.title}
                    </h3>
                    <span className="bg-[#fff8e1] text-[#b45309] px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                      ★ {service.rating}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b7280] leading-relaxed m-0 flex-1">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-[#f3f4f6]">
                    <span className="text-base font-extrabold text-[#1a1a1a]">
                      ৳{service.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/services/${service.id}`}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f3f4f6] text-[#4b5563] no-underline hover:bg-[#ff5a5f] hover:text-white transition-all text-base font-bold"
                      aria-label={`View ${service.title}`}
                    >
                      →
                    </Link>
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-slate-400 text-sm">
          Loading services…
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
