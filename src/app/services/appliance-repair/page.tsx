"use client";

import Image from "next/image";
import { useState } from "react";

export default function ApplianceRepairPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Searching for experts related to: ${searchQuery}`);
    } else {
      alert("Please enter a specific issue to search.");
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Hero Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-10">
        <div className="relative w-full h-[450px] lg:h-[500px] rounded-[2.5rem] overflow-hidden">
          {/* Background Image */}
          <Image src="/images/service/Appliance Repair.png" alt="Appliance Repair" fill priority className="object-cover object-center" />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

          {/* Hero Content */}
          <div className="absolute inset-0 p-10 lg:p-16 flex flex-col justify-center">
            <div className="w-fit bg-[#3b1f1f]/80 backdrop-blur-md text-[#ff9999] px-4 py-1.5 rounded-full text-[0.8rem] font-medium mb-6 border border-[#ff5a5f]/20">
              Authorized Service Partners
            </div>
            
            <h1 className="text-[3rem] lg:text-[4rem] font-bold text-white leading-[1.1] mb-6 max-w-[600px] tracking-tight">
              Expert Appliance Repair at Your Doorstep
            </h1>
            
            <p className="text-gray-200 text-[1.1rem] leading-relaxed mb-10 max-w-[500px]">
              Premium care for your kitchen and laundry essentials with verified experts and genuine parts.
            </p>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="relative mt-8 mx-auto max-w-[1000px] bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 p-3 flex flex-col md:flex-row items-center gap-4 z-10">
          <div className="flex-1 w-full flex items-center gap-3 px-6 py-2 border-b md:border-b-0 md:border-r border-gray-100">
            <svg className="text-[#ff5a5f]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search specific issues..." 
              className="w-full bg-transparent outline-none text-[#1a1a1a] text-[1.05rem] placeholder-gray-400 font-medium" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="flex-1 w-full flex items-center gap-3 px-6 py-2">
            <svg className="text-[#ff5a5f]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span className="text-[#6b7280] text-[1.05rem] font-medium">Next available: <span className="text-[#1a1a1a]">Today, 2:00 PM</span></span>
          </div>

          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-[#ff5a5f] hover:bg-[#e0484d] text-white font-bold px-10 py-4 rounded-full transition-colors shadow-lg shadow-[#ff5a5f]/30 whitespace-nowrap text-[1rem]"
          >
            Find Experts
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Card: Refrigerator Repair */}
          <div className="flex-[2] bg-white rounded-[2.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-[350px] relative h-[250px] sm:h-[300px] md:h-auto rounded-[2rem] overflow-hidden shrink-0 bg-gray-100">
              <Image src="/images/service/Refrigerator.png" alt="Refrigerator Repair" fill className="object-cover" />
            </div>
            
            <div className="flex-1 flex flex-col justify-center py-4 pr-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start gap-3 sm:gap-0 mb-4">
                <h3 className="text-[2rem] font-bold text-[#1a1a1a] tracking-tight leading-tight">Refrigerator Repair</h3>
                <span className="bg-[#fff5f5] text-[#b92b2b] px-4 py-1.5 rounded-full text-[0.85rem] font-bold whitespace-nowrap">Top Rated</span>
              </div>
              
              <p className="text-[#6b7280] text-[1.05rem] leading-relaxed mb-6">
                Expert diagnosis for cooling issues, compressor failures, and gas leaks. All brands covered including Samsung, LG, and Whirlpool.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-[#6b7280] font-medium text-[0.95rem]">Gas Refilling & Sealing</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-[#6b7280] font-medium text-[0.95rem]">Thermostat Replacement</span>
                </li>
              </ul>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                <div>
                  <p className="text-[#6b7280] text-[0.8rem] font-bold uppercase tracking-wider mb-1">Diagnostic Fee</p>
                  <div className="flex items-end gap-1">
                    <div className="bg-[#b92b2b] text-white text-[0.65rem] font-bold px-1 py-3 uppercase leading-none [writing-mode:vertical-lr] transform rotate-180 rounded-sm mb-1">BDT</div>
                    <span className="text-[#b92b2b] text-[2rem] font-bold leading-none">499</span>
                  </div>
                </div>
                <button className="border border-gray-200 text-[#1a1a1a] hover:bg-gray-50 font-bold px-8 py-3.5 rounded-xl transition-colors text-[0.95rem]">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Right Card: Parts Warranty */}
          <div className="flex-1 bg-[#fdeeee] rounded-[2.5rem] p-10 flex flex-col justify-center relative overflow-hidden">
            <svg className="text-[#b92b2b] mb-6" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
            
            <h3 className="text-[2rem] font-bold text-[#1a1a1a] tracking-tight mb-4">Parts Warranty</h3>
            <p className="text-[#6b7280] text-[1.05rem] leading-relaxed mb-10">
              We provide a 90-day official warranty on all replaced spare parts and a 30-day service guarantee.
            </p>
            
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white flex items-center gap-4 mt-auto">
              <div className="w-10 h-10 bg-[#fff5f5] text-[#b92b2b] rounded-xl flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <div>
                <p className="text-[#1a1a1a] font-bold text-[0.95rem]">Genuine Parts</p>
                <p className="text-[#6b7280] text-[0.8rem]">OEM certified</p>
              </div>
            </div>
          </div>

        </div>

        {/* Secondary Services Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Washing Machine */}
          <div className="bg-white rounded-[2.5rem] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col">
            <div className="relative w-full h-[220px] rounded-[2rem] overflow-hidden mb-6">
              <Image src="/images/service/Washing Machine.png" alt="Washing Machine" fill className="object-cover" />
            </div>
            <div className="px-4 pb-4 flex flex-col flex-1">
              <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] mb-2">Washing Machine</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed mb-6">
                Fixing drum issues, drainage blocks, and electronic control boards.
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-[#1a1a1a] font-bold text-[1.2rem]">৳399</span>
                  <span className="text-[#6b7280] text-[0.75rem] font-medium">Base Fee</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#fff5f5] flex items-center justify-center text-[#ff5a5f] hover:bg-[#ffebeb] transition-colors cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Oven Repair */}
          <div className="bg-white rounded-[2.5rem] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col">
            <div className="relative w-full h-[220px] rounded-[2rem] overflow-hidden mb-6">
              <Image src="/images/service/Oven Repair.png" alt="Oven Repair" fill className="object-cover" />
            </div>
            <div className="px-4 pb-4 flex flex-col flex-1">
              <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] mb-2">Oven Repair</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed mb-6">
                Microwave and electric oven heating element & circuit repairs.
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-[#1a1a1a] font-bold text-[1.2rem]">৳299</span>
                  <span className="text-[#6b7280] text-[0.75rem] font-medium">Base Fee</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#fff5f5] flex items-center justify-center text-[#ff5a5f] hover:bg-[#ffebeb] transition-colors cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
            </div>
          </div>

          {/* No Hidden Costs */}
          <div className="bg-[#ff5a5f] rounded-[2.5rem] p-8 lg:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl shadow-[#ff5a5f]/20">
            <svg className="text-white mb-6" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="12" rx="2"></rect>
              <circle cx="12" cy="12" r="2"></circle>
              <path d="M6 12h.01M18 12h.01"></path>
            </svg>
            <h3 className="text-[1.8rem] font-bold text-white mb-4 leading-tight">No Hidden Costs</h3>
            <p className="text-white/90 text-[1rem] leading-relaxed mb-10 px-2">
              Transparent diagnostic fees that are waived if you proceed with the suggested repair.
            </p>
            <button className="w-full bg-white text-[#ff5a5f] font-bold py-4 rounded-full hover:bg-gray-50 transition-colors shadow-md text-[0.95rem]">
              Pricing Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* Top Specialized Technicians */}
      <div className="max-w-[1300px] mx-auto px-6 pt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-[2rem] lg:text-[2.5rem] font-bold text-[#1a1a1a] tracking-tight mb-2">Top Specialized Technicians</h2>
            <p className="text-[#6b7280] text-[1.1rem]">Background-verified experts with 5+ years of experience.</p>
          </div>
          <a href="#" className="text-[#ff5a5f] font-medium text-[1rem] hover:underline flex items-center gap-1">
            View all 120 experts <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Technician 1 */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="relative w-24 h-24 rounded-full mb-4">
              <Image src="/images/service/rep-Technician.png" alt="Kamal Hossain" fill className="rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#22c55e] border-[3px] border-white rounded-full"></div>
            </div>
            <h4 className="text-[#1a1a1a] font-bold text-[1.1rem]">Kamal Hossain</h4>
            <p className="text-[#6b7280] text-[0.85rem] mb-2">Fridge Specialist</p>
            <div className="flex items-center gap-1 mb-6">
              <svg className="text-[#ff5a5f]" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span className="text-[#ff5a5f] text-[0.9rem] font-bold">4.9 <span className="font-normal opacity-80">(2.1k reviews)</span></span>
            </div>
            <button className="w-full py-3 rounded-xl border border-[#ff5a5f]/20 bg-gradient-to-b from-white to-[#fff5f5] text-[#ff5a5f] font-bold text-[0.95rem] hover:from-[#fff5f5] hover:to-[#ffebeb] transition-colors shadow-sm">
              Book Now
            </button>
          </div>

          {/* Technician 2 */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="relative w-24 h-24 rounded-full mb-4">
              <Image src="/images/service/rep-Technician1.png" alt="Ariful Islam" fill className="rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#22c55e] border-[3px] border-white rounded-full"></div>
            </div>
            <h4 className="text-[#1a1a1a] font-bold text-[1.1rem]">Ariful Islam</h4>
            <p className="text-[#6b7280] text-[0.85rem] mb-2">Electronic Expert</p>
            <div className="flex items-center gap-1 mb-6">
              <svg className="text-[#ff5a5f]" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span className="text-[#ff5a5f] text-[0.9rem] font-bold">4.8 <span className="font-normal opacity-80">(1.8k reviews)</span></span>
            </div>
            <button className="w-full py-3 rounded-xl border border-[#ff5a5f]/20 bg-gradient-to-b from-white to-[#fff5f5] text-[#ff5a5f] font-bold text-[0.95rem] hover:from-[#fff5f5] hover:to-[#ffebeb] transition-colors shadow-sm">
              Book Now
            </button>
          </div>

          {/* Technician 3 */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="relative w-24 h-24 rounded-full mb-4">
              <Image src="/images/service/rep-Technician2.png" alt="Mehedi Hasan" fill className="rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#eab308] border-[3px] border-white rounded-full"></div>
            </div>
            <h4 className="text-[#1a1a1a] font-bold text-[1.1rem]">Mehedi Hasan</h4>
            <p className="text-[#6b7280] text-[0.85rem] mb-2">Oven Specialist</p>
            <div className="flex items-center gap-1 mb-6">
              <svg className="text-[#ff5a5f]" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span className="text-[#ff5a5f] text-[0.9rem] font-bold">5.0 <span className="font-normal opacity-80">(850 reviews)</span></span>
            </div>
            <button className="w-full py-3 rounded-xl border border-[#ff5a5f]/20 bg-gradient-to-b from-white to-[#fff5f5] text-[#ff5a5f] font-bold text-[0.95rem] hover:from-[#fff5f5] hover:to-[#ffebeb] transition-colors shadow-sm">
              Book Now
            </button>
          </div>

          {/* Technician 4 */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="relative w-24 h-24 rounded-full mb-4">
              <Image src="/images/service/rep-Technician3.png" alt="Zarin Tasnim" fill className="rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#22c55e] border-[3px] border-white rounded-full"></div>
            </div>
            <h4 className="text-[#1a1a1a] font-bold text-[1.1rem]">Zarin Tasnim</h4>
            <p className="text-[#6b7280] text-[0.85rem] mb-2">Care Coordinator</p>
            <div className="flex items-center gap-1 mb-6">
              <svg className="text-[#ff5a5f]" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span className="text-[#ff5a5f] text-[0.9rem] font-bold">4.9 <span className="font-normal opacity-80">(3.2k reviews)</span></span>
            </div>
            <button className="w-full py-3 rounded-xl border border-[#ff5a5f]/20 bg-gradient-to-b from-white to-[#fff5f5] text-[#ff5a5f] font-bold text-[0.95rem] hover:from-[#fff5f5] hover:to-[#ffebeb] transition-colors shadow-sm">
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* How Rajseba Works */}
      <div className="w-full bg-[#fff5f5] py-24 mt-24">
        <div className="max-w-[1300px] mx-auto px-6 text-center">
          <h2 className="text-[2.5rem] font-bold text-[#1a1a1a] mb-4 tracking-tight">How Rajseba Works</h2>
          <p className="text-[#6b7280] text-[1.1rem] max-w-[600px] mx-auto mb-20 leading-relaxed">
            Booking a repair is as easy as ordering food. Follow our simple 3-step process to get your home back in order.
          </p>

          <div className="relative flex flex-col md:flex-row justify-between items-start lg:px-12">
            {/* Dashed line connecting steps */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[2px] border-b-2 border-dashed border-[#ff5a5f]/30 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center flex-1 mb-12 md:mb-0 px-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.8),0_10px_30px_rgba(255,90,95,0.1)] flex items-center justify-center mb-8">
                <span className="text-[#ff5a5f] text-[1.6rem] font-bold">1</span>
              </div>
              <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] mb-3">Book Online</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                Select your service, choose a time slot, and describe the issue.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center flex-1 mb-12 md:mb-0 px-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.8),0_10px_30px_rgba(255,90,95,0.1)] flex items-center justify-center mb-8">
                <span className="text-[#ff5a5f] text-[1.6rem] font-bold">2</span>
              </div>
              <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] mb-3">Expert Visit</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                A verified pro arrives at your door for a thorough diagnostic check.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center flex-1 px-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.8),0_10px_30px_rgba(255,90,95,0.1)] flex items-center justify-center mb-8">
                <span className="text-[#ff5a5f] text-[1.6rem] font-bold">3</span>
              </div>
              <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] mb-3">Quick Repair</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                On-the-spot repair with genuine parts and a 90-day warranty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
