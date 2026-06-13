"use client";

import Image from "next/image";
import { useState } from "react";

export default function BathroomCleaningPage() {
  const [selectedDate, setSelectedDate] = useState("March 24, 2024");
  const [arrivalWindow, setArrivalWindow] = useState("10:00 AM - 12:00 PM");

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1300px] mx-auto px-6 pt-10 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column (Hero & About) */}
          <div className="flex-[2] flex flex-col">
            {/* Hero Image */}
            <div className="relative w-full h-[400px] lg:h-[450px] rounded-[2.5rem] overflow-hidden mb-12 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
              <Image src="/images/service/bathroom-cleaning-service.jpeg" alt="Bathroom Cleaning" fill priority className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-8 md:bottom-12 left-6 md:left-10 text-white pr-6 md:pr-10">
                <div className="inline-flex items-center gap-2 bg-[#ff5a5f] rounded-full px-4 py-1.5 mb-4 shadow-sm">
                  <span className="text-[0.7rem] font-bold tracking-wider uppercase">Premium Service</span>
                </div>
                <h1 className="text-[2.2rem] md:text-[3.2rem] font-bold mb-4 tracking-tight leading-tight max-w-[800px]">
                  Professional Bathroom Cleaning Services
                </h1>
              </div>
            </div>

            {/* About this Service */}
            <div>
              <h2 className="text-[2rem] font-bold text-[#1a1a1a] mb-6 tracking-tight">About this Service</h2>
              
              <p className="text-[#6b7280] text-[1.05rem] leading-relaxed mb-8 max-w-[850px]">
                Transform your bathroom into a pristine, hygienic sanctuary with our specialized deep cleaning service. We eliminate tough water stains, sanitize all fixtures, and restore the sparkle to your tiles using safe, eco-friendly, and highly effective cleaning agents.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stain & Scale Removal Card */}
                <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
                  <div className="w-12 h-12 bg-[#fff0ef] rounded-2xl flex items-center justify-center text-[#ff5a5f] mb-6">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-3">Stain & Scale Removal</h3>
                  <p className="text-[#6b7280] leading-relaxed text-[0.95rem]">
                    Intensive removal of hard water stains, soap scum, and limescale from tiles and glass.
                  </p>
                </div>

                {/* Deep Sanitization Card */}
                <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
                  <div className="w-12 h-12 bg-[#fff0ef] rounded-2xl flex items-center justify-center text-[#ff5a5f] mb-6">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 11h16M7 11V5a2 2 0 012-2h6a2 2 0 012 2v6M4 11v8a2 2 0 002 2h12a2 2 0 002-2v-8M12 11v10" />
                    </svg>
                  </div>
                  <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-3">Deep Sanitization</h3>
                  <p className="text-[#6b7280] leading-relaxed text-[0.95rem]">
                    Complete disinfection of toilets, sinks, bathtubs, and floors to ensure a germ-free environment.
                  </p>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="mt-12 bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#f3f4f6]">
              <h2 className="text-[2rem] font-bold text-[#1a1a1a] mb-8 tracking-tight">What's Included</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                {/* Toilet & Bidet */}
                <div className="flex gap-4 items-start">
                  <div className="text-[#ff5a5f] mt-1 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 10v6a8 8 0 0016 0v-6M4 10h16M12 2v4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-1.5">Toilet & Bidet</h3>
                    <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                      Detailed scrubbing, descaling, and sanitizing inside and out.
                    </p>
                  </div>
                </div>

                {/* Shower & Tub */}
                <div className="flex gap-4 items-start">
                  <div className="text-[#ff5a5f] mt-1 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <path d="M4 10v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9"></path>
                      <path d="M4 10h16"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-1.5">Shower & Tub</h3>
                    <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                      Descaling glass doors, tiles, showerheads, and bathtubs.
                    </p>
                  </div>
                </div>

                {/* Mirror & Vanity */}
                <div className="flex gap-4 items-start">
                  <div className="text-[#ff5a5f] mt-1 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="12" cy="12" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-1.5">Mirror & Vanity</h3>
                    <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                      Streak-free cleaning of mirrors, sinks, and organizing vanity tops.
                    </p>
                  </div>
                </div>

                {/* Floor Scrubbing */}
                <div className="flex gap-4 items-start">
                  <div className="text-[#ff5a5f] mt-1 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-1.5">Floor Scrubbing</h3>
                    <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                      Deep cleaning floor tiles, corners, and whitening grout lines.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="mt-16">
              <h2 className="text-[2rem] font-bold text-[#1a1a1a] mb-10 tracking-tight">How it Works</h2>
              
              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4">
                {/* Step 1 */}
                <div className="flex flex-col flex-1">
                  <div className="text-[#fff0ef] font-bold text-[4rem] leading-none mb-4 font-serif">
                    01
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">Book Online</h3>
                  <p className="text-[#6b7280] text-[0.9rem] leading-relaxed pr-4">
                    Select your service, choose a time slot, and get instant confirmation.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col flex-1">
                  <div className="text-[#fff0ef] font-bold text-[4rem] leading-none mb-4 font-serif">
                    02
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">Expert Arrival</h3>
                  <p className="text-[#6b7280] text-[0.9rem] leading-relaxed pr-4">
                    Our certified cleaners arrive equipped with specialized bathroom cleaning tools.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col flex-1">
                  <div className="text-[#fff0ef] font-bold text-[4rem] leading-none mb-4 font-serif">
                    03
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">Pristine Bathroom</h3>
                  <p className="text-[#6b7280] text-[0.9rem] leading-relaxed pr-4">
                    Step into a spotless, fresh-smelling, and fully sanitized bathroom.
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="mt-16 mb-8">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-[2rem] font-bold text-[#1a1a1a] tracking-tight">Customer Reviews</h2>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-[#ff5a5f]">4.9</span>
                  <div className="flex text-[#ff5a5f]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                  <span className="text-[#6b7280] text-[0.85rem]">(112 reviews)</span>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1a1a1a] text-[1rem]">Sarah Jenkins</h4>
                      <span className="text-[#9ca3af] text-[0.8rem]">3 days ago</span>
                    </div>
                  </div>
                  <div className="flex text-[#ff5a5f]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                </div>
                <p className="text-[#6b7280] italic leading-relaxed text-[0.95rem]">
                  "The team removed hard water stains I thought would never come off. My bathroom looks completely brand new! The sanitization was thorough and left a great fresh scent. Highly recommend."
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (Booking Widget) */}
          <div className="flex-1 w-full lg:w-[400px]">
            <div className="sticky top-32">
              <div className="bg-white rounded-[2.5rem] p-8 border border-[#f3f4f6] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                {/* Price Area */}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#6b7280] text-[0.95rem] font-medium">Starting from</span>
                  <span className="bg-[#fff0ef] text-[#ff5a5f] text-[0.7rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider">POPULAR</span>
                </div>
                <div className="text-[3.5rem] font-bold text-[#ff5a5f] tracking-tight mb-8 leading-none">
                  $30
                </div>

                {/* Date Selection */}
                <div className="mb-4">
                  <label className="block text-[#4b5563] font-bold text-[0.75rem] uppercase tracking-widest mb-2">Select Date</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-[#f8fafc] text-[#1a1a1a] font-medium border border-transparent rounded-xl py-3.5 pl-4 pr-12 focus:ring-2 focus:ring-[#ff5a5f]/20 outline-none transition-all hover:bg-[#f1f5f9]"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ff5a5f] pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-8">
                  <label className="block text-[#4b5563] font-bold text-[0.75rem] uppercase tracking-widest mb-2">Select Time</label>
                  <div className="relative">
                    <select 
                      value={arrivalWindow}
                      onChange={(e) => setArrivalWindow(e.target.value)}
                      className="w-full appearance-none bg-[#f8fafc] text-[#1a1a1a] font-medium border border-transparent rounded-xl py-3.5 pl-4 pr-12 focus:ring-2 focus:ring-[#ff5a5f]/20 outline-none transition-all cursor-pointer hover:bg-[#f1f5f9]"
                    >
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                      <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ff5a5f] pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="border-t border-[#f3f4f6] pt-6 pb-6 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#6b7280] text-[0.95rem]">Service Base Fee</span>
                    <span className="text-[#1a1a1a] font-bold text-[0.95rem]">$25.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6b7280] text-[0.95rem]">Booking Fee</span>
                    <span className="text-[#1a1a1a] font-bold text-[0.95rem]">$5.00</span>
                  </div>
                </div>

                <div className="border-t border-[#f3f4f6] pt-6 mb-8 flex justify-between items-center">
                  <span className="text-[#1a1a1a] font-bold text-[1.1rem]">Total Est.</span>
                  <span className="text-[#ff5a5f] font-bold text-[1.4rem]">$30.00</span>
                </div>

                {/* Book Now Button */}
                <button 
                  onClick={() => alert(`Booking Bathroom Cleaning for ${selectedDate} between ${arrivalWindow}`)}
                  className="w-full bg-[#ff5a5f] hover:bg-[#e0484d] text-white font-bold text-[1.1rem] py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(255,90,95,0.25)] hover:shadow-[0_8px_25px_rgba(255,90,95,0.35)] hover:-translate-y-0.5 active:translate-y-0 mb-6"
                >
                  Book Now
                </button>
                
                <div className="text-center">
                  <span className="text-[#9ca3af] text-[0.8rem]">Free cancellation up to 24h before service.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
