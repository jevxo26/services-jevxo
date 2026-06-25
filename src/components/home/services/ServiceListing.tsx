import { ArrowLeft, ArrowRight, SlidersHorizontal, LayoutGrid } from "lucide-react";
import { useMemo } from "react";
import FilterPanel, { FilterPanelDesktop } from "./FilterPanel";
import ServiceCard from "./ServiceCard";
import { CustomSelect } from "@/components/ui/select";
import {
  useGetPublicCategoriesQuery,
  useGetPublicServicesQuery,
} from "@/redux/features/landing/landingApi";
import { FaBolt, FaBug, FaFaucet, FaLeaf, FaPaintRoller, FaTv, FaHammer } from "react-icons/fa";
import { MdOutlineCleaningServices, MdOutlineSecurity } from "react-icons/md";
import { TbAirConditioning, TbScissors, TbTruck } from "react-icons/tb";

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
  slug?: string;
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

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "AC Repair": TbAirConditioning,
  "AC": TbAirConditioning,
  "Plumbing": FaFaucet,
  "Cleaning": MdOutlineCleaningServices,
  "Electrical": FaBolt,
  "Shifting": TbTruck,
  "CCTV": MdOutlineSecurity,
  "Security": MdOutlineSecurity,
  "Appliance Repair": FaTv,
  "Appliance": FaTv,
  "Painting": FaPaintRoller,
  "Gardening": FaLeaf,
  "Pest Control": FaBug,
  "Salon": TbScissors,
  "Home Salon": TbScissors,
  "Carpentry": FaHammer,
};

const RATING_OPTIONS = [
  { value: "5.0", label: "5.0 only" },
  { value: "4.5", label: "4.5 & up" },
  { value: "4.0", label: "4.0 & up" },
];

const PER_PAGE = 9;
const PRICE_CEIL = 5000;

const getHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const ServiceCardSkeleton = () => (
  <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm flex flex-col animate-pulse">
    <div className="h-48 bg-slate-200 relative" />
    <div className="p-4 flex flex-col flex-1 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-200/60 rounded w-full" />
        <div className="h-3 bg-slate-200/60 rounded w-5/6" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#f3f4f6] mt-auto">
        <div className="h-5 bg-slate-200 rounded w-1/3" />
        <div className="h-3 bg-slate-200/60 rounded w-1/4" />
      </div>
    </div>
  </div>
);

