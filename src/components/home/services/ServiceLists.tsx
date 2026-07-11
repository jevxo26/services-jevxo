"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ServiceListing from './ServiceListing';

const sectionVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 1.02, 0.43, 1.01],
    },
  },
} as const;

interface FilterState {
  activeCategory: string;
  searchQuery: string;
  selectedRating: string;
  sortBy: string;
  priceMax: number;
  selectedAvailability: string[];
  currentPage: number;
  vendorId: string;
  vendorName: string;
  vendorCategories: string[];
  devisionId: string;
}

const PRICE_CEIL = 5000;


function buildURL(params: Record<string, string>): string {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v),
  );
  const qs = new URLSearchParams(filtered).toString();
  return qs ? `?${qs}` : "";
}

const ServiceLists = () => {
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
    vendorId: searchParams.get("vendor") || "",
    vendorName: searchParams.get("vendor_name") || "",
    vendorCategories: (searchParams.get("categories") || "")
      .split(",")
      .filter(Boolean),
    devisionId: searchParams.get("devision") || "",
  });

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
      vendorId,
      vendorName,
      vendorCategories,
      devisionId,
    } = filters;
    const params: Record<string, string> = {
      category: activeCategory !== "all" ? activeCategory : "",
      q: searchQuery,
      min_rating: selectedRating,
      sort: sortBy !== "popularity" ? sortBy : "",
      price_max: priceMax < PRICE_CEIL ? String(priceMax) : "",
      availability: selectedAvailability.join(","),
      page: currentPage > 1 ? String(currentPage) : "",
      vendor: vendorId,
      vendor_name: vendorName,
      categories: vendorCategories.join(","),
      devision: devisionId,
    };
    router.replace(pathname + buildURL(params), { scroll: false });
  }, [filters, router, pathname]);

  useEffect(() => {
    syncURL();
  }, [syncURL]);

  useEffect(() => {
    const cat = filters.activeCategory;
    if (cat && (cat === "shifting" || cat === "10" || cat.toLowerCase().includes("shifting"))) {
      router.push("/home-shifting");
    }
  }, [filters.activeCategory, router]);

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
      vendorId: "",
      vendorName: "",
      vendorCategories: [],
      devisionId: "",
    });
  }, []);

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        {/* ── Listings ── */}
        <ServiceListing
          filters={filters}
          setFilters={setFilters}
          onClearAll={handleClearAll}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
        />
      </section>
    </motion.div>
  );
};

export default ServiceLists;