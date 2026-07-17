"use client";

import dynamic from "next/dynamic";
import { Search, SlidersHorizontal, Map as MapIcon, List as ListIcon, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarList from "@/components/home/map/SidebarList";
import FilterSidebar from "@/components/home/map/FilterSidebar";
import ExpertCard from "@/components/home/map/ExpertCard";
import FiltersModal from "@/components/home/map/FiltersModal";
import DetailModal from "@/components/home/map/DetailModal";
import { useMapState } from "@/app/map/hooks/useMapState";
import "@/components/home/map/leaflet-custom.css";

const DhakaMap = dynamic(() => import("@/components/home/map/DhakaMap"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 min-h-[480px] md:min-h-[600px] md:h-full rounded-3xl border border-slate-200 bg-slate-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" />
        <p className="text-xs font-bold text-slate-400">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const {
    isProfilesLoading, filteredExperts, categories, activeTab, setActiveTab,
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    selectedExpertId, setSelectedExpertId, sortBy, setSortBy,
    tempPriceRange, setTempPriceRange, tempMinRating, setTempMinRating,
    showFiltersModal, setShowFiltersModal, detailExpert, setDetailExpert,
    handleApplyFilters, handleClearFilters,
  } = useMapState();

  if (isProfilesLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <Loader2 className="w-10 h-10 animate-spin text-[#4F46E5]" />
          <p className="text-sm font-semibold text-slate-500">Loading vendor profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans relative">
      <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />
      <div className="flex-1 flex flex-col relative z-10">
        {activeTab === "map" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex-1 flex flex-col gap-4 md:gap-5 py-4 md:py-5 h-[calc(100vh-72px)] min-h-[720px] overflow-hidden relative">
            {/* Professional Help Header Section */}
            <div className="bg-white border border-slate-100 p-4 md:p-5 rounded-[28px] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] shrink-0">
                  <MapIcon className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    Live Vendor Locator Map
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#4F46E5]/10 text-[#4F46E5] uppercase tracking-wide">
                      Live
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Locate verified service professionals, check starting rates, and book service partners in your region.
                  </p>
                </div>
              </div>

              {/* Instructions/Help guide */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 lg:justify-end text-[11px] font-bold text-slate-500 bg-slate-50 p-2 md:p-3 rounded-2xl border border-slate-100/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-extrabold text-[10px]">1</span>
                  <span>Select Category</span>
                </div>
                <div className="h-3 w-px bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-extrabold text-[10px]">2</span>
                  <span>Tap Location Pin</span>
                </div>
                <div className="h-3 w-px bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-extrabold text-[10px]">3</span>
                  <span>Click 'View Profile' & Book</span>
                </div>
              </div>
            </div>

            {/* Sidebar + Map Container */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 min-h-0 relative">
              <SidebarList searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} activeTab={activeTab} setActiveTab={setActiveTab} filteredExperts={filteredExperts} selectedExpertId={selectedExpertId} setSelectedExpertId={setSelectedExpertId} onOpenFilters={() => setShowFiltersModal(true)} onViewDetails={setDetailExpert} />
              <DhakaMap filteredExperts={filteredExperts} selectedExpertId={selectedExpertId} setSelectedExpertId={setSelectedExpertId} onViewDetails={setDetailExpert} />
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 lg:py-20 flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10 items-center md:items-start text-center md:text-left">
              <div className="flex flex-col items-center md:items-start">
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Available Experts</h1>
                <p className="text-slate-500 mt-2 text-xs md:text-sm font-semibold max-w-md">Discover verified vendors across Bangladesh on the live service map.</p>
              </div>
              <div className="bg-slate-100 p-1 rounded-full flex items-center w-40 border border-slate-200/50 shadow-xs shrink-0">
                <Button variant="ghost" onClick={() => setActiveTab("map")} className="flex-1 py-1.5 h-auto rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-500 hover:text-slate-800">
                  <MapIcon className="w-3.5 h-3.5" />Map
                </Button>
                <Button onClick={() => setActiveTab("list")} className="flex-1 py-1.5 h-auto rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white shadow-sm">
                  <ListIcon className="w-3.5 h-3.5" />List
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              <FilterSidebar sortBy={sortBy} setSortBy={setSortBy} tempPriceRange={tempPriceRange} setTempPriceRange={setTempPriceRange} tempMinRating={tempMinRating} setTempMinRating={setTempMinRating} onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} />

              <div className="lg:hidden flex items-center gap-3 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search vendors or categories..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400" />
                </div>
                <Button variant="outline" onClick={() => setShowFiltersModal(true)} className="bg-white border border-slate-200 p-2.5 h-auto rounded-xl text-slate-700 flex items-center gap-1 text-sm font-bold shadow-xs cursor-pointer hover:bg-slate-50">
                  <SlidersHorizontal className="w-4 h-4" />Filters
                </Button>
              </div>

              <div className="col-span-1 lg:col-span-3 space-y-6">
                {filteredExperts.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">No available experts</h3>
                    <p className="text-sm text-slate-500 mt-2">Adjust your filters or search to discover vendors near you.</p>
                    <Button onClick={handleClearFilters} className="mt-6 px-6 py-2.5 h-auto bg-[#4F46E5] text-white font-bold rounded-xl text-sm shadow-xs hover:bg-[#4338CA] transition-colors cursor-pointer">Clear Filters</Button>
                  </div>
                ) : (
                  filteredExperts.map((expert) => (
                    <ExpertCard key={expert.id} expert={expert} onViewDetails={() => setDetailExpert(expert)} />
                  ))
                )}
                {filteredExperts.length > 0 && (
                  <div className="flex justify-center pt-6">
                    <p className="text-sm font-semibold text-slate-400">Showing {filteredExperts.length} vendor{filteredExperts.length === 1 ? "" : "s"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <FiltersModal isOpen={showFiltersModal} onClose={() => setShowFiltersModal(false)} tempPriceRange={tempPriceRange} setTempPriceRange={setTempPriceRange} tempMinRating={tempMinRating} setTempMinRating={setTempMinRating} sortBy={sortBy} setSortBy={setSortBy} onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} />
      <DetailModal expert={detailExpert} onClose={() => setDetailExpert(null)} />
    </div>
  );
}
