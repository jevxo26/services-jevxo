import { ArrowLeft, ArrowRight, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";
import FilterPanel from "./FilterPanel";
import ServiceCard from "./ServiceCard";

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
interface FilterState {
  activeCategory: string;
  searchQuery: string;
  selectedRating: string;
  sortBy: string;
  priceMax: number;
  selectedAvailability: string[];
  currentPage: number;
}

const RATING_OPTIONS = [
  { value: "5.0", label: "5.0 only" },
  { value: "4.5", label: "4.5 & up" },
  { value: "4.0", label: "4.0 & up" },
];

const moreServices = Array.from({ length: 12 }, (_, i) => ({
  id: `service-${i + 7}`,
  title: `Service ${i + 7}`,
  description: "Professional home service with expert technicians.",
  image: "/images/service/service-1.png",
  category: "cleaning",
  categoryLabel: "Cleaning",
  price: 800 + i * 100,
  priceDisplay: `৳${800 + i * 100}`,
  done: "1.2k+ done",
  rating: 4.5 + (i % 3) * 0.1,
  availability: ["today"],
  daysAgo: i % 10,
}));

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
  ...moreServices,
];

const PER_PAGE = 9;
const PRICE_CEIL = 5000;


export default function ServiceListing({
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
    <section className="">
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
            <h2 className="text-2xl font-bold text-[#1a1a1a]">
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
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#e5e7eb] text-[#4b5563] disabled:opacity-40 hover:border-[#ff5a5f] hover:text-[#ff5a5f] transition-all"
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
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
                      currentPage === page
                        ? "bg-[#ff5a5f] text-white border-[#ff5a5f]"
                        : "border border-[#e5e7eb] text-[#4b5563] hover:border-[#ff5a5f] hover:text-[#ff5a5f]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#e5e7eb] text-[#4b5563] disabled:opacity-40 hover:border-[#ff5a5f] hover:text-[#ff5a5f] transition-all"
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
    </section>
  );
}
