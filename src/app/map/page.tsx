"use client";

import { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, Map as MapIcon, List as ListIcon, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Component imports
import DhakaMap from "@/components/home/map/DhakaMap";
import SidebarList from "@/components/home/map/SidebarList";
import FilterSidebar from "@/components/home/map/FilterSidebar";
import ExpertCard from "@/components/home/map/ExpertCard";
import FiltersModal from "@/components/home/map/FiltersModal";
import DetailModal from "@/components/home/map/DetailModal";
import { Expert } from "@/components/home/map/types";

// Dynamic Mock Database
const EXPERTS_DATA: Expert[] = [
  {
    id: "zaman-ac",
    name: "Zaman AC Solutions",
    category: "AC Repair",
    rating: 4.9,
    reviews: 128,
    badge: "Top Rated",
    location: "Gulshan 2, Dhaka",
    distance: "0.8km away",
    status: "Identity Verified",
    description: "Expert AC servicing, master installation, and high-precision gas charging. Specialized in both residential and industrial HVAC systems.",
    price: 1500,
    coords: { x: 55, y: 28 },
    icon: "ac",
    phone: "+880 1711-223344",
    completedJobs: 450
  },
  {
    id: "elite-shine",
    name: "Elite Shine Cleaners",
    category: "Cleaning",
    rating: 4.8,
    reviews: 84,
    badge: "Expert",
    location: "Banani, Dhaka",
    distance: "1.2km away",
    status: "Next Available: Tomorrow",
    description: "Professional deep cleaning using non-toxic materials. We restore the luxury of your home with meticulous attention to detail.",
    price: 3200,
    coords: { x: 30, y: 35 },
    icon: "cleaning",
    phone: "+880 1812-334455",
    completedJobs: 280
  },
  {
    id: "spark-safety",
    name: "Spark Safety Electric",
    category: "Electrical",
    rating: 4.7,
    reviews: 210,
    badge: "Popular",
    location: "Dhanmondi, Dhaka",
    distance: "3.5km away",
    status: "Background Checked",
    description: "Reliable electrical maintenance and safety audits. From smart home wiring to emergency repair, we handle everything with precision.",
    price: 800,
    coords: { x: 20, y: 75 },
    icon: "electric",
    phone: "+880 1913-445566",
    completedJobs: 620
  },
  {
    id: "ecoclean-dhaka",
    name: "EcoClean Dhaka",
    category: "Cleaning",
    rating: 4.7,
    reviews: 150,
    badge: "Popular",
    location: "Banani, Dhaka",
    distance: "1.5km away",
    status: "Background Checked",
    description: "Deep cleaning & sanitization experts for residential flats and office spaces. Multi-step cleaning guarantee with eco-friendly tools.",
    price: 800,
    coords: { x: 35, y: 22 },
    icon: "cleaning",
    phone: "+880 1614-556677",
    completedJobs: 340
  },
  {
    id: "modern-electric",
    name: "Modern Electric",
    category: "Electrical",
    rating: 4.8,
    reviews: 96,
    badge: "Expert",
    location: "Baridhara, Dhaka",
    distance: "2.5km away",
    status: "Identity Verified",
    description: "Full wiring & device installation. From ceiling fans to complex breaker boxes, our certified technicians ensure a safe and professional setup.",
    price: 500,
    coords: { x: 75, y: 18 },
    icon: "electric",
    phone: "+880 1515-667788",
    completedJobs: 190
  },
  {
    id: "pro-flow-plumbing",
    name: "ProFlow Plumbing Specialists",
    category: "Plumbing",
    rating: 4.9,
    reviews: 92,
    badge: "Expert",
    location: "Mirpur 10, Dhaka",
    distance: "2.8km away",
    status: "Identity Verified",
    description: "Expert plumbing fixes, tap leaks repair, bathroom pipe fitting, and high pressure water line cleaning.",
    price: 600,
    coords: { x: 45, y: 60 },
    icon: "plumbing",
    phone: "+880 1711-556677",
    completedJobs: 310
  },
  {
    id: "dhaka-movers",
    name: "Dhaka Shift & Move",
    category: "Shifting",
    rating: 4.7,
    reviews: 54,
    badge: "Popular",
    location: "Uttara Sector 4, Dhaka",
    distance: "4.2km away",
    status: "Available Now",
    description: "Professional house shifting and furniture moving. Fully secure transport with expert packers and loaders.",
    price: 4500,
    coords: { x: 50, y: 15 },
    icon: "shifting",
    phone: "+880 1813-889900",
    completedJobs: 140
  },
  {
    id: "rainbow-painting",
    name: "Rainbow Premium Painters",
    category: "Painting",
    rating: 4.8,
    reviews: 73,
    badge: "Top Rated",
    location: "Gulshan 1, Dhaka",
    distance: "1.0km away",
    status: "Identity Verified",
    description: "Interior and exterior wall painting, wall putty work, and luxury texture finishing. Dust-free service guaranteed.",
    price: 2500,
    coords: { x: 60, y: 45 },
    icon: "painting",
    phone: "+880 1914-332211",
    completedJobs: 210
  },
  {
    id: "cctv-secure",
    name: "SecureForce CCTV Installation",
    category: "CCTV",
    rating: 4.9,
    reviews: 45,
    badge: "Popular",
    location: "Mohakhali, Dhaka",
    distance: "1.9km away",
    status: "Available Today",
    description: "Home CCTV camera setup, IP camera configuration, DVR diagnostics, and mobile remote viewing setup.",
    price: 1200,
    coords: { x: 40, y: 40 },
    icon: "cctv",
    phone: "+880 1512-990088",
    completedJobs: 180
  },
  {
    id: "glam-home-salon",
    name: "Glam & Glow Home Salon",
    category: "Home Salon",
    rating: 4.8,
    reviews: 112,
    badge: "Top Rated",
    location: "Banani, Dhaka",
    distance: "1.1km away",
    status: "Background Checked",
    description: "Premium ladies facial, haircut, pedicure, manicure, and bridal makeovers directly at your home.",
    price: 1500,
    coords: { x: 32, y: 28 },
    icon: "salon",
    phone: "+880 1618-112233",
    completedJobs: 290
  }
];

export default function MapPage() {
  const [activeTab, setActiveTab] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [selectedExpertId, setSelectedExpertId] = useState<string>("zaman-ac");
  
  // Filters State
  const [sortBy, setSortBy] = useState("Recommended");
  const [priceRange, setPriceRange] = useState({ min: 500, max: 10000 });
  const [minRating, setMinRating] = useState<number | null>(4.0);
  const [tempPriceRange, setTempPriceRange] = useState({ min: 500, max: 10000 });
  const [tempMinRating, setTempMinRating] = useState<number | null>(4.0);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Map Pan / Zoom State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Profile Overlay State
  const [detailExpert, setDetailExpert] = useState<Expert | null>(null);

  // Sync temp filters with actual values
  useEffect(() => {
    setTempPriceRange(priceRange);
    setTempMinRating(minRating);
  }, [showFiltersModal]);

  const handleApplyFilters = () => {
    setPriceRange(tempPriceRange);
    setMinRating(tempMinRating);
    setShowFiltersModal(false);
  };

  const handleClearFilters = () => {
    setTempPriceRange({ min: 500, max: 10000 });
    setTempMinRating(null);
    setPriceRange({ min: 500, max: 10000 });
    setMinRating(null);
  };

  // Filter & Sort Logic
  const getFilteredExperts = () => {
    return EXPERTS_DATA.filter((expert) => {
      if (selectedCategory !== "All Services" && expert.category !== selectedCategory) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = expert.name.toLowerCase().includes(query);
        const matchesLoc = expert.location.toLowerCase().includes(query);
        const matchesCat = expert.category.toLowerCase().includes(query);
        if (!matchesName && !matchesLoc && !matchesCat) return false;
      }
      if (expert.price < priceRange.min || expert.price > priceRange.max) {
        return false;
      }
      if (minRating && expert.rating < minRating) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Rating") return b.rating - a.rating;
      return 0;
    });
  };

  const filteredExperts = getFilteredExperts();
  const selectedExpert = EXPERTS_DATA.find((e) => e.id === selectedExpertId);

  // Pan map to center on selected pin
  useEffect(() => {
    if (selectedExpert && mapContainerRef.current) {
      const containerWidth = mapContainerRef.current.clientWidth;
      const containerHeight = mapContainerRef.current.clientHeight;
      const targetX = -(selectedExpert.coords.x - 50) * (containerWidth / 100) * zoom;
      const targetY = -(selectedExpert.coords.y - 50) * (containerHeight / 100) * zoom;
      setPan({ x: targetX, y: targetY });
    }
  }, [selectedExpertId, zoom]);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <div className="flex-1 flex flex-col relative">
        {/* ==================== MAP TAB VIEW ==================== */}
        {activeTab === "map" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex-1 flex flex-col md:flex-row gap-6 py-6 h-[calc(100vh-110px)] min-h-[500px] overflow-hidden relative">
            <SidebarList
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              filteredExperts={filteredExperts}
              selectedExpertId={selectedExpertId}
              setSelectedExpertId={setSelectedExpertId}
              onOpenFilters={() => setShowFiltersModal(true)}
            />

            <DhakaMap
              filteredExperts={filteredExperts}
              selectedExpertId={selectedExpertId}
              setSelectedExpertId={setSelectedExpertId}
              zoom={zoom}
              setZoom={setZoom}
              pan={pan}
              setPan={setPan}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              mapContainerRef={mapContainerRef}
            />
          </div>
        )}

        {/* ==================== LIST TAB VIEW ==================== */}
        {activeTab === "list" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20 flex-1 w-full">
            {/* Header Layout Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-10">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-wide">
                  Available Experts
                </h1>
                <p className="text-slate-500 mt-2 text-sm md:text-base">
                  Discover top-rated professionals in Dhaka for your home needs.
                </p>
              </div>

              {/* View Switcher Toggle */}
              <div className="bg-slate-100 p-1 rounded-full flex items-center w-40 self-start md:self-auto border border-slate-200/50 shadow-xs">
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
                  className="flex-1 py-1.5 h-auto rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-[#FF5A5F] hover:bg-[#FF5A5F]/90 text-white shadow-sm"
                >
                  <ListIcon className="w-3.5 h-3.5" />
                  List
                </Button>
              </div>
            </div>

            {/* Split layout grid */}
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

              {/* Mobile filter floating trigger row */}
              <div className="lg:hidden flex items-center gap-3 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services..."
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

              {/* Experts cards list wrapper */}
              <div className="col-span-1 lg:col-span-3 space-y-6">
                {filteredExperts.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">
                      No available experts
                    </h3>
                    <p className="text-sm text-slate-500 mt-2">
                      Adjust your price values or minimum rating thresholds to
                      discover results.
                    </p>
                    <Button
                      onClick={handleClearFilters}
                      className="mt-6 px-6 py-2.5 h-auto bg-[#FF5A5F] text-white font-bold rounded-xl text-sm shadow-xs hover:bg-[#FF4449] transition-colors cursor-pointer"
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

                {/* Load More Trigger */}
                {filteredExperts.length > 0 && (
                  <div className="flex justify-center pt-6">
                    <Button variant="outline" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-bold text-sm border border-slate-200 rounded-full px-6 py-3 h-auto bg-white hover:bg-slate-50 transition-colors shadow-xs cursor-pointer">
                      Load More Experts
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Filter modal dialog */}
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

      {/* Profile Detail overlay modal */}
      <DetailModal
        expert={detailExpert}
        onClose={() => setDetailExpert(null)}
      />
    </div>
  );
}
