"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ChevronRight,
  Star,
  X,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Wrench,
  Scissors,
  Leaf,
  Bug,
  Truck,
  Video,
  Tv,
  Phone,
  Droplet,
  Bolt,
  Paintbrush,
  Link,
} from "lucide-react";

const SERVICE_CATEGORIES = [
  { id: "all", label: "All", icon: "🏠" },
  { id: "cleaning", label: "Cleaning", icon: "🧹" },
  { id: "ac-repair", label: "AC Repair", icon: "❄️" },
  { id: "plumbing", label: "Plumbing", icon: "🔧" },
  { id: "electrical", label: "Electrical", icon: "⚡" },
  { id: "painting", label: "Painting", icon: "🎨" },
  { id: "cctv", label: "CCTV", icon: "📹" },
  { id: "shifting", label: "Shifting", icon: "📦" },
  { id: "appliance", label: "Appliance Repair", icon: "🔌" },
];

const RATING_OPTIONS = [
  { value: "4.9", label: "4.9 & up", stars: 5 },
  { value: "4.7", label: "4.7 & up", stars: 5 },
  { value: "4.5", label: "4.5 & up", stars: 4 },
  { value: "4.0", label: "4.0 & up", stars: 4 },
];

const TRENDING_SERVICES = [
  {
    id: "premium-deep-cleaning",
    title: "Premium Deep Cleaning",
    description:
      "Full home sanitization using our friendly, industrial equipment. Perfect for move-ins or seasonal refreshes.",
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
    description: "Comprehensive cleaning and gas top-up for all split brands.",
    image:
      "https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviews: "1.8k",
    price: 1200,
    badge: "5.0 ★",
    featured: false,
  },
];

const SERVICE_LISTINGS = [
  {
    id: "luxury-wall-painting",
    title: "Luxury Wall Painting",
    description: "Italian finish textures and moisture-proof premium coatings.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=600&auto=format&fit=crop",
    category: "painting",
    categoryLabel: "Painting & Renovation",
    price: 1500,
    priceDisplay: "৳15/sq.ft",
    done: "3k+ done",
    rating: 4.9,
  },
  {
    id: "emergency-leak-repair",
    title: "Emergency Leak Repair",
    description: "60-minute response time for all plumbing blockages and leaks.",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop",
    category: "plumbing",
    categoryLabel: "Plumbing",
    price: 600,
    priceDisplay: "৳600",
    done: "1.2k+ done",
    rating: 4.7,
  },
  {
    id: "smart-home-setup",
    title: "Smart Home Setup",
    description:
      "Installation of smart switches, hubs, security locks and voice assistants.",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=600&auto=format&fit=crop",
    category: "electrical",
    categoryLabel: "Electrical",
    price: 2500,
    priceDisplay: "৳2,500",
    done: "800+ done",
    rating: 4.8,
  },
  {
    id: "refrigerator-servicing",
    title: "Refrigerator Servicing",
    description: "Gas charge, compressor checks, and cooling coil repair.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop",
    category: "appliance",
    categoryLabel: "Appliance",
    price: 1500,
    priceDisplay: "৳1,500",
    done: "2.1k+ done",
    rating: 4.6,
  },
  {
    id: "sofa-carpet-shampoo",
    title: "Sofa & Carpet Shampoo",
    description:
      "Deep vacuuming and organic shampooing for all domestic fabric types.",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=600&auto=format&fit=crop",
    category: "cleaning",
    categoryLabel: "Cleaning",
    price: 800,
    priceDisplay: "৳800/seat",
    done: "4k+ done",
    rating: 4.9,
  },
  {
    id: "cabinet-wood-polishing",
    title: "Cabinet Wood Polishing",
    description:
      "Restore the natural shine of your premium wooden fixtures and doors.",
    image:
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=600&auto=format&fit=crop",
    category: "painting",
    categoryLabel: "Renovation",
    price: 3500,
    priceDisplay: "৳3,500",
    done: "500+ done",
    rating: 4.5,
  },
];

const PRICE_FLOOR = 500;
const PRICE_CEIL = 5000;
const PER_PAGE = 6;

function buildURL(params: Record<string, string>) {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v && v !== "")
  );
  const qs = new URLSearchParams(filtered).toString();
  return qs ? `?${qs}` : "";
}

function ServicesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial state from URL
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );
  const [selectedRating, setSelectedRating] = useState<string>(
    searchParams.get("min_rating") || ""
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "popularity"
  );
  const [priceRange, setPriceRange] = useState<number>(
    Number(searchParams.get("price_max")) || PRICE_CEIL
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync state → URL whenever any filter changes
  const syncURL = useCallback(
    (overrides: Partial<Record<string, string>> = {}) => {
      const params: Record<string, string> = {
        category: activeCategory !== "all" ? activeCategory : "",
        q: searchQuery,
        min_rating: selectedRating,
        sort: sortBy !== "popularity" ? sortBy : "",
        price_max: priceRange < PRICE_CEIL ? String(priceRange) : "",
        page: currentPage > 1 ? String(currentPage) : "",
        ...overrides,
      };
      router.replace(pathname + buildURL(params), { scroll: false });
    },
    [activeCategory, searchQuery, selectedRating, sortBy, priceRange, currentPage, router, pathname]
  );

  useEffect(() => {
    syncURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery, selectedRating, sortBy, priceRange, currentPage]);

  const handleClearFilters = () => {
    setSelectedRating("");
    setPriceRange(PRICE_CEIL);
    setSortBy("popularity");
    setSearchQuery("");
    setActiveCategory("all");
    setCurrentPage(1);
  };

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setCurrentPage(1);
  };

  const handleRatingChange = (value: string) => {
    setSelectedRating((prev) => (prev === value ? "" : value));
    setCurrentPage(1);
  };

  // Readable URL preview string for display
  const urlPreview = useMemo(() => {
    const parts: string[] = [];
    if (activeCategory !== "all") parts.push(`category=${activeCategory}`);
    if (searchQuery) parts.push(`q=${encodeURIComponent(searchQuery)}`);
    if (priceRange < PRICE_CEIL) parts.push(`price_max=${priceRange}`);
    if (selectedRating) parts.push(`min_rating=${selectedRating}`);
    if (sortBy !== "popularity") parts.push(`sort=${sortBy}`);
    if (currentPage > 1) parts.push(`page=${currentPage}`);
    return parts.length
      ? `jevxo.com/services?${parts.join("&")}`
      : "jevxo.com/services";
  }, [activeCategory, searchQuery, priceRange, selectedRating, sortBy, currentPage]);

  // Active filter tags
  const activeTags = useMemo(() => {
    const tags: { label: string; onRemove: () => void }[] = [];
    if (activeCategory !== "all") {
      const cat = SERVICE_CATEGORIES.find((c) => c.id === activeCategory);
      tags.push({ label: cat?.label || activeCategory, onRemove: () => { setActiveCategory("all"); setCurrentPage(1); } });
    }
    if (searchQuery)
      tags.push({ label: `"${searchQuery}"`, onRemove: () => { setSearchQuery(""); setCurrentPage(1); } });
    if (priceRange < PRICE_CEIL)
      tags.push({ label: `Up to ৳${priceRange.toLocaleString()}`, onRemove: () => { setPriceRange(PRICE_CEIL); setCurrentPage(1); } });
    if (selectedRating)
      tags.push({ label: `★ ${selectedRating}+ rating`, onRemove: () => { setSelectedRating(""); setCurrentPage(1); } });
    if (sortBy !== "popularity")
      tags.push({ label: `Sort: ${sortBy.replace("-", " ")}`, onRemove: () => { setSortBy("popularity"); setCurrentPage(1); } });
    return tags;
  }, [activeCategory, searchQuery, priceRange, selectedRating, sortBy]);

  // Filter + sort
  const filteredListings = useMemo(() => {
    return SERVICE_LISTINGS.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) return false;
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (item.price > priceRange) return false;
      if (selectedRating && item.rating < parseFloat(selectedRating)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [activeCategory, searchQuery, priceRange, selectedRating, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / PER_PAGE));
  const pagedListings = filteredListings.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  // Sidebar filter panel (shared between desktop sidebar and mobile drawer)
  const FilterPanel = () => (
    <>
      {/* Price Range */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">Price Range</h4>
        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>৳{PRICE_FLOOR.toLocaleString()}</span>
          <span className="text-[#FF5A5F]">৳{priceRange.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={PRICE_FLOOR}
          max={PRICE_CEIL}
          step={100}
          value={priceRange}
          onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#FF5A5F]"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
          <span>Min</span>
          <span>Max</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">Minimum Rating</h4>
        <div className="space-y-2.5">
          {RATING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => handleRatingChange(opt.value)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${selectedRating === opt.value
                  ? "bg-[#FF5A5F] border-[#FF5A5F]"
                  : "border-slate-300 group-hover:border-[#FF5A5F]"
                  }`}
              >
                {selectedRating === opt.value && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <span className="text-amber-400 text-[11px]">{"★".repeat(opt.stars)}</span>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">Sort By</h4>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
          className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-600 outline-none focus:border-[#FF5A5F] bg-transparent"
        >
          <option value="popularity">Popularity</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Category (sidebar only) */}
      <div>
        <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">Category</h4>
        <div className="space-y-1">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${activeCategory === cat.id
                ? "bg-[#FF5A5F]/8 text-[#FF5A5F]"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-white min-h-screen text-slate-800">

      {/* ── 1. HERO ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
          Find the best home <span className="text-[#FF5A5F]">services</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto mb-8 font-medium">
          Premium, reliable, and effortless solutions for your urban lifestyle in Bangladesh.
        </p>

        {/* Premium Search Bar */}
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl md:rounded-full p-2 flex flex-col md:flex-row items-center gap-2 md:gap-0 shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-4">
          <div className="flex items-center gap-2.5 px-4 py-2 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-100">
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="What service do you need?"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full text-sm font-medium outline-none bg-transparent placeholder-slate-400 text-slate-800"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 w-full md:w-1/3">
            <MapPin className="w-4 h-4 text-[#FF5A5F] flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-700">Dhaka, BD</span>
          </div>
          <div className="w-full md:w-auto flex justify-end p-1 gap-2">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="md:hidden p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl"
              aria-label="Open Filters"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
            </button>
            <button className="w-full md:w-12 md:h-12 bg-[#FF5A5F] hover:bg-[#FF4449] text-white flex items-center justify-center p-3 rounded-xl md:rounded-full transition-colors cursor-pointer shadow-md shadow-[#FF5A5F]/20">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live URL Preview Bar */}
        <div className="max-w-3xl mx-auto mb-6 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Link className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
            {urlPreview.split("?")[0]}
            {urlPreview.includes("?") && (
              <>
                <span className="text-slate-400">?</span>
                {urlPreview.split("?")[1].split("&").map((part, i, arr) => {
                  const [k, v] = part.split("=");
                  return (
                    <span key={i}>
                      <span className="text-[#FF5A5F]">{k}</span>
                      <span className="text-slate-400">={decodeURIComponent(v || "")}</span>
                      {i < arr.length - 1 && <span className="text-slate-400">&amp;</span>}
                    </span>
                  );
                })}
              </>
            )}
          </span>
        </div>

        {/* Category Pills */}
        <div className="w-full overflow-x-auto scrollbar-none flex items-center gap-2 pb-4 justify-start md:justify-center">
          <div className="flex gap-2 px-1">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeCategory === cat.id
                  ? "border-[#FF5A5F] bg-[#FF5A5F]/8 text-[#FF5A5F]"
                  : "border-slate-100 hover:border-slate-200 bg-white text-slate-600"
                  }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. TRENDING ── */}
      <section className="bg-[#FFF4F4] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">Trending Services</h2>
              <p className="text-slate-500 text-xs md:text-sm">Highly requested by residents in Dhaka this month</p>
            </div>
            <a href="#" className="text-xs md:text-sm font-bold text-[#FF5A5F] hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {TRENDING_SERVICES.filter((s) => s.featured).map((service) => (
              <div key={service.id} className="lg:col-span-8 bg-white rounded-3xl overflow-hidden border border-slate-100/50 flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 relative min-h-[200px] md:min-h-auto">
                  <Image src={service.image} alt={service.title} fill className="object-cover" />
                  <span className="absolute top-4 left-4 bg-[#FF5A5F] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {service.badge}
                  </span>
                </div>
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {service.rating} ({service.reviews} reviews)
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6">{service.description}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase mb-0.5">Starting from</span>
                      <span className="text-lg font-bold text-slate-900">৳{service.price.toLocaleString()}</span>
                    </div>
                    <button className="bg-slate-900 hover:bg-black text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {TRENDING_SERVICES.filter((s) => !s.featured).map((service) => (
              <div key={service.id} className="lg:col-span-4 bg-white rounded-3xl overflow-hidden border border-slate-100/50 flex flex-col justify-between p-6 h-full">
                <div>
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <Image src={service.image} alt={service.title} fill className="object-cover" />
                    <span className="absolute top-3 right-3 bg-white/90 text-[#FF5A5F] text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-100">
                      {service.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{service.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">{service.description}</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                  <span className="text-base font-bold text-slate-900">৳{service.price.toLocaleString()}</span>
                  <button className="w-9 h-9 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors cursor-pointer">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FILTER + LISTINGS ── */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                <h3 className="text-base font-bold text-slate-900">Filters</h3>
                {activeTags.length > 0 && (
                  <button onClick={handleClearFilters} className="text-xs font-bold text-[#FF5A5F] hover:underline">
                    Clear all
                  </button>
                )}
              </div>
              <FilterPanel />
            </aside>

            {/* Listings */}
            <div className="lg:col-span-9">

              {/* Active filter tags */}
              {activeTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeTags.map((tag, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 bg-[#FF5A5F]/8 border border-[#FF5A5F]/20 text-[#FF5A5F] rounded-full text-xs font-semibold px-3 py-1"
                    >
                      {tag.label}
                      <button onClick={tag.onRemove} className="hover:opacity-70" aria-label="Remove filter">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Count */}
              <p className="text-xs text-slate-400 font-medium mb-4">
                Showing <span className="text-slate-700 font-bold">{pagedListings.length}</span> of{" "}
                <span className="text-slate-700 font-bold">{filteredListings.length}</span> services
              </p>

              {/* Grid */}
              {pagedListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pagedListings.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-[#FF5A5F]/20 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between h-full"
                    >
                      <div>
                        <div className="relative h-48 bg-slate-50 overflow-hidden">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute bottom-3 left-3 bg-white/95 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-100">
                            {service.categoryLabel}
                          </span>
                        </div>
                        <div className="p-5">
                          <h3 className="font-extrabold text-slate-900 text-sm md:text-base mb-1.5 group-hover:text-[#FF5A5F] transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-slate-500 text-xs leading-relaxed mb-2">{service.description}</p>
                          <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                            <Star className="w-3 h-3 fill-current" />
                            {service.rating}
                          </div>
                        </div>
                      </div>
                      <div className="p-5 pt-0 flex justify-between items-center border-t border-slate-50">
                        <span className="text-sm font-bold text-slate-900">{service.priceDisplay}</span>
                        <span className="text-[10px] font-bold text-slate-400">{service.done}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-500 text-sm font-medium mb-4">No services match your filters.</p>
                  <button
                    onClick={handleClearFilters}
                    className="bg-[#FF5A5F] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#FF4449]"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${currentPage === i + 1
                        ? "bg-[#FF5A5F] text-white"
                        : "border border-slate-100 hover:bg-slate-50 text-slate-600"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. SUB-CATEGORY SECTIONS ── */}

      {/* Cleaning */}
      <section className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-8 border-b-2 border-slate-100 pb-3">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 relative">
              Cleaning
              <span className="absolute bottom-[-14px] left-0 right-0 h-0.5 bg-[#FF5A5F]" />
            </h2>
            <a href="#" className="text-xs font-bold text-[#FF5A5F] hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Deep Cleaning", desc: "Full house sanitization and scrubbing.", icon: Sparkles },
              { title: "Kitchen Cleaning", desc: "Deep cleaning, grease removal & oil stain sanitization.", icon: Wrench },
              { title: "Bathroom Cleaning", desc: "Disinfection, tile descaling and polish.", icon: Droplet },
            ].map((sub, i) => {
              const Icon = sub.icon;
              return (
                <div key={i} className="bg-white border border-slate-100 hover:border-[#FF5A5F]/10 hover:shadow-sm p-6 md:p-8 rounded-3xl flex flex-col items-center text-center transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5A5F]/5 text-[#FF5A5F] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm md:text-base mb-2">{sub.title}</h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-[240px]">{sub.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Home Repairs */}
      <section className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8 border-b-2 border-slate-100 pb-3">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 relative inline-block">
              Home Repairs
              <span className="absolute bottom-[-14px] left-0 right-0 h-0.5 bg-[#FF5A5F]" />
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { name: "AC Repair", icon: Sparkles, id: "ac-repair" },
              { name: "Plumbing", icon: Droplet, id: "plumbing" },
              { name: "Electrical", icon: Bolt, id: "electrical" },
              { name: "Contractor", icon: Wrench, id: "all" },
              { name: "Painting", icon: Paintbrush, id: "painting" },
            ].map((repair, i) => {
              const Icon = repair.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleCategoryChange(repair.id)}
                  className="bg-white border border-slate-100 hover:border-[#FF5A5F]/20 hover:shadow-sm rounded-2xl p-5 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FF5A5F]/5 text-[#FF5A5F] flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{repair.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lifestyle */}
      <section className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 text-left">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 mb-2">Lifestyle</h2>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6">
                Indulge in self care with home salon, spa and garden maintenance without leaving your home.
              </p>
              <button className="bg-[#FF5A5F] hover:bg-[#FF4449] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all cursor-pointer">
                Explore More
              </button>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Salon & Spa", desc: "Professional beauty care at home.", icon: Scissors },
                { title: "Gardening", desc: "Premium lawn & landscape services.", icon: Leaf },
                { title: "Pest Control", desc: "Eco-friendly residential pest sprays.", icon: Bug },
              ].map((life, i) => {
                const Icon = life.icon;
                return (
                  <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl flex flex-col items-start transition-all hover:shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#FF5A5F]/5 text-[#FF5A5F] flex items-center justify-center mb-4">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm md:text-base mb-1.5">{life.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{life.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h2 className="text-lg md:text-xl font-bold text-slate-900">Other Services</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white border border-slate-100 p-6 md:p-8 rounded-3xl flex items-center gap-6 transition-all hover:shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#FF5A5F]/5 text-[#FF5A5F] flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base mb-1">Shifting & Relocation</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-3">
                  Safe and secure home shifting services across Dhaka.
                </p>
                <a href="#" className="text-xs font-bold text-[#FF5A5F] hover:underline flex items-center gap-0.5">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div className="lg:col-span-3 bg-white border border-slate-100 p-6 rounded-3xl flex flex-col items-center text-center justify-center transition-all hover:shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#FF5A5F]/5 text-[#FF5A5F] flex items-center justify-center mb-3">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-xs md:text-sm">CCTV</h3>
            </div>
            <div className="lg:col-span-3 bg-white border border-slate-100 p-6 rounded-3xl flex flex-col items-center text-center justify-center transition-all hover:shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#FF5A5F]/5 text-[#FF5A5F] flex items-center justify-center mb-3">
                <Tv className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-xs md:text-sm">Appliance</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CTA ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 mb-12">
        <div className="bg-[#FFF4F4] rounded-[32px] p-8 md:p-12 overflow-hidden relative flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2 text-left z-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Didn't find what you're looking for?
            </h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-md mb-8 leading-relaxed font-medium">
              Tell us your specific requirement and we'll match you with the right expert within 24 hours.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="bg-[#FF5A5F] hover:bg-[#FF4449] text-white text-xs md:text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-[#FF5A5F]/15 cursor-pointer">
                Request Custom Quote
              </button>
              <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs md:text-sm font-bold px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer">
                <Phone className="w-4 h-4" />
                Call Support
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 relative h-64 md:h-80 w-full lg:h-[340px] flex items-end justify-center">
            <div className="relative w-full h-full max-w-[340px]">
              <Image
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop"
                alt="Expert support professional"
                fill
                className="object-contain object-bottom rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE FILTER DRAWER ── */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-[32px] p-6 max-h-[90vh] overflow-y-auto shadow-2xl lg:hidden"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                <h3 className="text-base font-bold text-slate-900">Filters</h3>
                <div className="flex items-center gap-4">
                  {activeTags.length > 0 && (
                    <button onClick={handleClearFilters} className="text-xs font-bold text-[#FF5A5F] hover:underline">
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <FilterPanel />

              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full mt-6 bg-[#FF5A5F] hover:bg-[#FF4449] text-white font-bold py-3.5 rounded-xl text-sm transition-all"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-slate-500 font-semibold">Loading services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}