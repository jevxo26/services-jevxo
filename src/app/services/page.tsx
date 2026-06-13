"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const serviceCategories = [
  { id: "premium-deep-cleaning", label: "Cleaning", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2l-6 6" /><path d="M15.5 15.5L10 21l-4-4L11.5 11.5" /><path d="M21 3l-6 6" /></svg> },
  { id: "master-ac-service", label: "AC Repair", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="12" y1="2" x2="16" y2="6"></line><line x1="12" y1="2" x2="8" y2="6"></line><line x1="12" y1="22" x2="16" y2="18"></line><line x1="12" y1="22" x2="8" y2="18"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="12" x2="6" y2="8"></line><line x1="2" y1="12" x2="6" y2="16"></line><line x1="22" y1="12" x2="18" y2="8"></line><line x1="22" y1="12" x2="18" y2="16"></line><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line><line x1="4.93" y1="19.07" x2="19.07" y2="4.93"></line></svg> },
  { id: "expert-plumbing", label: "Plumbing", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg> },
  { id: "electrical-solution", label: "Electrical", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> },
  { id: "luxe-painting", label: "Painting", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2v4" /><path d="M21 2v4" /><path d="M14 6h8v6h-8z" /><path d="M14 8H7a2 2 0 0 0-2 2v6" /><path d="M9 16v6h2v-6z" /></svg> },
  { id: "cctv", label: "CCTV", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> },
  { id: "premium-shifting", label: "Shifting", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> },
  { id: "appliance-repair", label: "Appliance Repair", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /><line x1="2" y1="2" x2="22" y2="22" /></svg> },
];

const trendingServices = [
  {
    id: "premium-deep-cleaning",
    title: "Premium Deep Cleaning",
    description:
      "Full home sanitization using eco-friendly industrial equipment. Perfect for move-ins or seasonal refreshes.",
    image: "/images/service/service-1.png",
    rating: 4.9,
    reviews: "2.4k",
    price: 4500,
    badge: "MOST BOOKED",
    featured: true,
  },
  {
    id: "master-ac-service",
    title: "Master AC Service",
    description:
      "Comprehensive cleaning and gas top-up for all split brands.",
    image: "/images/service/service-2.png",
    rating: 4.8,
    reviews: "1.8k",
    price: 1200,
    badge: null,
    featured: false,
  },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("ac-repair");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#fef7f5] flex items-start justify-center pt-[80px] px-6 pb-6">
        <div className="max-w-[800px] w-full flex flex-col items-center text-center gap-6">
          <h1 className="text-[2.75rem] font-bold text-[#1a1a1a] leading-[1.15] tracking-[-0.03em] m-0">Find the best home <span className="text-[#ff5a5f]">services</span></h1>
          <p className="text-[1.05rem] text-[#6b7280] leading-[1.6] m-0 max-w-[520px]">
            Premium, reliable, and effortless solutions for your urban lifestyle
            in Bangladesh.
          </p>

          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-2 pr-2 pl-6 w-full max-w-[750px] mt-2 border border-[#e5e7eb] transition-shadow duration-300 focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.1)] focus-within:border-red-100">
            <div className="flex items-center flex-1 gap-3">
              <svg
                className="text-[#9ca3af] shrink-0"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                id="service-search"
                type="text"
                placeholder="What service do you need?"
                className="flex-1 border-none outline-none text-base text-[#1a1a1a] bg-transparent py-3.5 placeholder:text-[#9ca3af]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1.5 px-4 border-l border-[#e5e7eb] whitespace-nowrap">
              <svg
                className="text-[#9ca3af] shrink-0"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-[0.9rem] font-medium text-[#1a1a1a]">Dhaka, BD</span>
            </div>
            <button
              id="filter-button"
              className="flex items-center justify-center w-[46px] h-[46px] rounded-full bg-[#ff5a5f] text-white border-none cursor-pointer shrink-0 transition-all duration-300 hover:bg-[#e04a4f] hover:scale-105 active:scale-95"
              aria-label="Filter services"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-col gap-4 mt-4 w-full items-center">
            {/* First Row: 5 items */}
            <div className="flex flex-wrap justify-center gap-4">
              {serviceCategories.slice(0, 5).map((cat) => (
                <Link
                  href={`/services/${cat.id}`}
                  key={cat.id}
                  id={`category-${cat.id}`}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border bg-white text-[#1a1a1a] text-[0.9rem] font-medium cursor-pointer transition-all duration-300 hover:-translate-y-[1px] no-underline ${activeCategory === cat.id
                      ? "border-[#ff5a5f] text-[#ff5a5f] bg-[#fff0ef] shadow-[0_2px_8px_rgba(255,90,95,0.12)]"
                      : "border-[#e5e7eb] hover:border-[#ff5a5f] hover:text-[#ff5a5f] hover:shadow-[0_2px_8px_rgba(255,90,95,0.1)]"
                    }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
            {/* Second Row: 3 items */}
            <div className="flex flex-wrap justify-center gap-4">
              {serviceCategories.slice(5).map((cat) => (
                <Link
                  href={`/services/${cat.id}`}
                  key={cat.id}
                  id={`category-${cat.id}`}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border bg-white text-[#1a1a1a] text-[0.9rem] font-medium cursor-pointer transition-all duration-300 hover:-translate-y-[1px] no-underline ${activeCategory === cat.id
                      ? "border-[#ff5a5f] text-[#ff5a5f] bg-[#fff0ef] shadow-[0_2px_8px_rgba(255,90,95,0.12)]"
                      : "border-[#e5e7eb] hover:border-[#ff5a5f] hover:text-[#ff5a5f] hover:shadow-[0_2px_8px_rgba(255,90,95,0.1)]"
                    }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Services Section */}
      <section className="bg-[#FFF0EF] pt-10 px-6 pb-20">
        <div className="max-w-[1100px] mx-auto">
          {/* Section Header */}
          <div className="flex items-start justify-between mb-7">
            <div>
              <h2 className="text-[1.6rem] font-bold text-[#1a1a1a] m-0 mb-1 tracking-[-0.02em]">Trending Services</h2>
              <p className="text-[0.9rem] text-[#6b7280] m-0">
                Highly requested by residents in Dhaka this month
              </p>
            </div>
            <Link href="/services/trending" className="text-[0.9rem] font-semibold text-[#8b1a1a] no-underline whitespace-nowrap transition-opacity duration-200 hover:opacity-80">
              View all →
            </Link>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-6">
            {/* Featured Large Card */}
            {trendingServices
              .filter((s) => s.featured)
              .map((service) => (
                <div key={service.id} className="grid grid-cols-1 sm:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#e5e7eb] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:-translate-y-[2px]">
                  <div className="relative min-h-[320px] overflow-hidden">
                    <Image src={service.image} alt={service.title} fill className="object-cover" />
                    {service.badge && (
                      <span className="absolute top-4 left-4 py-1.5 px-3.5 bg-[#8b1a1a] text-white text-[0.7rem] font-bold tracking-[0.06em] rounded-md z-10 uppercase">{service.badge}</span>
                    )}
                  </div>
                  <div className="p-7 flex flex-col justify-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#f59e0b] text-[0.85rem] tracking-[1px]">★★★★★</span>
                      <span className="text-[0.8rem] text-[#6b7280]">
                        ({service.rating}/5 • {service.reviews} reviews)
                      </span>
                    </div>
                    <h3 className="text-[1.35rem] font-bold text-[#1a1a1a] m-0 tracking-[-0.01em]">{service.title}</h3>
                    <p className="text-[0.9rem] text-[#6b7280] leading-[1.6] m-0">{service.description}</p>
                    <div className="flex items-end justify-between mt-auto pt-3">
                      <div className="flex flex-col gap-[2px]">
                        <span className="text-[0.65rem] font-semibold text-[#9ca3af] tracking-[0.08em] uppercase">
                          STARTING FROM
                        </span>
                        <span className="text-[1.5rem] font-bold text-[#1a1a1a] tracking-[-0.02em]">
                          ৳{service.price.toLocaleString()}
                        </span>
                      </div>
                      <Link href={`/services/${service.id}`} className="px-6 py-2.5 bg-[#ff5a5f] text-white text-[0.9rem] font-semibold rounded-full no-underline transition-all duration-300 shadow-[0_4px_12px_rgba(255,90,95,0.25)] hover:bg-[#e04a4f] hover:shadow-[0_6px_16px_rgba(255,90,95,0.35)] hover:-translate-y-[1px] active:scale-95">Book Now</Link>
                    </div>
                  </div>
                </div>
              ))}

            {/* Smaller Cards */}
            {trendingServices
              .filter((s) => !s.featured)
              .map((service) => (
                <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#e5e7eb] flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:-translate-y-[2px]">
                  <div className="relative h-[180px] overflow-hidden">
                    <Image src={service.image} alt={service.title} fill className="object-cover" />
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] m-0 leading-tight tracking-[-0.01em]">
                        {service.title}
                      </h3>
                      <span className="bg-[#fff8e1] text-[#b45309] px-2 py-0.5 rounded-md text-[0.75rem] font-bold whitespace-nowrap">
                        ★ {service.rating}
                      </span>
                    </div>
                    <p className="text-[0.85rem] text-[#6b7280] leading-[1.5] m-0 mt-1 flex-1">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#f3f4f6]">
                      <span className="text-[1.15rem] font-bold text-[#1a1a1a]">
                        ৳{service.price.toLocaleString()}
                      </span>
                      <Link
                        href={`/services/${service.id}`}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f3f4f6] text-[#4b5563] no-underline transition-all duration-200 hover:bg-[#8b1a1a] hover:text-white"
                        aria-label={`View ${service.title}`}
                      >
                        →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Service Listings Section */}
      <ServiceListings />

      {/* Cleaning Category Section */}
      <CategoryCleaning />

      {/* Home Repairs Category Section */}
      <CategoryHomeRepairs />

      {/* Lifestyle Category Section */}
      <CategoryLifestyle />

      {/* Other Services Section */}
      <CategoryOtherServices />

      {/* Custom Quote Section */}
      <CustomQuoteSection />
    </>
  );
}

/* ============================
   SERVICE LISTINGS DATA
   ============================ */
const serviceListings = [
  {
    id: "premium-deep-cleaning",
    title: "Premium Deep Cleaning",
    description: "Complete sanitation for houses & offices.",
    image: "/images/service/cleaning.png",
    category: "Cleaning",
    price: "৳1,500",
    done: "1.2k+ done",
  },
  {
    id: "master-ac-service",
    title: "Master AC Service",
    description: "Jet wash, gas refill & master repair.",
    image: "/images/service/ac.png",
    category: "AC Repair",
    price: "৳1,200",
    done: "850+ done",
  },
  {
    id: "expert-plumbing",
    title: "Expert Plumbing",
    description: "Leak fixing, pipe installation & drainage.",
    image: "/images/service/plumbing.png",
    category: "Plumbing",
    price: "৳800",
    done: "520+ done",
  },
  {
    id: "electrical-solution",
    title: "Electrical Solution",
    description: "Wiring, socket repair & appliance setup.",
    image: "/images/service/electrical.png",
    category: "Electrical",
    price: "৳900",
    done: "910+ done",
  },
  {
    id: "luxe-painting",
    title: "Luxe Painting",
    description: "Interior & exterior wall painting solutions.",
    image: "/images/service/luxe.png",
    category: "Painting",
    price: "৳5,000",
    done: "315+ done",
  },
  {
    id: "premium-shifting",
    title: "Premium Shifting",
    description: "Hassle-free home & office moving.",
    image: "/images/service/shifting.png",
    category: "Shifting",
    price: "৳4,500",
    done: "1.1k+ done",
  },
  {
    id: "safe-pest-control",
    title: "Safe Pest Control",
    description: "Eco-friendly pest & termite control.",
    image: "/images/service/pest.png",
    category: "Pest Control",
    price: "৳2,000",
    done: "640+ done",
  },
  {
    id: "appliance-repair",
    title: "Appliance Repair",
    description: "Fridge, Oven & Microwave servicing.",
    image: "/images/service/appliance.png",
    category: "Appliance",
    price: "৳1,000",
    done: "290+ done",
  },
];

/* ============================
   SERVICE LISTINGS COMPONENT
   ============================ */
function ServiceListings() {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceMax, setPriceMax] = useState(10000);

  const PRICE_FLOOR = 500;
  const PRICE_CEIL = 10000;

  const handleMaxChange = (val: number) => {
    setPriceMax(val);
  };

  const handleClear = () => {
    setPriceMax(PRICE_CEIL);
    setSelectedRating(null);
    setSortBy("popularity");
  };

  const fillRight = ((priceMax - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100;

  return (
    <section className="py-20 px-6 bg-[#f9fafb]">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-10">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-[280px] shrink-0 bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm h-fit md:sticky top-[100px]">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#f3f4f6]">
            <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] m-0">Filters</h3>
            <button className="text-[0.85rem] font-semibold text-[#6b7280] bg-transparent border-none cursor-pointer transition-colors hover:text-[#8b1a1a]" onClick={handleClear}>Clear</button>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h4 className="text-[0.75rem] font-bold text-[#9ca3af] tracking-wider mb-4 uppercase">PRICE RANGE</h4>
            <div className="relative h-1.5 bg-[#e5e7eb] rounded-full mb-4 mt-2">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute h-full bg-[#8b1a1a] rounded-full" style={{ left: `0%`, width: `${fillRight}%` }} />
              </div>
              <input
                type="range"
                className="absolute w-full h-1.5 top-0 left-0 appearance-none bg-transparent m-0 z-10 pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#8b1a1a] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.15)] hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                min={PRICE_FLOOR}
                max={PRICE_CEIL}
                step={100}
                value={priceMax}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
                aria-label="Maximum price"
              />
            </div>
            <div className="flex justify-between text-[0.8rem] text-[#6b7280]">
              <span>৳{PRICE_FLOOR.toLocaleString()}</span>
              <span>৳{priceMax.toLocaleString()}</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="mb-8">
            <h4 className="text-[0.75rem] font-bold text-[#9ca3af] tracking-wider mb-4 uppercase">MINIMUM RATING</h4>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer text-[0.95rem] text-[#4b5563] font-medium group">
                <input
                  type="radio"
                  name="rating"
                  value="4.5"
                  className="peer hidden"
                  checked={selectedRating === "4.5"}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <span className="w-5 h-5 rounded-full border-2 border-[#d1d5db] peer-checked:border-[#8b1a1a] peer-checked:bg-[#8b1a1a] relative after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:w-2.5 after:h-2.5 after:bg-white after:rounded-full after:opacity-0 peer-checked:after:opacity-100 transition-all" />
                <span>4.5 &amp; up</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-[0.95rem] text-[#4b5563] font-medium group">
                <input
                  type="radio"
                  name="rating"
                  value="4.0"
                  className="peer hidden"
                  checked={selectedRating === "4.0"}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <span className="w-5 h-5 rounded-full border-2 border-[#d1d5db] peer-checked:border-[#8b1a1a] peer-checked:bg-[#8b1a1a] relative after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:w-2.5 after:h-2.5 after:bg-white after:rounded-full after:opacity-0 peer-checked:after:opacity-100 transition-all" />
                <span>4.0 &amp; up</span>
              </label>
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-8">
            <h4 className="text-[0.75rem] font-bold text-[#9ca3af] tracking-wider mb-4 uppercase">SORT BY</h4>
            <select
              id="sort-by"
              className="w-full p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[0.95rem] text-[#1a1a1a] font-medium outline-none transition-all focus:border-[#8b1a1a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,26,26,0.1)] appearance-none cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat' }}
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </aside>

        {/* Service Cards Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {serviceListings.slice((currentPage - 1) * 6, currentPage * 6).map((service) => (
              <Link href={`/services/${service.id}`} key={service.id} className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] no-underline flex flex-col transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 group">
                <div className="relative h-[220px] overflow-hidden">
                  <Image src={service.image} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-4 left-4 py-1.5 px-3 bg-white/90 backdrop-blur-sm text-[#1a1a1a] text-[0.75rem] font-bold rounded-md uppercase tracking-wider shadow-sm">
                    {service.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] m-0 mb-2">{service.title}</h3>
                  <p className="text-[0.9rem] text-[#6b7280] leading-relaxed m-0 flex-1">{service.description}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#f3f4f6]">
                    <span className="text-[1.25rem] font-bold text-[#8b1a1a]">{service.price}</span>
                    <span className="flex items-center gap-1.5 text-[0.8rem] font-medium text-[#6b7280]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {service.done}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[#e5e7eb] bg-white text-[#1a1a1a] text-xl cursor-pointer transition-all duration-200 hover:border-[#8b1a1a] hover:text-[#8b1a1a] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#e5e7eb] disabled:hover:text-[#1a1a1a]"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              ‹
            </button>
            {Array.from({ length: Math.ceil(serviceListings.length / 6) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`flex items-center justify-center w-10 h-10 rounded-full border text-[0.95rem] font-semibold cursor-pointer transition-all duration-200 ${currentPage === page ? "border-[#8b1a1a] bg-[#8b1a1a] text-white" : "border-[#e5e7eb] bg-white text-[#1a1a1a] hover:border-[#8b1a1a] hover:text-[#8b1a1a]"}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[#e5e7eb] bg-white text-[#1a1a1a] text-xl cursor-pointer transition-all duration-200 hover:border-[#8b1a1a] hover:text-[#8b1a1a] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#e5e7eb] disabled:hover:text-[#1a1a1a]"
              disabled={currentPage === Math.ceil(serviceListings.length / 6)}
              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(serviceListings.length / 6), p + 1))}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================
   CLEANING SECTION
   ============================ */
function CategoryCleaning() {
  const cleaningServices = [
    {
      title: "Deep Cleaning",
      desc: "Intensive whole-home sanitization and scrubbing.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11h16M7 11V5a2 2 0 012-2h6a2 2 0 012 2v6M4 11v8a2 2 0 002 2h12a2 2 0 002-2v-8M12 11v10" />
        </svg>
      )
    },
    {
      title: "Kitchen Cleaning",
      desc: "Degreasing and detailed cabinet cleaning services.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 2v20M7 2v20M2 12h20" />
        </svg>
      )
    },
    {
      title: "Bathroom Cleaning",
      desc: "Scale removal and sparkling sanitization.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10v6a8 8 0 0016 0v-6M4 10h16M12 2v4" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-[2rem] font-bold text-[#1a1a1a] m-0 border-b-4 border-[#ff5a5f] pb-2 inline-block">Cleaning</h2>
          <Link href="/services/cleaning" className="text-[#ff5a5f] font-medium no-underline hover:underline mb-2">View All &gt;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cleaningServices.map((svc) => (
            <Link href={
              svc.title === "Deep Cleaning" ? "/services/premium-deep-cleaning" : 
              svc.title === "Kitchen Cleaning" ? "/services/kitchen-cleaning" : 
              svc.title === "Bathroom Cleaning" ? "/services/bathroom-cleaning" : 
              `/services/cleaning/${svc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
            } key={svc.title} className="bg-white rounded-3xl p-10 flex flex-col items-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#f3f4f6] transition-transform duration-300 hover:-translate-y-1 block no-underline text-inherit">
              <div className="w-20 h-20 bg-[#fff0ef] rounded-2xl flex items-center justify-center text-[#ff5a5f] mb-6">
                {svc.icon}
              </div>
              <h3 className="text-[1.3rem] font-bold text-[#1a1a1a] mb-3">{svc.title}</h3>
              <p className="text-[0.95rem] text-[#6b7280] leading-relaxed m-0">{svc.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================
   HOME REPAIRS SECTION
   ============================ */
function CategoryHomeRepairs() {
  const repairServices = [
    {
      title: "AC Service",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="22"></line><line x1="12" y1="2" x2="16" y2="6"></line><line x1="12" y1="2" x2="8" y2="6"></line><line x1="12" y1="22" x2="16" y2="18"></line><line x1="12" y1="22" x2="8" y2="18"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="12" x2="6" y2="8"></line><line x1="2" y1="12" x2="6" y2="16"></line><line x1="22" y1="12" x2="18" y2="8"></line><line x1="22" y1="12" x2="18" y2="16"></line><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line><line x1="4.93" y1="19.07" x2="19.07" y2="4.93"></line>
        </svg>
      )
    },
    {
      title: " Plumbing",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      )
    },
    {
      title: "Electrical ",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      )
    },
    {
      title: "CARPENTRY",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" /><path d="M15 3v6h6" />
        </svg>
      )
    },
    {
      title: "Painting",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 2v4" /><path d="M21 2v4" /><path d="M14 6h8v6h-8z" /><path d="M14 8H7a2 2 0 0 0-2 2v6" /><path d="M9 16v6h2v-6z" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-white pb-24 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-[2rem] font-bold text-[#1a1a1a] m-0 border-b-4 border-[#ff5a5f] pb-2 inline-block">Home Repairs</h2>
          <Link href="/services/repairs" className="text-[#ff5a5f] font-medium no-underline hover:underline mb-2">View All &gt;</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {repairServices.map((svc) => (
            <Link href={
              svc.title.trim() === "AC Service" ? "/services/master-ac-service" :
              svc.title.trim() === "Plumbing" ? "/services/expert-plumbing" :
              svc.title.trim() === "Electrical" ? "/services/electrical-solution" :
              svc.title.trim() === "Painting" ? "/services/luxe-painting" :
              svc.title.trim() === "CARPENTRY" ? "/services/carpentry" :
              `/services/repairs/${svc.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
            } key={svc.title} className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#f3f4f6] transition-transform duration-300 hover:-translate-y-1 gap-4 block no-underline text-inherit">
              <div className="text-[#ff5a5f]">
                {svc.icon}
              </div>
              <h3 className="text-[0.75rem] font-bold text-[#4b5563] tracking-widest uppercase m-0">{svc.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================
   LIFESTYLE SECTION
   ============================ */
function CategoryLifestyle() {
  const lifestyleServices = [
    {
      title: "Salon & Spa",
      desc: "Professional pampering at home.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
      ),
      watermark: (
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
      )
    },
    {
      title: "Gardening",
      desc: "Nurture your outdoor spaces.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5c0 2.5-2 5-5 5-3 0-5-2.5-5-5s2-5 5-5c3 0 5 2.5 5 5z" />
        </svg>
      ),
      watermark: (
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 10v4M8 14h8v6H8zM12 10c0-2-2-4-4-4s-2 2-2 4h6zM12 10c0-2 2-4 4-4s2 2 2 4h-6z" />
        </svg>
      )
    },
    {
      title: "Safe Pest Control",
      desc: "Keep your home safe & clean.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20v-8M12 12A4 4 0 1012 4a4 4 0 100 8zM17 14l-2-2M7 14l2-2M18 10h-3M9 10H6M17 6l-2 2M7 6l2 2" />
        </svg>
      ),
      watermark: (
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-10 items-center">
        {/* Left Side text */}
        <div>
          <h2 className="text-[2.5rem] font-bold text-[#1a1a1a] mb-4">Lifestyle</h2>
          <p className="text-[#6b7280] text-[1.05rem] leading-[1.6] mb-8">
            Indulge in premium home salon, spa, and garden maintenance without leaving your home.
          </p>
          <Link href="/services/lifestyle" className="inline-block px-8 py-3.5 bg-[#ff5a5f] text-white font-medium rounded-xl transition-all hover:bg-[#e04a4f] shadow-[0_4px_12px_rgba(255,90,95,0.25)]">
            Explore More
          </Link>
        </div>

        {/* Right Side Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {lifestyleServices.map((svc) => (
            <Link href={
              svc.title === "Safe Pest Control" ? "/services/safe-pest-control" : 
              svc.title === "Salon & Spa" ? "/services/salon-spa" : 
              svc.title === "Gardening" ? "/services/gardening" : 
              `/services/lifestyle/${svc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
            } key={svc.title} className="relative bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] overflow-hidden transition-transform duration-300 hover:-translate-y-1 h-[220px] flex flex-col justify-start block no-underline text-inherit text-left">
              <div className="text-[#ff5a5f] mb-4">
                {svc.icon}
              </div>
              <h3 className="text-[1.15rem] font-bold text-[#1a1a1a] mb-2 relative z-10">{svc.title}</h3>
              <p className="text-[0.85rem] text-[#6b7280] leading-[1.5] relative z-10">{svc.desc}</p>

              {/* Watermark Icon */}
              <div className="absolute -bottom-6 -right-6 text-[#f3f4f6] pointer-events-none z-0">
                {svc.watermark}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================
   OTHER SERVICES SECTION
   ============================ */
function CategoryOtherServices() {
  return (
    <section className="bg-white pt-8 pb-24 px-6">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-[2rem] font-bold text-[#1a1a1a] m-0 border-b-4 border-[#ff5a5f] pb-2 inline-block mb-10">Other Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-6">
          {/* Large horizontal card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#f3f4f6] transition-transform duration-300 hover:-translate-y-1">
            <div className="w-24 h-24 sm:w-[120px] sm:h-[120px] shrink-0 bg-[#f3f4f6] rounded-2xl flex items-center justify-center text-[#ff5a5f]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div className="flex flex-col flex-1 h-full text-center sm:text-left justify-center sm:justify-start">
              <h3 className="text-[1.25rem] font-bold text-[#1a1a1a] mb-2">Premium Shifting</h3>
              <p className="text-[0.95rem] text-[#6b7280] leading-relaxed mb-4">
                Packers and movers for a stress-free transition to your new home.
              </p>
              <Link href="/services/premium-shifting" className="text-[#ff5a5f] font-semibold text-[0.9rem] flex items-center justify-center sm:justify-start gap-1 mt-auto">
                Learn more <span>→</span>
              </Link>
            </div>
          </div>

          {/* Small square card 1 */}
          <Link href="/services/cctv" className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#f3f4f6] transition-transform duration-300 hover:-translate-y-1 gap-4 block no-underline text-inherit">
            <div className="text-[#ff5a5f]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
            <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] leading-tight">CCTV Service and Security</h3>
          </Link>

          {/* Small square card 2 */}
          <Link href="/services/appliance-repair" className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#f3f4f6] transition-transform duration-300 hover:-translate-y-1 gap-4 block no-underline text-inherit">
            <div className="text-[#ff5a5f]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3 className="text-[1.1rem] font-bold text-[#1a1a1a]">Appliance Repair</h3>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================
   CUSTOM QUOTE SECTION
   ============================ */
function CustomQuoteSection() {
  return (
    <section className="bg-white pb-24 pt-16 px-6">
      <div className="max-w-[1100px] mx-auto bg-[#fff0ef] rounded-[3rem] p-10 md:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-12">

        {/* Left Side: Text and Buttons */}
        <div className="flex-1 w-full lg:max-w-[500px]">
          <h2 className="text-[2.75rem] md:text-[3.25rem] font-bold text-[#ff5a5f] leading-[1.1] mb-6 tracking-tight pr-4">
            Didn't find what you're looking for?
          </h2>
          <p className="text-[#6b7280] text-[1.05rem] md:text-[1.1rem] leading-[1.6] mb-8 max-w-[420px]">
            Tell us your specific requirement and we'll match you with the right pro within 24 hours.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="px-8 py-3.5 bg-[#ff5a5f] text-white font-semibold rounded-2xl shadow-[0_6px_20px_rgba(255,90,95,0.3)] transition-all duration-300 hover:bg-[#e04a4f] hover:-translate-y-1">
              Request Custom Quote
            </button>
            <button className="px-8 py-3.5 bg-white text-[#4b5563] font-semibold rounded-2xl border border-[#e5e7eb] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d1d5db]">
              Call Support
            </button>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="flex-1 w-full flex justify-center md:justify-end relative z-10">
          <div className="relative w-full max-w-[420px] aspect-[4/4.5] transform -rotate-[3deg] shadow-[0_20px_40px_rgba(0,0,0,0.12)] rounded-[3rem]">
            <Image
              src="/images/service/professional-working-serv.png"
              alt="Professional Service Worker"
              fill
              className="object-cover rounded-[3rem]"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
