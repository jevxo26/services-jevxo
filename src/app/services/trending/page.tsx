"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const trendingPageServices = [
  {
    id: "premium-deep-cleaning",
    title: "Premium Deep Cleaning",
    description: "Complete sanitation for houses & offices.",
    image: "/images/service/cleaning.png",
    rating: 4.9,
    reviews: "1.2k",
    price: "1,500",
    badge: "Trending",
    category: "Cleaning"
  },
  {
    id: "master-ac-service",
    title: "Master AC Service",
    description: "Jet wash, gas refill & master repair.",
    image: "/images/service/ac.png",
    rating: 4.8,
    reviews: "850",
    price: "1,200",
    badge: null,
    category: "AC Repair"
  },
  {
    id: "expert-plumbing",
    title: "Expert Plumbing",
    description: "Leak fixing, pipe installation & drainage.",
    image: "/images/service/plumbing.png",
    rating: 4.7,
    reviews: "520",
    price: "800",
    badge: null,
    category: "Plumbing"
  },
  {
    id: "electrical-solution",
    title: "Electrical Solution",
    description: "Wiring, socket repair & appliance setup.",
    image: "/images/service/electrical.png",
    rating: 4.9,
    reviews: "910",
    price: "900",
    badge: null,
    category: "Electrical"
  },
  {
    id: "luxe-painting",
    title: "Luxe Painting",
    description: "Interior & exterior wall painting solutions.",
    image: "/images/service/luxe.png",
    rating: 4.6,
    reviews: "315",
    price: "5,000",
    badge: null,
    category: "Painting"
  },
  {
    id: "premium-shifting",
    title: "Premium Shifting",
    description: "Hassle-free home & office moving.",
    image: "/images/service/shifting.png",
    rating: 4.8,
    reviews: "1.1k",
    price: "4,500",
    badge: null,
    category: "Shifting"
  },
  {
    id: "safe-pest-control",
    title: "Safe Pest Control",
    description: "Eco-friendly pest & termite control.",
    image: "/images/service/pest.png",
    rating: 4.7,
    reviews: "640",
    price: "2,000",
    badge: null,
    category: "Pest Control"
  },
  {
    id: "appliance-repair",
    title: "Appliance Repair",
    description: "Fridge, Oven & Microwave servicing.",
    image: "/images/service/appliance.png",
    rating: 4.5,
    reviews: "290",
    price: "1,000",
    badge: null,
    category: "Appliance"
  },
  {
    id: "cctv",
    title: "CCTV Service and Security",
    description: "Advanced camera installation and system monitoring.",
    image: "/images/service/cc tv1.png",
    rating: 4.8,
    reviews: "540",
    price: "1,500",
    badge: "New",
    category: "CCTV"
  },
];

