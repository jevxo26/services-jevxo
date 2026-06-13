"use client";

import Image from "next/image";
import { useState } from "react";

export default function GardeningServicePage() {
  const [selectedDate, setSelectedDate] = useState("Jan 24, 2024");
  const [selectedTime, setSelectedTime] = useState("09:00 AM");

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1300px] mx-auto px-6 pt-10 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column (Hero & Content) */}
          <div className="flex-[2] flex flex-col">
            {/* Hero Image */}
            <div className="relative w-full h-[400px] lg:h-[480px] rounded-[1.5rem] overflow-hidden mb-8 border border-[#e5e7eb]">
              <Image src="/images/service/Gardening Service Detail.png" alt="Gardening & Landscaping" fill priority className="object-cover object-center" />
              
              {/* Top Rated Badge */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span className="text-[0.8rem] font-bold text-[#1a1a1a]">Top Rated Service</span>
              </div>
            </div>

            {/* Title & Quick Info */}
            <div className="mb-8">
              <h1 className="text-[1.8rem] font-medium text-[#1a1a1a] mb-6">
                Professional Gardening & Landscaping
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 md:gap-8 mb-6">
                <div className="flex items-center gap-2 text-[#6b7280]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span className="text-[0.95rem] font-medium">2–4 Hours Est.</span>
                </div>
                <div className="flex items-center gap-2 text-[#6b7280]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                  <span className="text-[0.95rem] font-medium">Verified Pros</span>
                </div>
                <div className="flex items-center gap-2 text-[#6b7280]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0114 9h4v4a7 7 0 01-7 7z"></path><path d="M11 20a7 7 0 007-7v-4h-4a7 7 0 00-7 7z"></path></svg>
                  <span className="text-[0.95rem] font-medium">Eco-Friendly</span>
                </div>
              </div>
              
              <div className="h-[1px] w-full bg-[#f3f4f6]"></div>
            </div>

            {/* About this Service */}
            <div className="mb-10">
              <h2 className="text-[1.2rem] font-medium text-[#4b5563] mb-4">About this Service</h2>
              
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                Transform your outdoor space into a sanctuary of peace and beauty. Our gardening experts specialize in
                bespoke landscape design, comprehensive lawn care, and detailed plant health assessments. Whether
                you need a seasonal refresh or ongoing maintenance, we bring precision and passion to every branch and
                bloom.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Precision Pruning */}
              <div className="bg-white rounded-[1.5rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div className="text-[#ff5a5f] mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>
                </div>
                <h3 className="text-[1.05rem] font-bold text-[#1a1a1a] mb-2">Precision Pruning</h3>
                <p className="text-[#6b7280] text-[0.9rem] leading-relaxed">
                  Artistic shaping and health pruning for all shrubs and hedges.
                </p>
              </div>

              {/* Weed Management */}
              <div className="bg-white rounded-[1.5rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div className="text-[#ff5a5f] mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-6M12 8V2M4 12H2M22 12h-2M18.36 5.64l-1.41 1.41M5.64 18.36l-1.41 1.41M18.36 18.36l-1.41-1.41M5.64 5.64l-1.41-1.41"></path></svg>
                </div>
                <h3 className="text-[1.05rem] font-bold text-[#1a1a1a] mb-2">Weed Management</h3>
                <p className="text-[#6b7280] text-[0.9rem] leading-relaxed">
                  Systematic removal and organic prevention of invasive weeds.
                </p>
              </div>

              {/* Soil & Fertilizing */}
              <div className="bg-white rounded-[1.5rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div className="text-[#ff5a5f] mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                </div>
                <h3 className="text-[1.05rem] font-bold text-[#1a1a1a] mb-2">Soil & Fertilizing</h3>
                <p className="text-[#6b7280] text-[0.9rem] leading-relaxed">
                  Nutrient-rich treatment and ph testing for optimal plant growth.
                </p>
              </div>

              {/* Health Diagnostics */}
              <div className="bg-white rounded-[1.5rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div className="text-[#ff5a5f] mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <h3 className="text-[1.05rem] font-bold text-[#1a1a1a] mb-2">Health Diagnostics</h3>
                <p className="text-[#6b7280] text-[0.9rem] leading-relaxed">
                  Identifying pests and diseases before they spread.
                </p>
              </div>
            </div>

            {/* How It Works */}
            <div className="mt-16 bg-[#f8fafc] rounded-[2rem] p-10 border border-[#f3f4f6]">
              <h2 className="text-[1.2rem] font-medium text-[#4b5563] text-center mb-10">How It Works</h2>
              
              <div className="flex flex-col md:flex-row justify-between items-start relative gap-8 md:gap-0">
                {/* Step 1 */}
                <div className="flex flex-col items-center flex-1 text-center relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#ff5a5f] text-white flex items-center justify-center font-bold text-[1.2rem] mb-6 shadow-sm">
                    1
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">Book Online</h3>
                  <p className="text-[#6b7280] text-[0.9rem] leading-relaxed max-w-[220px]">
                    Select your time slot and specific gardening needs.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col items-center flex-1 text-center relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#ff5a5f] text-white flex items-center justify-center font-bold text-[1.2rem] mb-6 shadow-sm">
                    2
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">Pro Arrives</h3>
                  <p className="text-[#6b7280] text-[0.9rem] leading-relaxed max-w-[220px]">
                    A verified gardener brings all necessary premium tools.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col items-center flex-1 text-center relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#ff5a5f] text-white flex items-center justify-center font-bold text-[1.2rem] mb-6 shadow-sm">
                    3
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">Pure Serenity</h3>
                  <p className="text-[#6b7280] text-[0.9rem] leading-relaxed max-w-[220px]">
                    Sit back and enjoy your freshly transformed oasis.
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="mt-16 mb-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[1.2rem] font-medium text-[#1a1a1a]">Customer Reviews</h2>
                <button className="font-bold text-[#ff5a5f] text-[0.9rem] hover:underline">View All 128 Reviews</button>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div className="flex items-center gap-4 mb-2 sm:mb-0">
                    <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#4b5563] font-bold text-[1rem] shrink-0 border border-[#e2e8f0]">
                      AM
                    </div>
                    <h4 className="font-bold text-[#1a1a1a] text-[1.05rem]">Arthur Morgan</h4>
                  </div>
                  <div className="flex text-[#fbbf24]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                </div>
                <p className="text-[#6b7280] italic leading-relaxed text-[0.95rem]">
                  "Absolutely phenomenal service. My backyard went from a jungle to a magazine cover in just one afternoon. Highly recommend!"
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (Booking Widget & Guarantee) */}
          <div className="flex-1 w-full lg:w-[400px]">
            <div className="sticky top-32">
              
              {/* Main Booking Card */}
              <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-6">
                
                {/* Header */}
                <div className="mb-2">
                  <span className="text-[#6b7280] text-[0.85rem] font-medium">Starting from</span>
                </div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-[2rem] font-bold text-[#1a1a1a] tracking-tight leading-none">
                    $45<span className="text-[#6b7280] text-[1.2rem] font-medium">/hr</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#fff0ef] text-[#ff5a5f] px-3 py-1.5 rounded-md">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                    <span className="text-[0.75rem] font-bold uppercase tracking-wide">15% OFF</span>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-4">
                  <label className="block text-[#4b5563] font-bold text-[0.8rem] mb-2">Select Date</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                    <input 
                      type="text" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-[#f8fafc] text-[#4b5563] font-medium border border-transparent rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-[#ff5a5f]/20 outline-none transition-all hover:bg-[#f1f5f9]"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-8">
                  <label className="block text-[#4b5563] font-bold text-[0.8rem] mb-2">Select Time</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <select 
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full appearance-none bg-[#f8fafc] text-[#4b5563] font-medium border border-transparent rounded-xl py-3.5 pl-12 pr-10 focus:ring-2 focus:ring-[#ff5a5f]/20 outline-none transition-all cursor-pointer hover:bg-[#f1f5f9]"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="border-t border-[#f3f4f6] pt-6 pb-6 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6b7280] text-[0.95rem]">Service Fee</span>
                    <span className="text-[#6b7280] font-medium text-[0.95rem]">$5.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-[#1a1a1a] font-bold text-[1.05rem]">Estimated Total</span>
                  <span className="text-[#ff5a5f] font-bold text-[1.1rem]">$50.00</span>
                </div>

                {/* Book Now Button */}
                <button 
                  onClick={() => alert(`Booking Gardening for ${selectedDate} at ${selectedTime}`)}
                  className="w-full bg-[#ff5a5f] hover:bg-[#e0484d] text-white font-bold text-[1rem] py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(255,90,95,0.25)] hover:shadow-[0_8px_25px_rgba(255,90,95,0.35)] hover:-translate-y-0.5 active:translate-y-0 mb-4"
                >
                  Book Now
                </button>
                
                <div className="text-center">
                  <span className="text-[#6b7280] text-[0.8rem]">No credit card required yet</span>
                </div>
              </div>

              {/* Guarantee Card */}
              <div className="bg-[#f8fafc] rounded-2xl p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#fff0ef] text-[#ff5a5f] flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-[0.95rem]">Money Back Guarantee</h4>
                  <p className="text-[#6b7280] text-[0.85rem]">100% satisfaction or full refund.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
