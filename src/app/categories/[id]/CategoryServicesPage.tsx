"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ServiceListing from "@/components/home/services/ServiceListing";
import { useGetPublicCategoryByIdQuery } from "@/redux/features/landing/landingApi";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import Link from "next/link";

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

export default function CategoryServicesPage({ categoryId }: { categoryId: string }) {
  const searchParams = useSearchParams();

  const { data: categoryRes, isLoading: isCatLoading } = useGetPublicCategoryByIdQuery(
    Number(categoryId)
  );
  const category = categoryRes?.data || categoryRes;

  const [filters, setFiltersState] = useState<FilterState>({
    activeCategory: categoryId,
    searchQuery: searchParams.get("q") || "",
    selectedRating: searchParams.get("min_rating") || "",
    sortBy: searchParams.get("sort") || "popularity",
    priceMax: Number(searchParams.get("price_max")) || PRICE_CEIL,
    selectedAvailability: (searchParams.get("availability") || "").split(",").filter(Boolean),
    currentPage: Number(searchParams.get("page")) || 1,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const setFilters = useCallback((partial: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  }, []);

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  const handleClearAll = useCallback(() => {
    setFiltersState({
      activeCategory: categoryId,
      searchQuery: "",
      selectedRating: "",
      sortBy: "popularity",
      priceMax: PRICE_CEIL,
      selectedAvailability: [],
      currentPage: 1,
    });
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-[#FFF8F7] relative">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-[0.06] pointer-events-none z-0"
        style={{ backgroundSize: "auto" }}
      />

      <div className="relative z-10">
        {/* ── Premium Category Hero Header ── */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-100/80 shadow-sm sticky top-0 z-40">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-5 md:py-7">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
              <Link href="/" className="hover:text-[#FF7C71] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-[#FF7C71] transition-colors">All Services</Link>
              <span>/</span>
              <span className="text-slate-600">{isCatLoading ? "..." : (category?.name || "Category")}</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Category icon / image */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-[#FFF0EF] border border-rose-100/50 flex items-center justify-center shrink-0 shadow-sm">
                {!isCatLoading && category?.icon ? (
                  <img
                    src={category.icon}
                    alt={category?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <LayoutGrid className="w-7 h-7 text-[#FF7C71]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {isCatLoading ? (
                  <div className="space-y-2">
                    <div className="h-6 w-40 bg-slate-200 animate-pulse rounded-lg" />
                    <div className="h-4 w-64 bg-slate-100 animate-pulse rounded-lg" />
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                      {category?.name || "Category"}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium max-w-xl line-clamp-2">
                      {category?.description ||
                        `Browse and book verified expert ${category?.name || ""} services in Dhaka, Bangladesh.`}
                    </p>
                  </>
                )}
              </div>

              {/* Back button */}
              <Link
                href="/services"
                className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#FF7C71] transition-colors bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 px-4 py-2.5 rounded-xl shrink-0"
              >
                <ArrowLeft size={15} />
                Back
              </Link>
            </div>
          </div>
        </div>

        {/* ── Services Listing — reuses full ServiceListing with sidebar ── */}
        <ServiceListing
          filters={filters}
          setFilters={setFilters}
          onClearAll={handleClearAll}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          categoryName={category?.name}
        />
      </div>
    </div>
  );
}
