"use client";

import Image from "next/image";
import { useState } from "react";

export default function PremiumShiftingPage() {
  const [distance, setDistance] = useState(36);
  const [volume, setVolume] = useState("Light");

  const baseRates = {
    Light: 4500,
    Medium: 8000,
    Heavy: 12000
  };

  const distanceCharge = distance > 15 ? (distance - 15) * 65 : 0;
  const estimatedTotal = baseRates[volume as keyof typeof baseRates] + distanceCharge;

  return (
    <div className="bg-[#fafafa] min-h-screen pb-24">
      {/* Hero Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-16 lg:pt-24 pb-16 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 w-full max-w-[600px]">
          <div className="inline-flex items-center bg-[#ffecec] text-[#b92b2b] px-5 py-1.5 rounded-full text-[0.8rem] font-bold mb-6 tracking-wide">
            Trusted House Shifting
          </div>
          
          <h1 className="text-[3.5rem] lg:text-[4.2rem] font-bold text-[#1a1a1a] leading-[1.05] mb-6 tracking-tight">
            Effortless Relocation Services in Bangladesh
          </h1>
          
          <p className="text-[#6b7280] text-[1.1rem] leading-relaxed mb-10 max-w-[500px]">
            From small studios to large corporate offices, our professional packers and movers handle every item with absolute care and insurance protection.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center bg-white rounded-[2rem] sm:rounded-full shadow-lg border border-gray-100 p-2 max-w-[600px] gap-2 sm:gap-0">
            <div className="flex-1 w-full flex items-center gap-3 px-4 sm:border-r border-gray-200 py-3 sm:py-0">
              <svg className="text-[#b92b2b]" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <input type="text" placeholder="Moving from?" className="w-full bg-transparent outline-none text-[#1a1a1a] text-[1.05rem] placeholder-gray-400 font-medium" />
            </div>
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 sm:py-0">
              <svg className="text-[#b92b2b]" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              <input type="text" placeholder="Moving to?" className="w-full bg-transparent outline-none text-[#1a1a1a] text-[1.05rem] placeholder-gray-400 font-medium" />
            </div>
            <button className="bg-[#b92b2b] hover:bg-[#a12121] text-white w-full sm:w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-md mt-2 sm:mt-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 w-full relative">
          <div className="relative w-full h-[450px] lg:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <Image src="/images/service/shifting service-4.png" alt="Premium Shifting" fill priority className="object-cover object-center" />
          </div>
          
          {/* Floating Badge */}
          <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md rounded-[1.5rem] p-4 pr-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ffeaea] text-[#b92b2b] flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
            </div>
            <div>
              <p className="text-[#1a1a1a] font-bold text-[0.95rem] leading-tight mb-0.5">100% Insured</p>
              <p className="text-[#6b7280] text-[0.7rem] uppercase tracking-wider font-bold">TRANSIT PROTECTION</p>
            </div>
          </div>
        </div>
      </div>

      {/* Choose Your Move Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-[2.5rem] font-bold text-[#1a1a1a] tracking-tight mb-2">Choose Your Move</h2>
            <p className="text-[#6b7280] text-[1.1rem]">Tailored packages for every scale of relocation.</p>
          </div>
          <button className="text-[#b92b2b] font-bold text-[1rem] flex items-center gap-2 hover:gap-3 transition-all w-fit pb-1">
            View all packages 
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Studio Apartment Shifting Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col justify-between h-full">
            <div>
              <div className="w-14 h-14 bg-[#ffecec] text-[#b92b2b] rounded-2xl flex items-center justify-center mb-8">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22"></line><line x1="15" y1="22" x2="15" y2="22"></line><line x1="9" y1="6" x2="9.01" y2="6"></line><line x1="15" y1="6" x2="15.01" y2="6"></line><line x1="9" y1="10" x2="9.01" y2="10"></line><line x1="15" y1="10" x2="15.01" y2="10"></line><line x1="9" y1="14" x2="9.01" y2="14"></line><line x1="15" y1="14" x2="15.01" y2="14"></line><line x1="9" y1="18" x2="9.01" y2="18"></line><line x1="15" y1="18" x2="15.01" y2="18"></line></svg>
              </div>
              <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] mb-4">Studio Apartment Shifting</h3>
              <p className="text-[#6b7280] text-[1rem] leading-relaxed mb-8">
                Ideal for bachelor pads or small units. Includes 2 helpers and a mini truck.
              </p>
              <div className="mb-8">
                <p className="text-[#6b7280] text-[0.85rem] font-bold uppercase tracking-wider mb-2">STARTING AT</p>
                <div className="flex items-end gap-1">
                  <div className="bg-[#b92b2b] text-white text-[0.7rem] font-bold px-1 py-4 uppercase leading-none [writing-mode:vertical-lr] transform rotate-180 rounded-sm">BDT</div>
                  <span className="text-[#b92b2b] text-[2.5rem] font-bold leading-none -ml-1">4,500</span>
                  <span className="text-[#6b7280] text-[0.95rem] mb-1">/move</span>
                </div>
              </div>
            </div>
            <button className="w-full py-4 rounded-[1rem] border border-gray-200 text-[#1a1a1a] font-bold text-[1rem] hover:bg-gray-50 transition-colors">
              Select Plan
            </button>
          </div>

          {/* Full House Move Card (Popular) */}
          <div className="relative bg-[#fff5f5] rounded-[2.5rem] p-8 pb-10 shadow-[0_20px_50px_rgba(185,43,43,0.08)] border-2 border-[#ffcdcd] flex flex-col justify-between h-full lg:scale-105 z-10">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#b92b2b] text-white px-6 py-1.5 rounded-full text-[0.8rem] font-bold tracking-wider uppercase whitespace-nowrap shadow-md">
              MOST POPULAR
            </div>
            <div>
              <div className="w-14 h-14 bg-[#b92b2b] text-white rounded-2xl flex items-center justify-center mb-8 mt-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <h3 className="text-[1.6rem] font-bold text-[#1a1a1a] mb-4">Full House Move</h3>
              <p className="text-[#6b7280] text-[1.05rem] leading-relaxed mb-8">
                Comprehensive solution for 2-4 BHK flats. Specialized packing for electronics.
              </p>
              <div className="mb-8">
                <p className="text-[#6b7280] text-[0.85rem] font-bold uppercase tracking-wider mb-2">STARTING AT</p>
                <div className="flex items-end gap-1">
                  <div className="bg-[#b92b2b] text-white text-[0.7rem] font-bold px-1 py-4 uppercase leading-none [writing-mode:vertical-lr] transform rotate-180 rounded-sm">BDT</div>
                  <span className="text-[#b92b2b] text-[2.5rem] font-bold leading-none -ml-1">12,000</span>
                  <span className="text-[#6b7280] text-[0.95rem] mb-1">/move</span>
                </div>
              </div>
            </div>
            <button className="w-full py-4 rounded-[1rem] bg-[#b92b2b] hover:bg-[#a12121] text-white font-bold text-[1rem] shadow-lg shadow-[#b92b2b]/20 transition-colors">
              Book This Plan
            </button>
          </div>

          {/* Office Shifting Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col justify-between h-full">
            <div>
              <div className="w-14 h-14 bg-[#ffecec] text-[#b92b2b] rounded-2xl flex items-center justify-center mb-8">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
              </div>
              <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] mb-4">Office Shifting</h3>
              <p className="text-[#6b7280] text-[1rem] leading-relaxed mb-8">
                IT equipment handling, furniture dismantling, and weekend shifts available.
              </p>
              <div className="mb-8">
                <p className="text-[#6b7280] text-[0.85rem] font-bold uppercase tracking-wider mb-2">PRICING BASED ON</p>
                <div className="flex items-end gap-1">
                  <span className="text-[#b92b2b] text-[2.5rem] font-bold leading-none">Quote</span>
                  <span className="text-[#6b7280] text-[0.95rem] mb-1">/survey</span>
                </div>
              </div>
            </div>
            <button className="w-full py-4 rounded-[1rem] border border-gray-200 text-[#1a1a1a] font-bold text-[1rem] hover:bg-gray-50 transition-colors">
              Get Custom Quote
            </button>
          </div>

        </div>
      </div>

      {/* Transparent Pricing Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-24">
        <div className="bg-[#fff5f5] rounded-[3rem] p-10 lg:p-16 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full max-w-[500px]">
            <h2 className="text-[2.5rem] font-bold text-[#1a1a1a] tracking-tight mb-4">Transparent Pricing</h2>
            <p className="text-[#6b7280] text-[1.05rem] leading-relaxed mb-10">
              No hidden charges. We calculate costs based on distance and the volume of items to ensure fair billing every time.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white rounded-[1rem] p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <svg className="text-[#b92b2b]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"></path></svg>
                  <span className="text-[#1a1a1a] font-medium text-[0.95rem]">Within Dhaka (0-15km)</span>
                </div>
                <span className="text-[#1a1a1a] font-bold text-[0.95rem]">Base Rate</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded-[1rem] p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <svg className="text-[#b92b2b]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span className="text-[#1a1a1a] font-medium text-[0.95rem]">Per KM Charge (&gt;15km)</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-[#b92b2b] text-white text-[0.6rem] font-bold px-1 py-3 uppercase leading-none [writing-mode:vertical-lr] transform rotate-180 rounded-sm mr-1">BDT</div>
                  <span className="text-[#1a1a1a] font-bold text-[0.95rem]">65/km</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white rounded-[1rem] p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <svg className="text-[#b92b2b]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  <span className="text-[#1a1a1a] font-medium text-[0.95rem]">Packing Materials (Bubble/Wrap)</span>
                </div>
                <span className="text-[#1a1a1a] font-bold text-[0.95rem]">Included</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full bg-white rounded-[2rem] p-8 lg:p-10 shadow-xl shadow-[#b92b2b]/5 border border-gray-100">
            <h3 className="text-[#1a1a1a] font-bold mb-8">Quick Price Estimate</h3>
            
            <div className="mb-8">
              <label className="text-[#6b7280] text-[0.8rem] font-bold uppercase tracking-wider flex justify-between items-center mb-4">
                <span>DISTANCE (APPROX KM)</span>
                <span className="text-[#b92b2b] text-[1rem]">{distance} KM</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={distance} 
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-4 bg-gray-100 rounded-full outline-none accent-[#b92b2b] shadow-inner border border-gray-200 cursor-pointer"
              />
            </div>

            <div className="mb-10">
              <label className="text-[#6b7280] text-[0.8rem] font-bold uppercase tracking-wider block mb-4">VOLUME LEVEL</label>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setVolume('Light')}
                  className={`py-3.5 border-2 font-bold rounded-xl text-[0.95rem] transition-colors ${volume === 'Light' ? 'border-[#b92b2b] bg-[#fff5f5] text-[#b92b2b]' : 'border-gray-200 bg-white hover:bg-gray-50 text-[#1a1a1a]'}`}>
                  Light
                </button>
                <button 
                  onClick={() => setVolume('Medium')}
                  className={`py-3.5 border-2 font-bold rounded-xl text-[0.95rem] transition-colors ${volume === 'Medium' ? 'border-[#b92b2b] bg-[#fff5f5] text-[#b92b2b]' : 'border-gray-200 bg-white hover:bg-gray-50 text-[#1a1a1a]'}`}>
                  Medium
                </button>
                <button 
                  onClick={() => setVolume('Heavy')}
                  className={`py-3.5 border-2 font-bold rounded-xl text-[0.95rem] transition-colors ${volume === 'Heavy' ? 'border-[#b92b2b] bg-[#fff5f5] text-[#b92b2b]' : 'border-gray-200 bg-white hover:bg-gray-50 text-[#1a1a1a]'}`}>
                  Heavy
                </button>
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-gray-100 pt-6 mb-6">
              <span className="text-[#1a1a1a] font-medium text-[1rem]">Estimated Total:</span>
              <div className="flex items-end gap-1">
                <div className="bg-[#b92b2b] text-white text-[0.65rem] font-bold px-1 py-3 uppercase leading-none [writing-mode:vertical-lr] transform rotate-180 rounded-sm mb-1">BDT</div>
                <span className="text-[#b92b2b] text-[1.8rem] font-bold leading-none">{estimatedTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => alert(`Booking placed! \n\nVolume: ${volume} \nDistance: ${distance} km \nTotal: ৳${estimatedTotal.toLocaleString()}`)}
              className="w-full bg-[#b92b2b] hover:bg-[#a12121] text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-[#b92b2b]/20 text-[1rem]"
            >
              Proceed to Booking
            </button>
          </div>
        </div>
      </div>

      {/* Verified Professionals Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-24 pb-12">
        <h2 className="text-[2.5rem] font-bold text-[#1a1a1a] tracking-tight mb-12">Verified Professionals</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pro 1 */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col justify-between h-full group">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#b92b2b] transition-colors shrink-0">
                  <Image src="/images/service/shifting-1.png" alt="Rahim Uddin" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-[1.05rem]">Rahim Uddin</h4>
                  <p className="text-[#b92b2b] text-[0.85rem] font-bold">★ 4.9 <span className="text-[#6b7280] font-normal">(124)</span></p>
                </div>
              </div>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed mb-6">
                Expert in Fragile Items & Glassware. 8+ years experience.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="bg-[#fff5f5] text-[#b92b2b] text-[0.65rem] px-3 py-1.5 rounded-full font-bold">Dismantling</span>
                <span className="bg-[#fff5f5] text-[#b92b2b] text-[0.65rem] px-3 py-1.5 rounded-full font-bold">Bubble Wrap</span>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl border border-[#b92b2b] text-[#b92b2b] font-bold text-[0.95rem] hover:bg-[#fff5f5] transition-colors">
              View Profile
            </button>
          </div>

          {/* Pro 2 */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col justify-between h-full group">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#b92b2b] transition-colors shrink-0">
                  <Image src="/images/service/shifting-2.png" alt="Shakil Ahmed" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-[1.05rem]">Shakil Ahmed</h4>
                  <p className="text-[#b92b2b] text-[0.85rem] font-bold">★ 4.8 <span className="text-[#6b7280] font-normal">(89)</span></p>
                </div>
              </div>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed mb-6">
                Specialized in Large Furniture & Wardrobes. Fast turnaround.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="bg-[#fff5f5] text-[#b92b2b] text-[0.65rem] px-3 py-1.5 rounded-full font-bold">Heavy Lift</span>
                <span className="bg-[#fff5f5] text-[#b92b2b] text-[0.65rem] px-3 py-1.5 rounded-full font-bold">Quick Shift</span>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl border border-[#b92b2b] text-[#b92b2b] font-bold text-[0.95rem] hover:bg-[#fff5f5] transition-colors">
              View Profile
            </button>
          </div>

          {/* Pro 3 */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col justify-between h-full group">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#b92b2b] transition-colors shrink-0">
                  <Image src="/images/service/shifting-3.png" alt="Nabila Islam" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-[1.05rem]">Nabila Islam</h4>
                  <p className="text-[#b92b2b] text-[0.85rem] font-bold">★ 5.0 <span className="text-[#6b7280] font-normal">(42)</span></p>
                </div>
              </div>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed mb-6">
                Certified Packer. 100% item safety record for electronics.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="bg-[#fff5f5] text-[#b92b2b] text-[0.65rem] px-3 py-1.5 rounded-full font-bold">Tech Safe</span>
                <span className="bg-[#fff5f5] text-[#b92b2b] text-[0.65rem] px-3 py-1.5 rounded-full font-bold">Delicate</span>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl border border-[#b92b2b] text-[#b92b2b] font-bold text-[0.95rem] hover:bg-[#fff5f5] transition-colors">
              View Profile
            </button>
          </div>

          {/* Pro 4 */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col justify-between h-full group">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#b92b2b] transition-colors shrink-0">
                  <Image src="/images/service/shifting-4.png" alt="Kamrul Hasan" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-[1.05rem]">Kamrul Hasan</h4>
                  <p className="text-[#b92b2b] text-[0.85rem] font-bold">★ 4.7 <span className="text-[#6b7280] font-normal">(210)</span></p>
                </div>
              </div>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed mb-6">
                Fleet Manager. Handles massive office relocations with ease.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="bg-[#fff5f5] text-[#b92b2b] text-[0.65rem] px-3 py-1.5 rounded-full font-bold">Corporate</span>
                <span className="bg-[#fff5f5] text-[#b92b2b] text-[0.65rem] px-3 py-1.5 rounded-full font-bold">Long Haul</span>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl border border-[#b92b2b] text-[#b92b2b] font-bold text-[0.95rem] hover:bg-[#fff5f5] transition-colors">
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Insurance & Guarantee Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Fully Insured Transit Card */}
          <div className="bg-[#fff5f5] rounded-[3rem] p-10 lg:p-14 shadow-sm border border-[#fdeeee] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 className="text-[2.2rem] font-bold text-[#1a1a1a] tracking-tight mb-4">Fully Insured Transit</h3>
              <p className="text-[#6b7280] text-[1.05rem] leading-relaxed mb-8">
                Every booking includes a standard insurance policy that covers accidental damage during transit up to ৳50,000. Premium cover available for luxury items.
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <svg className="text-green-500 shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-[#1a1a1a] font-medium text-[0.95rem]">Zero Deductible Claims</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="text-green-500 shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-[#1a1a1a] font-medium text-[0.95rem]">Coverage for Glassware & TVs</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="text-green-500 shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-[#1a1a1a] font-medium text-[0.95rem]">Verified Damage Assessment</span>
                </li>
              </ul>
            </div>
            
            <a href="#" className="text-[#b92b2b] font-medium text-[0.95rem] underline hover:text-[#a12121] transition-colors underline-offset-4">Read full policy details</a>
          </div>

          {/* The Rajseba Guarantee Card */}
          <div className="bg-[#261b1b] rounded-[3rem] p-10 lg:p-14 shadow-2xl flex flex-col justify-center">
            <h3 className="text-[2.2rem] font-bold text-white tracking-tight mb-4">The Rajseba Guarantee</h3>
            <p className="text-gray-300 text-[1.05rem] leading-relaxed mb-12 max-w-[500px]">
              Our commitment to safety and quality is unmatched. We vet every packer through a rigorous background check and on-site skill testing.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-[1.5rem] p-6 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <p className="text-[#ff8a8a] text-[1.1rem] font-medium mb-1">24/7</p>
                <p className="text-gray-300 text-[0.8rem] font-bold tracking-widest uppercase">SUPPORT LINE</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-[1.5rem] p-6 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <p className="text-[#ff8a8a] text-[1.1rem] font-medium mb-1">100%</p>
                <p className="text-gray-300 text-[0.8rem] font-bold tracking-widest uppercase">VERIFIED PROS</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
