"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ServiceListing from './ServiceListing';

interface FilterState {
  activeCategory: string;
  searchQuery: string;
  selectedRating: string;
  sortBy: string;
  priceMax: number;
  selectedAvailability: string[];
  currentPage: number;
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

    return (
      <div>
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
      </div>
    );
};

export default ServiceLists;