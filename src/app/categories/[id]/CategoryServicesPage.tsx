"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();

  const { data: categoryRes, isLoading: isCatLoading } = useGetPublicCategoryByIdQuery(
    Number(categoryId)
  );
  const category = categoryRes?.data || categoryRes;

  useEffect(() => {
    if (category) {
      const name = category.name?.toLowerCase() || "";
      const slug = category.slug?.toLowerCase() || "";
      if (name.includes("shifting") || slug.includes("shifting")) {
        router.replace("/home-shifting");
      }
    }
  }, [category, router]);

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
    <div className="min-h-screen bg-[#EEF2FF] relative">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: "auto" }}
      />

      <div className="relative z-10">
        {/* ── Premium Compact Category Header ── */}
        <div className="sticky top-16 md:top-[68px] z-40 w-full transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 md:px-6 pt-2">
            <div className="bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] py-3.5 md:py-4 px-4 md:px-6 flex items-center justify-between gap-4">
              
              <div className="flex-1 min-w-0">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  <Link href="/" className="hover:text-[#1E4E8C] transition-colors">Home</Link>
                  <span>/</span>
                  <Link href="/services" className="hover:text-[#1E4E8C] transition-colors">All Services</Link>
                  <span>/</span>
                  <span className="text-[#1E4E8C] font-black">{isCatLoading ? "..." : (category?.name || "Category")}</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Category icon / image */}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-gradient-to-br from-white to-[#FFF4EE] border border-[#1E4E8C]/15 flex items-center justify-center shrink-0 shadow-sm p-0.5">
                    {!isCatLoading && category?.icon ? (
                      <img
                        src={category.icon}
                        alt={category?.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <LayoutGrid className="w-5 h-5 text-[#1E4E8C]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-sm md:text-lg font-black text-slate-900 leading-tight tracking-tight">
                      {category?.name || "Category"}
                    </h1>
                    <p className="text-[10px] md:text-xs text-slate-400 font-semibold mt-0.5 max-w-xl line-clamp-1 leading-none">
                      {!category?.description || category.description.trim() === category.name.trim()
                        ? `Experience top-rated verified local professionals ready to assist you instantly.`
                        : category.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Back button */}
              <Link
                href="/services"
                className="flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold text-[#1E4E8C] hover:text-[#123C73] transition-all bg-[#FFF4EE] hover:bg-[#FFE8DD] border border-[#1E4E8C]/15 px-3.5 py-2 rounded-xl shrink-0 shadow-sm active:scale-95"
              >
                <ArrowLeft size={13} strokeWidth={2.5} />
                <span>Back</span>
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
