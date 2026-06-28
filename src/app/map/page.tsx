"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Search, SlidersHorizontal, Map as MapIcon, List as ListIcon, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarList from "@/components/home/map/SidebarList";
import FilterSidebar from "@/components/home/map/FilterSidebar";
import ExpertCard from "@/components/home/map/ExpertCard";
import FiltersModal from "@/components/home/map/FiltersModal";
import DetailModal from "@/components/home/map/DetailModal";
import { Expert } from "@/components/home/map/types";
import { mapProfilesToExperts } from "@/components/home/map/mapVendorUtils";
import {
  useGetPublicProfilesQuery,
  useGetPublicCategoriesQuery,
} from "@/redux/features/landing/landingApi";
import {
  useGetAllDevisionsQuery,
  useGetAllDistrictsQuery,
} from "@/redux/features/admin/location";

const ALL_CATEGORIES = "All Categories";

const DhakaMap = dynamic(() => import("@/components/home/map/DhakaMap"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 min-h-[480px] md:min-h-[600px] md:h-full rounded-3xl border border-slate-200 bg-slate-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
        <p className="text-xs font-bold text-slate-400">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const { data: profilesRes, isLoading: isProfilesLoading } = useGetPublicProfilesQuery();
  const { data: categoriesRes } = useGetPublicCategoriesQuery();
  const { data: divisionsRes } = useGetAllDevisionsQuery();
  const { data: districtsRes } = useGetAllDistrictsQuery();

  const rawProfiles = profilesRes?.data ?? (Array.isArray(profilesRes) ? profilesRes : []);
  const allDistricts = districtsRes?.data ?? (Array.isArray(districtsRes) ? districtsRes : []);
  const allDivisions = divisionsRes?.data ?? (Array.isArray(divisionsRes) ? divisionsRes : []);

  const allExperts = useMemo(
    () => mapProfilesToExperts(rawProfiles, allDistricts, allDivisions),
    [rawProfiles, allDistricts, allDivisions]
  );

  const categories = useMemo(() => {
    const apiCategories = categoriesRes?.data ?? (Array.isArray(categoriesRes) ? categoriesRes : []);
    const apiNames = apiCategories.map((cat: any) => cat.name).filter(Boolean);
    if (apiNames.length > 0) return [ALL_CATEGORIES, ...apiNames];

    const fromExperts = Array.from(
      new Set(allExperts.flatMap((expert) => expert.categories).filter(Boolean))
    );
    return [ALL_CATEGORIES, ...fromExperts];
  }, [categoriesRes, allExperts]);

  const [activeTab, setActiveTab] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [selectedExpertId, setSelectedExpertId] = useState<string>("");

  const [sortBy, setSortBy] = useState("Recommended");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [minRating, setMinRating] = useState<number | null>(null);
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 50000 });
  const [tempMinRating, setTempMinRating] = useState<number | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [detailExpert, setDetailExpert] = useState<Expert | null>(null);

  useEffect(() => {
    if (!selectedExpertId && allExperts[0]) {
      setSelectedExpertId(allExperts[0].id);
    }
  }, [allExperts, selectedExpertId]);

  useEffect(() => {
    setTempPriceRange(priceRange);
    setTempMinRating(minRating);
  }, [showFiltersModal, priceRange, minRating]);

  const handleApplyFilters = () => {
    setPriceRange(tempPriceRange);
    setMinRating(tempMinRating);
    setShowFiltersModal(false);
  };

  const handleClearFilters = () => {
    setTempPriceRange({ min: 0, max: 50000 });
    setTempMinRating(null);
    setPriceRange({ min: 0, max: 50000 });
    setMinRating(null);
    setSelectedCategory(ALL_CATEGORIES);
    setSearchQuery("");
  };

  const matchesCategory = (expert: Expert, category: string) =>
    expert.categories.some((item) => item.toLowerCase() === category.toLowerCase());

  const filteredExperts = useMemo(() => {
    return allExperts
      .filter((expert) => {
        if (selectedCategory !== ALL_CATEGORIES && !matchesCategory(expert, selectedCategory)) {
          return false;
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesName = expert.name.toLowerCase().includes(query);
          const matchesLoc = expert.location.toLowerCase().includes(query);
          const matchesDistrict = expert.district.toLowerCase().includes(query);
          const matchesDivision = expert.division.toLowerCase().includes(query);
          const matchesAddress = expert.address.toLowerCase().includes(query);
          const matchesCat = expert.categories.some((item) =>
            item.toLowerCase().includes(query)
          );
          if (
            !matchesName &&
            !matchesLoc &&
            !matchesDistrict &&
            !matchesDivision &&
            !matchesAddress &&
            !matchesCat
          ) {
            return false;
          }
        }
        if (expert.price < priceRange.min || expert.price > priceRange.max) return false;
        if (minRating && expert.rating < minRating) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "Price: Low to High") return a.price - b.price;
        if (sortBy === "Price: High to Low") return b.price - a.price;
        if (sortBy === "Rating") return b.rating - a.rating;
        return b.completedJobs - a.completedJobs;
      });
  }, [allExperts, selectedCategory, searchQuery, priceRange, minRating, sortBy]);

  useEffect(() => {
    if (
      filteredExperts.length > 0 &&
      !filteredExperts.some((expert) => expert.id === selectedExpertId)
    ) {
      setSelectedExpertId(filteredExperts[0].id);
    }
  }, [filteredExperts, selectedExpertId]);

  if (isProfilesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF6014]" />
          <p className="text-sm font-semibold text-slate-500">Loading vendor profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <div className="flex-1 flex flex-col relative">
        {activeTab === "map" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex-1 flex flex-col md:flex-row gap-4 md:gap-6 py-4 md:py-5 h-[calc(100vh-72px)] min-h-[680px] overflow-hidden relative">
            <SidebarList
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              filteredExperts={filteredExperts}
              selectedExpertId={selectedExpertId}
              setSelectedExpertId={setSelectedExpertId}
              onOpenFilters={() => setShowFiltersModal(true)}
              onViewDetails={setDetailExpert}
            />

            <DhakaMap
              filteredExperts={filteredExperts}
              selectedExpertId={selectedExpertId}
              setSelectedExpertId={setSelectedExpertId}
              onViewDetails={setDetailExpert}
            />
          </div>
        )}

        {activeTab === "list" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 lg:py-20 flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10 items-center md:items-start text-center md:text-left">
              <div className="flex flex-col items-center md:items-start">
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                  Available Experts
                </h1>
                <p className="text-slate-500 mt-2 text-xs md:text-sm font-semibold max-w-md">
                  Discover verified vendors across Bangladesh on the live service map.
                </p>
              </div>

              <div className="bg-slate-100 p-1 rounded-full flex items-center w-40 border border-slate-200/50 shadow-xs shrink-0">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("map")}
                  className="flex-1 py-1.5 h-auto rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-500 hover:text-slate-800"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  Map
                </Button>
                <Button
                  onClick={() => setActiveTab("list")}
                  className="flex-1 py-1.5 h-auto rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-[#FF6014] hover:bg-[#FF6014]/90 text-white shadow-sm"
                >
                  <ListIcon className="w-3.5 h-3.5" />
                  List
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              <FilterSidebar
                sortBy={sortBy}
                setSortBy={setSortBy}
                tempPriceRange={tempPriceRange}
                setTempPriceRange={setTempPriceRange}
                tempMinRating={tempMinRating}
                setTempMinRating={setTempMinRating}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
              />

              <div className="lg:hidden flex items-center gap-3 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vendors or categories..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFiltersModal(true)}
                  className="bg-white border border-slate-200 p-2.5 h-auto rounded-xl text-slate-700 flex items-center gap-1 text-sm font-bold shadow-xs cursor-pointer hover:bg-slate-50"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
              </div>

              <div className="col-span-1 lg:col-span-3 space-y-6">
                {filteredExperts.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">No available experts</h3>
                    <p className="text-sm text-slate-500 mt-2">
                      Adjust your filters or search to discover vendors near you.
                    </p>
                    <Button
                      onClick={handleClearFilters}
                      className="mt-6 px-6 py-2.5 h-auto bg-[#FF6014] text-white font-bold rounded-xl text-sm shadow-xs hover:bg-[#E0530A] transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  filteredExperts.map((expert) => (
                    <ExpertCard
                      key={expert.id}
                      expert={expert}
                      onViewDetails={() => setDetailExpert(expert)}
                    />
                  ))
                )}

                {filteredExperts.length > 0 && (
                  <div className="flex justify-center pt-6">
                    <p className="text-sm font-semibold text-slate-400">
                      Showing {filteredExperts.length} vendor{filteredExperts.length === 1 ? "" : "s"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <FiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        tempPriceRange={tempPriceRange}
        setTempPriceRange={setTempPriceRange}
        tempMinRating={tempMinRating}
        setTempMinRating={setTempMinRating}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      <DetailModal expert={detailExpert} onClose={() => setDetailExpert(null)} />
    </div>
  );
}
