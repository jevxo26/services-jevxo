"use client";

import Image from "next/image";
import { useState } from "react";

export default function SafePestControlPage() {
  const [selectedDate, setSelectedDate] = useState("05/24/2024");
  const [arrivalWindow, setArrivalWindow] = useState("09:00 AM - 11:00 AM");

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1300px] mx-auto px-6 pt-10 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column (Hero & About) */}
          <div className="flex-[2] flex flex-col">
            {/* Hero Image */}
            <div className="relative w-full h-[400px] lg:h-[450px] rounded-[2.5rem] overflow-hidden mb-12 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
              <Image src="/images/service/Professional Pest Control.png" alt="Safe Pest Control" fill priority className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-8 md:bottom-12 left-6 md:left-10 text-white pr-6 md:pr-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 mb-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                  <span className="text-[0.8rem] font-bold tracking-wider uppercase">Eco-Certified Service</span>
                </div>
                <h1 className="text-[2.2rem] md:text-[3rem] font-bold mb-4 tracking-tight leading-tight">Professional Pest Control</h1>
                <p className="text-white/90 text-[1rem] md:text-[1.1rem] max-w-[600px] leading-relaxed">
                  Comprehensive treatment plans to keep your home safe, hygienic, and pest-free with zero environmental impact.
                </p>
              </div>
            </div>

            {/* About this Service */}
            <div>
              <h2 className="text-[2rem] font-bold text-[#1a1a1a] mb-8 tracking-tight">About this Service</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Eco-Friendly Card */}
                <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
                  <div className="w-12 h-12 bg-[#fff5f5] rounded-full flex items-center justify-center text-[#ff5a5f] mb-6">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                    </svg>
                  </div>
                  <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-3">Eco-Friendly</h3>
                  <p className="text-[#6b7280] leading-relaxed text-[0.95rem]">
                    We use biodegradable, botanical-based formulas that effectively target pests without harming the planet.
                  </p>
                </div>

                {/* Child & Pet Safe Card */}
                <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
                  <div className="w-12 h-12 bg-[#fff5f5] rounded-full flex items-center justify-center text-[#ff5a5f] mb-6">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5.5a2.5 2.5 0 0 1-5 0c0-1.38 1.12-2.5 2.5-2.5S12 4.12 12 5.5Z"/>
                      <path d="M17 5.5a2.5 2.5 0 0 1-5 0c0-1.38 1.12-2.5 2.5-2.5S17 4.12 17 5.5Z"/>
                      <path d="M12 21c-4.66 0-8.3-4.57-7.98-9.17A7.51 7.51 0 0 1 11.5 5.5c4.66 0 8.3 4.57 7.98 9.17A7.51 7.51 0 0 1 12 21z"/>
                    </svg>
                  </div>
                  <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-3">Child & Pet Safe</h3>
                  <p className="text-[#6b7280] leading-relaxed text-[0.95rem]">
                    Our treatments are non-toxic to mammals, ensuring a safe environment for your loved ones immediately after application.
                  </p>
                </div>
              </div>
            </div>

            {/* NEW: What's Included */}
            <div className="mt-16">
              <h2 className="text-[2rem] font-bold text-[#1a1a1a] mb-8 tracking-tight">What's Included</h2>
              
              <div className="flex flex-col lg:flex-row gap-6 mb-6">
                {/* Deep Inspection */}
                <div className="flex-[2] bg-[#f8f9fa] rounded-[2rem] p-8">
                  <div className="w-10 h-10 flex items-center text-[#ff5a5f] mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <polyline points="8 11 10 13 14 9"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-3">Deep Inspection</h3>
                  <p className="text-[#6b7280] leading-relaxed text-[0.95rem]">
                    Detailed 360° scan of your property to identify entry points, nesting areas, and potential risk zones.
                  </p>
                </div>
                
                {/* Treatment */}
                <div className="flex-1 bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6]">
                  <div className="w-10 h-10 flex items-center text-[#ff5a5f] mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>
                  <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-3">Treatment</h3>
                  <p className="text-[#6b7280] leading-relaxed text-[0.95rem]">
                    Targeted application of organic treatments.
                  </p>
                </div>

                {/* Prevention */}
                <div className="flex-1 bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6]">
                  <div className="w-10 h-10 flex items-center text-[#ff5a5f] mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-3">Prevention</h3>
                  <p className="text-[#6b7280] leading-relaxed text-[0.95rem]">
                    Sealing cracks and applying barriers.
                  </p>
                </div>
              </div>

              {/* Complimentary Follow-up */}
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-10 h-10 flex items-center justify-center text-[#ff5a5f] shrink-0">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                      <path d="M3 3v5h5"></path>
                      <path d="M12 7v5l4 2"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.1rem] md:text-[1.2rem] font-bold text-[#1a1a1a] mb-2">Complimentary Follow-up</h3>
                    <p className="text-[#6b7280] leading-relaxed text-[0.9rem] md:text-[0.95rem]">
                      A second visit within 14 days to ensure complete eradication and your total satisfaction.
                    </p>
                  </div>
                </div>
                <div className="text-[#d1d5db]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="mt-16">
              <h2 className="text-[2rem] font-bold text-[#1a1a1a] mb-10 tracking-tight">How it Works</h2>
              
              <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4">
                {/* Horizontal Line connecting steps */}
                <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-[#f3f4f6] -z-10"></div>
                
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-4 text-[#ff5a5f] font-bold text-[1.1rem]">
                    1
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">Book Online</h3>
                  <p className="text-[#6b7280] text-[0.9rem] leading-relaxed max-w-[200px]">
                    Select your time slot and provide service details.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-4 text-[#ff5a5f] font-bold text-[1.1rem]">
                    2
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">Expert Visit</h3>
                  <p className="text-[#6b7280] text-[0.9rem] leading-relaxed max-w-[200px]">
                    Pro arrives with all necessary eco-equipment.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-4 text-[#ff5a5f] font-bold text-[1.1rem]">
                    3
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">Safe Home</h3>
                  <p className="text-[#6b7280] text-[0.9rem] leading-relaxed max-w-[200px]">
                    Enjoy a clean, pest-free environment immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="mt-16 mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0 mb-8">
                <h2 className="text-[1.8rem] md:text-[2rem] font-bold text-[#1a1a1a] tracking-tight">Customer Reviews</h2>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-[#fbbf24]">
                    {/* 5 Stars */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                  <span className="font-bold text-[#1a1a1a]">4.8</span>
                  <span className="text-[#6b7280] text-[0.95rem]">(128 reviews)</span>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {/* Review 1 */}
                <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#f3f4f6]">
                        <Image src="/images/service/rep-Technician1.png" alt="Sarah Jenkins" fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1a1a1a] text-[1.05rem]">Sarah Jenkins</h4>
                        <span className="text-[#9ca3af] text-[0.85rem]">2 days ago</span>
                      </div>
                    </div>
                    <div className="flex text-[#fbbf24]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </div>
                  </div>
                  <p className="text-[#6b7280] italic leading-relaxed text-[0.95rem]">
                    "I was worried about my toddlers and cats, but the Rajseba team was so professional. They explained every product they used. No chemical smell at all, and the ant problem was gone in 24 hours!"
                  </p>
                </div>

                {/* Review 2 */}
                <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#f3f4f6]">
                        <Image src="/images/service/rep-Technician2.png" alt="Michael Reed" fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1a1a1a] text-[1.05rem]">Michael Reed</h4>
                        <span className="text-[#9ca3af] text-[0.85rem]">1 week ago</span>
                      </div>
                    </div>
                    <div className="flex text-[#fbbf24]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </div>
                  </div>
                  <p className="text-[#6b7280] italic leading-relaxed text-[0.95rem]">
                    "Extremely thorough. They found termite activity we hadn't even noticed. Very thankful for the preventative measures they took."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Booking Widget) */}
          <div className="flex-1">
            <div className="sticky top-32">
              <div className="bg-[#fafafa] rounded-[2.5rem] p-8 border border-[#f3f4f6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-6">
                {/* Price Area */}
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[#6b7280] text-[0.95rem] font-medium">Starting from</span>
                  <span className="bg-[#ffebeb] text-[#ff5a5f] text-[0.75rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider">-15% OFF</span>
                </div>
                <div className="text-[3.5rem] font-bold text-[#1a1a1a] tracking-tight mb-8 leading-none">
                  $75
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-[#1a1a1a] font-bold text-[0.95rem] mb-3">Select Date</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                    <input 
                      type="text" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-[#f3f4f6] text-[#1a1a1a] font-medium border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#ff5a5f]/20 outline-none transition-all hover:bg-[#e5e7eb]"
                    />
                  </div>
                </div>

                {/* Arrival Window Selection */}
                <div className="mb-8">
                  <label className="block text-[#1a1a1a] font-bold text-[0.95rem] mb-3">Arrival Window</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none z-10">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <select 
                      value={arrivalWindow}
                      onChange={(e) => setArrivalWindow(e.target.value)}
                      className="w-full appearance-none bg-[#f3f4f6] text-[#1a1a1a] font-medium border-none rounded-2xl py-4 pl-12 pr-10 focus:ring-2 focus:ring-[#ff5a5f]/20 outline-none transition-all cursor-pointer hover:bg-[#e5e7eb] relative z-0"
                    >
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none z-10">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>

                {/* Guarantees List */}
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-[1.5px] border-[#ff5a5f] flex items-center justify-center shrink-0">
                      <svg className="text-[#ff5a5f]" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-[#4b5563] text-[0.95rem]">No hidden service fees</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-[1.5px] border-[#ff5a5f] flex items-center justify-center shrink-0">
                      <svg className="text-[#ff5a5f]" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-[#4b5563] text-[0.95rem]">Cancel free up to 24h before</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-[1.5px] border-[#ff5a5f] flex items-center justify-center shrink-0">
                      <svg className="text-[#ff5a5f]" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-[#4b5563] text-[0.95rem]">Certified local professionals</span>
                  </div>
                </div>

                {/* Book Now Button */}
                <button 
                  onClick={() => alert(`Booking Pest Control for ${selectedDate} between ${arrivalWindow}`)}
                  className="w-full bg-[#ff5a5f] hover:bg-[#e0484d] text-white font-bold text-[1.1rem] py-4 rounded-xl transition-colors shadow-[0_8px_20px_rgba(255,90,95,0.25)] mb-6"
                >
                  Book Now
                </button>
                
                <div className="text-center">
                  <span className="text-[#9ca3af] text-[0.8rem]">Secure payment powered by Rajseba Pay</span>
                </div>
              </div>

              {/* Custom Quote Card */}
              <div className="bg-white rounded-[2rem] p-6 border border-[#f3f4f6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center gap-4">
                <div className="w-12 h-12 bg-[#fff5f5] rounded-full flex items-center justify-center text-[#ff5a5f] shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-[#1a1a1a] font-bold text-[0.95rem] mb-1">Need a custom quote?</h4>
                  <a href="#" className="text-[#ff5a5f] text-[0.85rem] font-medium hover:underline">Chat with an agent</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
