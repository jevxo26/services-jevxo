"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, MapPin, SlidersHorizontal, CheckCircle2, Award, ArrowLeft, RefreshCw, Phone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Slug mapping to display names
const SLUG_TO_NAME: Record<string, string> = {
  "ac-repair": "AC Repair",
  "plumbing": "Plumbing",
  "cleaning": "Cleaning",
  "electrical": "Electrical",
  "shifting": "Shifting",
  "cctv": "CCTV",
  "appliance-repair": "Appliance Repair",
  "painting": "Painting",
  "gardening": "Gardening",
  "pest-control": "Pest Control",
  "home-salon": "Home Salon",
  "carpentry": "Carpentry",
};

// All available categories list for subchips
const ALL_CATEGORIES = Object.entries(SLUG_TO_NAME).map(([slug, label]) => ({
  slug,
  label,
}));

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  description: string;
  isVerified: boolean;
  isAvailable: boolean;
  location: string;
  jobsCompleted: number;
}

// Expanded mock providers database
const PROVIDERS_DATA: ServiceProvider[] = [
  // AC Repair
  {
    id: "p-ac-1",
    name: "Zaman AC Solutions",
    category: "ac-repair",
    rating: 4.9,
    reviews: 128,
    price: 1500,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
    description: "Expert AC servicing, master installation, and high-precision gas charging. Specialized in both residential and industrial HVAC systems.",
    isVerified: true,
    isAvailable: true,
    location: "Gulshan, Dhaka",
    jobsCompleted: 450
  },
  {
    id: "p-ac-2",
    name: "Dhaka Cool Experts",
    category: "ac-repair",
    rating: 4.8,
    reviews: 94,
    price: 750,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop",
    description: "Affordable AC repair, filtering system cleaning, and fast emergency repair services in Dhaka area.",
    isVerified: true,
    isAvailable: true,
    location: "Mirpur, Dhaka",
    jobsCompleted: 230
  },
  // Plumbing
  {
    id: "p-pl-1",
    name: "ProFlow Plumbing Specialists",
    category: "plumbing",
    rating: 4.9,
    reviews: 92,
    price: 600,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop",
    description: "Expert plumbing fixes, tap leaks repair, bathroom pipe fitting, and high pressure water line cleaning.",
    isVerified: true,
    isAvailable: true,
    location: "Mirpur, Dhaka",
    jobsCompleted: 310
  },
  {
    id: "p-pl-2",
    name: "Dhaka Pipe Fixers",
    category: "plumbing",
    rating: 4.7,
    reviews: 48,
    price: 450,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    description: "Quick plumbing repairs, blockages clearing, basin installation, and water pump repair services.",
    isVerified: false,
    isAvailable: true,
    location: "Banani, Dhaka",
    jobsCompleted: 110
  },
  // Cleaning
  {
    id: "p-cl-1",
    name: "Elite Shine Cleaners",
    category: "cleaning",
    rating: 4.8,
    reviews: 84,
    price: 3200,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    description: "Professional deep cleaning using non-toxic materials. We restore the luxury of your home with meticulous attention to detail.",
    isVerified: true,
    isAvailable: true,
    location: "Banani, Dhaka",
    jobsCompleted: 280
  },
  {
    id: "p-cl-2",
    name: "EcoClean Dhaka",
    category: "cleaning",
    rating: 4.7,
    reviews: 150,
    price: 800,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    description: "Deep cleaning & sanitization experts for residential flats and office spaces. Multi-step cleaning guarantee with eco-friendly tools.",
    isVerified: true,
    isAvailable: true,
    location: "Banani, Dhaka",
    jobsCompleted: 340
  },
  // Electrical
  {
    id: "p-el-1",
    name: "Spark Safety Electric",
    category: "electrical",
    rating: 4.7,
    reviews: 210,
    price: 800,
    image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=600&auto=format&fit=crop",
    description: "Reliable electrical maintenance and safety audits. From smart home wiring to emergency repair, we handle everything with precision.",
    isVerified: true,
    isAvailable: true,
    location: "Dhanmondi, Dhaka",
    jobsCompleted: 620
  },
  {
    id: "p-el-2",
    name: "VoltGuard Solutions",
    category: "electrical",
    rating: 4.8,
    reviews: 96,
    price: 500,
    image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=600&auto=format&fit=crop",
    description: "Full wiring & device installation. From ceiling fans to complex breaker boxes, our certified technicians ensure a safe and professional setup.",
    isVerified: true,
    isAvailable: false,
    location: "Baridhara, Dhaka",
    jobsCompleted: 190
  },
  // Shifting
  {
    id: "p-sh-1",
    name: "Dhaka Shift & Move",
    category: "shifting",
    rating: 4.7,
    reviews: 54,
    price: 4500,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
    description: "Professional house shifting and furniture moving. Fully secure transport with expert packers and loaders.",
    isVerified: true,
    isAvailable: true,
    location: "Uttara, Dhaka",
    jobsCompleted: 140
  },
  // CCTV
  {
    id: "p-cc-1",
    name: "SecureForce CCTV Installation",
    category: "cctv",
    rating: 4.9,
    reviews: 45,
    price: 1200,
    image: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=600&auto=format&fit=crop",
    description: "Home CCTV camera setup, IP camera configuration, DVR diagnostics, and mobile remote viewing setup.",
    isVerified: true,
    isAvailable: true,
    location: "Mohakhali, Dhaka",
    jobsCompleted: 180
  },
  // Painting
  {
    id: "p-pa-1",
    name: "Rainbow Premium Painters",
    category: "painting",
    rating: 4.8,
    reviews: 73,
    price: 2500,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
    description: "Interior and exterior wall painting, wall putty work, and luxury texture finishing. Dust-free service guaranteed.",
    isVerified: true,
    isAvailable: true,
    location: "Gulshan, Dhaka",
    jobsCompleted: 210
  },
  // Home Salon
  {
    id: "p-hs-1",
    name: "Glam & Glow Home Salon",
    category: "home-salon",
    rating: 4.8,
    reviews: 112,
    price: 1500,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    description: "Premium ladies facial, haircut, pedicure, manicure, and bridal makeovers directly at your home.",
    isVerified: true,
    isAvailable: true,
    location: "Banani, Dhaka",
    jobsCompleted: 290
  }
];

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap parameters according to React 19/Next 16 standards
  const { slug } = React.use(params);

  // States
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [minRating, setMinRating] = useState<number>(0);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(false);

  const categoryName = SLUG_TO_NAME[slug] || slug.replace("-", " ");

  // Wishlist handler
  const toggleWishlist = (id: string) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter Logic
  const getFilteredProviders = () => {
    return PROVIDERS_DATA.filter(p => {
      // Category match
      if (p.category !== slug) return false;
      // Price filter
      if (p.price < minPrice || p.price > maxPrice) return false;
      // Rating filter
      if (p.rating < minRating) return false;
      // Availability filter
      if (showOnlyAvailable && !p.isAvailable) return false;
      return true;
    });
  };

  const filteredProviders = getFilteredProviders();

  // Reset Filters handler
  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(10000);
    setMinRating(0);
    setShowOnlyAvailable(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href="/services" className="hover:text-primary transition-colors">Categories</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-600">{categoryName}</span>
        </div>

        {/* Dynamic count title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-wide">
            {filteredProviders.length} results found for <span className="text-[#FF5A5F]">{categoryName}</span>
          </h1>
          <p className="text-sm text-slate-500">
            Book top-rated, background-checked service professionals in Dhaka.
          </p>
        </div>

        {/* ── TWO COLUMN MAIN PANEL ── */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Sticky Filters (3 Columns) */}
          <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 uppercase tracking-wider">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                Filters
              </h2>
              <Button 
                variant="ghost"
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#FF5A5F] hover:underline flex items-center gap-1 cursor-pointer p-1 h-auto hover:bg-slate-50 hover:text-[#FF5A5F]"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </Button>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wide">Price Range (BDT)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">MIN</span>
                  <input 
                    type="number" 
                    value={minPrice}
                    onChange={e => setMinPrice(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary text-slate-700 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">MAX</span>
                  <input 
                    type="number" 
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary text-slate-700 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wide">Customer Rating</h3>
              <div className="space-y-2">
                {[
                  { value: 0, label: "All Ratings" },
                  { value: 4.8, label: "4.8★ & above" },
                  { value: 4.5, label: "4.5★ & above" },
                ].map(item => (
                  <label key={item.value} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                    <input 
                      type="radio" 
                      name="rating-filter"
                      checked={minRating === item.value}
                      onChange={() => setMinRating(item.value)}
                      className="accent-[#FF5A5F] w-4 h-4"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-50">
              <label className="flex items-center justify-between text-xs font-bold text-slate-850 cursor-pointer uppercase tracking-wide">
                <span>Show Only Available</span>
                <input 
                  type="checkbox" 
                  checked={showOnlyAvailable}
                  onChange={e => setShowOnlyAvailable(e.target.checked)}
                  className="accent-[#FF5A5F] w-4 h-4"
                />
              </label>
            </div>

            {/* Sub-chips: Other Categories */}
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wide">Other Categories</h3>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map(other => {
                  const isActive = other.slug === slug;
                  return (
                    <Link key={other.slug} href={`/categories/${other.slug}`} className="block">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-wide border inline-block transition-all cursor-pointer ${
                        isActive 
                          ? "bg-[#FF5A5F] border-[#FF5A5F] text-white" 
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
                      }`}>
                        {other.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Grid of Providers (9 Columns) */}
          <div className="lg:col-span-9">
            {filteredProviders.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-[32px] p-12 text-center shadow-xs">
                <RefreshCw className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-spin-slow" />
                <h3 className="text-lg font-bold text-slate-800">No experts fit this criteria</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                  Try adjusting the BDT price slider, relaxing ratings, or resetting preferences.
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2.5 h-auto bg-[#FF5A5F] text-white font-bold rounded-xl text-xs hover:bg-[#FF4449] transition-colors cursor-pointer"
                >
                  Clear Active Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProviders.map(provider => (
                  <div 
                    key={provider.id}
                    className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.035)] transition-all duration-300 flex flex-col justify-between h-full group"
                  >
                    <div>
                      {/* Image Block */}
                      <div className="h-48 md:h-52 bg-slate-100 relative overflow-hidden">
                        <Image 
                          src={provider.image}
                          alt={provider.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Verified badge */}
                        {provider.isVerified && (
                          <div className="absolute top-4 left-4 bg-white px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider flex items-center gap-1 shadow-xs text-slate-800 uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Verified
                          </div>
                        )}

                        {/* Wishlist toggle */}
                        <Button
                          variant="ghost"
                          onClick={() => toggleWishlist(provider.id)}
                          className="absolute top-4 right-4 w-8 h-8 p-0 rounded-full bg-white flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 transition-colors ${wishlist[provider.id] ? "fill-[#FF5A5F] text-[#FF5A5F]" : "text-slate-500"}`} />
                        </Button>
                      </div>

                      {/* Info Details */}
                      <div className="p-6 space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold tracking-wider bg-rose-50 border border-rose-100 text-[#FF5A5F] px-2.5 py-0.5 rounded-full inline-block uppercase">
                            {categoryName}
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-base leading-snug tracking-tight flex items-center gap-1.5">
                            {provider.name}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {provider.description}
                        </p>

                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-1">
                          <div className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{provider.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-slate-800 font-extrabold">{provider.rating.toFixed(1)}</span>
                            <span className="text-slate-400">({provider.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price and Action Footer */}
                    <div className="p-6 border-t border-slate-50 flex justify-between items-center bg-white">
                      <div className="text-sm font-black text-slate-900">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Starting at</span>
                        <span className="text-primary text-base">৳{provider.price}</span>
                      </div>
                      
                      <Link href={`/book/${provider.id}`}>
                        <Button className="bg-primary hover:bg-primary/90 hover:scale-105 text-white text-xs font-bold px-4 py-2.5 h-auto rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 border-none">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Concierge Call-out Banner */}
        <div className="mt-16 bg-[#FFF0F1] border border-rose-100 rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#FF5A5F]/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
          <div className="space-y-2 relative z-10 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A5F] bg-white px-3 py-1 rounded-full border border-rose-100 shadow-xs">
              Concierge Service
            </span>
            <h3 className="text-xl font-bold text-slate-900 pt-2">Need a custom business quote?</h3>
            <p className="text-slate-500 text-sm max-w-xl">
              If you require a custom contract, commercial volume pricing, or dedicated account manager, contact our concierge desk.
            </p>
          </div>
          <a
            href="tel:+8809612725732"
            className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3.5 rounded-2xl shadow-sm transition-all duration-200 active:scale-95 text-base flex-shrink-0 cursor-pointer text-center whitespace-nowrap relative z-10"
          >
            Call +880 9612-RAJSEBA
          </a>
        </div>

      </div>
    </div>
  );
}