export default function ServiceListing({
  filters,
  setFilters,
  onClearAll,
  isFilterOpen,
  setIsFilterOpen,
  categoryName,
}: {
  filters: FilterState;
  setFilters: (f: Partial<FilterState>) => void;
  onClearAll: () => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (v: boolean) => void;
  categoryName?: string;
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

  const { data: categoriesRes, isLoading: isCategoriesLoading } = useGetPublicCategoriesQuery();
  const categories = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);

  const { data: servicesRes, isLoading: isServicesLoading } = useGetPublicServicesQuery();
  const allServices = servicesRes?.data || (Array.isArray(servicesRes) ? servicesRes : []);

  const mappedListings = useMemo(() => {
    return allServices.map((item: any) => {
      const id = String(item.id);
      const hash = getHash(id);

      // Done options based on actual bookings if available, else fallback
      let done = "";
      if (item.bookings && item.bookings.length > 0) {
        done = `${item.bookings.length}+ done`;
      } else {
        const doneOptions = ["80+ done", "120+ done", "210+ done", "300+ done", "400+ done"];
        done = doneOptions[hash % doneOptions.length];
      }

      // Availability options
      const availOptions = [
        ["today"],
        ["weekend"],
        ["today", "weekend"],
        ["today", "emergency"],
        ["weekend", "emergency"],
        ["today", "weekend", "emergency"]
      ];
      const availability = availOptions[hash % availOptions.length];

      // Rating based on actual reviews if available, else fallback
      const totalReviews = item.reviews?.length || 0;
      let rating = parseFloat((4.0 + (hash % 11) * 0.1).toFixed(1));
      if (totalReviews > 0) {
        const sumRating = item.reviews.reduce((acc: number, cur: any) => acc + (cur.rating || 0), 0);
        rating = parseFloat((sumRating / totalReviews).toFixed(1));
      }

      // Days ago
      const daysAgo = hash % 15;

      const categoryObj = item.category || {};
      const catSlug = categoryObj.slug || categoryObj.name?.toLowerCase().replace(/\s+/g, "-") || "";
      const catLabel = categoryObj.name || "";
      const catId = String(categoryObj.id || "");

      // Price based on nested services minimum price
      let priceVal = 1000;
      if (item.nestedServices && item.nestedServices.length > 0) {
        const prices = item.nestedServices
          .map((ns: any) => Number(ns.starting_price || 0))
          .filter((p: number) => p > 0);
        if (prices.length > 0) {
          priceVal = Math.min(...prices);
        }
      }

      return {
        id,
        title: item.name || "",
        description: item.description || item.subtitle || "",
        image: item.image || "/images/service/service-1.png",
        category: catSlug,
        categoryId: catId,
        categoryLabel: catLabel,
        price: priceVal,
        priceDisplay: priceVal > 0 ? `৳${priceVal.toLocaleString()}` : "Contact for price",
        done,
        rating,
        availability,
        daysAgo,
        slug: item.slug || "",
      };
    });
  }, [allServices]);

  const filteredListings = useMemo(() => {
    let list = [...mappedListings];
    if (activeCategory !== "all")
      // Match by category slug OR by category ID (for homepage direct links)
      list = list.filter((s) => s.category === activeCategory || (s as any).categoryId === activeCategory);
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
    mappedListings,
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
    const base = mappedListings.filter((s: any) => {
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
        (s: any) => s.rating >= parseFloat(opt.value),
      ).length;
      return acc;
    }, {});
  }, [mappedListings, activeCategory, searchQuery, priceMax, selectedAvailability]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (activeCategory !== "all") n++;
    if (selectedRating) n++;
    if (priceMax < PRICE_CEIL) n++;
    n += selectedAvailability.length;
    return n;
  }, [activeCategory, selectedRating, priceMax, selectedAvailability]);

  const ratingDropdownOptions = useMemo(() => {
    return [
      { value: "all", label: "Min Rating (All)" },
      ...RATING_OPTIONS.map((opt) => ({
        value: opt.value,
        label: `★ ${opt.label} (${ratingCounts[opt.value] ?? 0})`
      }))
    ];
  }, [ratingCounts]);

  const sortDropdownOptions = [
    { value: "popularity", label: "Sort: Popularity" },
    { value: "price-low", label: "Sort: Price: Low → High" },
    { value: "price-high", label: "Sort: Price: High → Low" },
    { value: "rating", label: "Sort: Rating" },
    { value: "newest", label: "Sort: Newest first" },
  ];

  return (
    <section className="py-6 bg-slate-50/30">
      <div className="max-w-[1400px] mx-auto px-4">

        {/* Results count heading — shown only when a category name is provided (e.g. from category page) */}
        {categoryName && (
          <div className="mb-5">
            <p className="text-lg md:text-2xl font-black text-slate-900">
              <span className="text-slate-500 font-semibold">
                {filteredListings.length} results found for{" "}
              </span>
              <span className="text-[#FF7C71]">{categoryName}</span>
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Verified professionals ready to serve you in Dhaka, Bangladesh.
            </p>
          </div>
        )}


        {/* Top Search & Actions bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex flex-1 flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search for services, repairs..."
                value={searchQuery}
                onChange={(e) => setFilters({ searchQuery: e.target.value, currentPage: 1 })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-semibold placeholder-slate-400 text-slate-700 focus:outline-none focus:border-[#FF7C71] transition-all"
                suppressHydrationWarning
              />
            </div>

            {/* Desktop Sort By and Min Rating select dropdowns */}
            <div className="hidden md:flex items-center gap-3">
              {/* Min Rating Select */}
              <div className="relative min-w-[140px]">
                <CustomSelect
                  options={ratingDropdownOptions}
                  value={selectedRating || "all"}
                  onChange={(val) => setFilters({ selectedRating: val === "all" ? "" : val, currentPage: 1 })}
                  placeholder="Min Rating (All)"
                  triggerClassName="bg-slate-50/50 border border-slate-100 hover:border-slate-300 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF7C71] focus-visible:ring-0 focus:ring-0 transition-all cursor-pointer h-[40px] shadow-none"
                />
              </div>

              {/* Sort By Select */}
              <div className="relative min-w-[160px]">
                <CustomSelect
                  options={sortDropdownOptions}
                  value={sortBy}
                  onChange={(val) => setFilters({ sortBy: val, currentPage: 1 })}
                  placeholder="Sort: Popularity"
                  triggerClassName="bg-slate-50/50 border border-slate-100 hover:border-slate-300 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF7C71] focus-visible:ring-0 focus:ring-0 transition-all cursor-pointer h-[40px] shadow-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Filter Toggle Button for Mobile Only */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="flex md:hidden items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-100 bg-white text-xs font-extrabold text-slate-700 shadow-sm cursor-pointer"
            >
              <SlidersHorizontal size={14} className="text-[#FF7C71]" strokeWidth={2.5} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full bg-[#FF7C71] text-white text-[9px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-2 rounded-xl">
              {filteredListings.length} {filteredListings.length === 1 ? "result" : "results"}
            </span>
          </div>
        </div>

        {/* Main Split Layout */}
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* Desktop Left Sidebar Filters (hidden on mobile, block on md+) */}
          <div className="hidden md:block w-72 shrink-0">
            <FilterPanelDesktop
              filters={filters}
              setFilters={setFilters}
              ratingCounts={ratingCounts}
              resultCount={filteredListings.length}
              onClearAll={onClearAll}
              categories={categories}
              isLoadingCategories={isCategoriesLoading}
            />
          </div>

          {/* Mobile Drawer (visible on mobile drawer triggers) */}
          <FilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            setFilters={setFilters}
            ratingCounts={ratingCounts}
            resultCount={filteredListings.length}
            onClearAll={onClearAll}
            categories={categories}
            isLoadingCategories={isCategoriesLoading}
          />

          {/* Services Grid (spans remaining width) */}
          <div className="flex-1 min-w-0 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isServicesLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <ServiceCardSkeleton key={idx} />
                ))
              ) : (
                pagedItems.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))
              )}
            </div>

            {/* Empty state */}
            {pagedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white rounded-2xl border border-slate-100 shadow-sm mt-6">
                <div className="w-12 h-12 rounded-full bg-[#FFF8F7] flex items-center justify-center text-[#FF7C71] mb-4">
                  <SlidersHorizontal size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  No services found
                </h3>
                <p className="text-sm text-slate-400 mb-5 max-w-xs font-semibold">
                  Try widening your filters or clearing your search.
                </p>
                <button
                  type="button"
                  onClick={onClearAll}
                  className="px-6 py-2.5 rounded-xl bg-[#FF7C71] text-white text-sm font-bold hover:bg-[#E5675D] transition-all shadow-md cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 disabled:opacity-40 hover:border-[#FF7C71] hover:text-[#FF7C71] transition-all shadow-sm cursor-pointer"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setFilters({ currentPage: Math.max(1, currentPage - 1) })
                  }
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setFilters({ currentPage: page })}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all shadow-sm cursor-pointer ${currentPage === page
                          ? "bg-[#FF7C71] text-white border-[#FF7C71]"
                          : "border border-slate-100 bg-white text-slate-600 hover:border-[#FF7C71] hover:text-[#FF7C71]"
                        }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 disabled:opacity-40 hover:border-[#FF7C71] hover:text-[#FF7C71] transition-all shadow-sm cursor-pointer"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setFilters({
                      currentPage: Math.min(totalPages, currentPage + 1),
                    })
                  }
                >
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