export default function TrendingServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const categories = ["All Categories", "Cleaning", "AC Repair", "Plumbing", "Electrical", "Painting", "Shifting", "Pest Control", "Appliance", "CCTV"];

  const filteredServices = selectedCategory === "All Categories" 
    ? trendingPageServices 
    : trendingPageServices.filter(service => service.category === selectedCategory);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <section className="bg-[#FFF0EF] px-6 pt-10 pb-20 min-h-[calc(100vh-64px)]">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-start justify-between mb-6 gap-4 md:gap-0">
          <div>
            <h1 className="text-[2.8rem] font-bold text-[#2a2a2a] mb-3 tracking-[-0.02em] leading-tight">Trending Services</h1>
            <p className="text-[1.1rem] text-[#6b7280] m-0 max-w-[580px] leading-[1.6]">
              The most requested home services in Dhaka, selected by thousands of happy customers for quality and reliability.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#fdf2f2] border-none rounded-full text-[0.95rem] font-bold text-[#1a1a1a] cursor-pointer transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d93838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path>
            </svg>
            Live Popularity Index
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white px-6 py-3 rounded-[20px] md:rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.04)] mb-10 gap-4 md:gap-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e5e7eb] rounded-full text-[0.95rem] font-semibold text-[#4b5563] cursor-pointer transition-all duration-200 hover:border-[#8b1a1a] hover:text-[#8b1a1a]"
              >
                {selectedCategory}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              
              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#e5e7eb] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] z-20 py-2 flex flex-col">
                  {categories.map((cat) => (
                    <button 
                      key={cat}
                      className={`w-full text-left px-4 py-2.5 text-[0.95rem] transition-colors ${selectedCategory === cat ? 'bg-[#fff0ef] text-[#8b1a1a] font-semibold' : 'text-[#4b5563] hover:bg-[#f9fafb] hover:text-[#8b1a1a]'}`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                        setIsCategoryOpen(false);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e5e7eb] rounded-full text-[0.95rem] font-semibold text-[#4b5563] cursor-pointer transition-all duration-200 hover:border-[#8b1a1a] hover:text-[#8b1a1a]">
              Price Range
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>
            </button>

            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e5e7eb] rounded-full text-[0.95rem] font-semibold text-[#4b5563] cursor-pointer transition-all duration-200 hover:border-[#8b1a1a] hover:text-[#8b1a1a]">
              Rating (4.5+)
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </button>
          </div>

          <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-3">
            <span className="text-[0.95rem] text-[#6b7280] font-semibold">Sort by:</span>
            <select 
              defaultValue="popularity" 
              className="px-5 py-2.5 pr-9 bg-white border border-[#e5e7eb] rounded-full text-[0.95rem] font-bold text-[#1a1a1a] cursor-pointer appearance-none bg-no-repeat transition-all duration-200 focus:outline-none focus:border-[#8b1a1a]"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M3 6h18M6 12h12M9 18h6\'/%3E%3C/svg%3E")', backgroundPosition: 'right 14px center' }}
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {currentServices.map((service) => (
            <Link href={`/services/${service.id}`} key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e5e7eb] flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group no-underline">
              <div className="relative h-[200px] overflow-hidden">
                <Image src={service.image} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                {service.badge && (
                  <span className="absolute top-3 left-3 py-1 px-3 bg-[#ff5a5f] text-white text-xs font-semibold rounded-full z-10">{service.badge}</span>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2.5 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-[#f59e0b] text-[0.9rem]">★</span>
                  <span className="font-bold text-[0.85rem] text-[#1a1a1a]">{service.rating}</span>
                  <span className="text-xs text-[#6b7280]">({service.reviews} reviews)</span>
                </div>
                <h3 className="text-[1.15rem] font-bold text-[#1a1a1a] m-0 leading-[1.3]">{service.title}</h3>
                <p className="text-[0.85rem] text-[#6b7280] leading-relaxed m-0">{service.description}</p>
                
                <div className="flex items-end justify-between mt-auto pt-3">
                  <div>
                    <span className="text-[0.65rem] text-[#9ca3af] uppercase font-semibold block mb-0.5">Starts from</span>
                    <span className="text-xl font-bold text-[#8b1a1a]">৳{service.price}</span>
                  </div>
                  <span className="px-4 py-2 bg-[#ff5a5f] hover:bg-[#e0484d] text-white border-none rounded-md text-[0.85rem] font-semibold transition-colors duration-200 cursor-pointer text-center block">Book Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full border ${currentPage === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#e5e7eb] bg-white text-[#1a1a1a] cursor-pointer hover:border-[#8b1a1a] hover:text-[#8b1a1a]'} text-xl transition-all duration-200`}
            >
              ‹
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border text-[0.9rem] font-semibold transition-all duration-200 ${currentPage === page ? 'border-[#8b1a1a] bg-[#8b1a1a] text-white hover:bg-[#a52a2a] cursor-default' : 'border-[#e5e7eb] bg-white text-[#1a1a1a] cursor-pointer hover:border-[#8b1a1a] hover:text-[#8b1a1a]'}`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded-full border ${currentPage === totalPages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#e5e7eb] bg-white text-[#1a1a1a] cursor-pointer hover:border-[#8b1a1a] hover:text-[#8b1a1a]'} text-xl transition-all duration-200`}
            >
              ›
            </button>
          </div>
        )}

        {/* Custom Service Section */}
        <div className="bg-white rounded-[24px] px-6 py-12 mt-[60px] text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col items-center">
          <h2 className="text-[1.8rem] font-bold text-[#1a1a1a] mb-3 tracking-[-0.02em]">Can't find what you need?</h2>
          <p className="text-base text-[#6b7280] max-w-[600px] mb-8 leading-[1.6]">
            Our concierge team is ready to help you find the perfect professional for your unique requirements.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 flex-wrap justify-center w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#ff5a5f] hover:bg-[#e0484d] text-white border-none rounded-full text-[0.95rem] font-semibold transition-colors duration-200 cursor-pointer w-full md:w-auto">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4z"></path><path d="M3 19a2 2 0 0 0 2 2h1v-6H3v4z"></path></svg>
              Contact Support
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#1a1a1a] border border-[#e5e7eb] hover:border-[#d1d5db] rounded-full text-[0.95rem] font-semibold cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors duration-200 w-full md:w-auto">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Request Custom Service
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
