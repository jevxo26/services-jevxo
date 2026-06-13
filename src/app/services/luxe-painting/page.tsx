"use client";

import Image from "next/image";
import { useRef } from "react";

export default function LuxePaintingPage() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-16 lg:pt-24 pb-16 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 w-full max-w-[600px]">
          <div className="inline-flex items-center bg-[#ffecec] text-[#b92b2b] px-4 py-1.5 rounded-full text-[0.75rem] font-bold uppercase tracking-wider mb-8">
            PREMIUM PAINTING SOLUTIONS
          </div>
          
          <h1 className="text-[3.5rem] lg:text-[4.2rem] font-bold text-[#1a1a1a] leading-[1.05] mb-6 tracking-tight">
            Elevate Your Living Space with <span className="text-[#b92b2b]">Master Strokes.</span>
          </h1>
          
          <p className="text-[#6b7280] text-[1.1rem] leading-relaxed mb-10 max-w-[500px]">
            Experience the luxury of professional painting. From vibrant interiors to weather-shielded exteriors, we bring color to your life with precision and care.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-[#b92b2b] hover:bg-[#a12121] text-white px-8 py-4 rounded-xl text-[1rem] font-bold transition-colors flex items-center gap-2 shadow-lg shadow-[#b92b2b]/20">
              Book a Color Consult
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <button className="bg-white hover:bg-gray-50 text-[#1a1a1a] px-8 py-4 rounded-xl text-[1rem] font-bold transition-colors shadow-sm border border-[#f3f4f6] flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>
              View Trends
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 w-full relative">
          <div className="relative w-full h-[500px] lg:h-[650px] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <Image src="/images/service/Professional Painter-1.png" alt="Professional Painter" fill priority className="object-cover object-center" />
          </div>
          
          {/* Floating Badge */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[85%] max-w-[420px] bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ffeaeb] text-[#ff5a5f] flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </div>
            <div>
              <p className="text-[#1a1a1a] font-bold text-[0.95rem] leading-tight mb-1">500+ Verified Artists</p>
              <p className="text-[#6b7280] text-[0.85rem]">Top-rated in Bangladesh</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Services Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-20">
        <div className="mb-12 text-center">
          <h2 className="text-[2.5rem] font-bold text-[#1a1a1a] tracking-tight mb-3">Expert Services Tailored for You</h2>
          <p className="text-[#6b7280] text-[1.1rem]">Precision in every brushstroke, protection in every layer.</p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Top Row: Interior (col-span-2), Exterior (col-span-1) */}
          {/* Interior Painting Card */}
          <div className="lg:col-span-2 bg-[#fffcfc] rounded-[2.5rem] p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col md:flex-row gap-8 items-center group">
            <div className="relative w-full md:w-[45%] h-[300px] md:h-[350px] rounded-[2rem] overflow-hidden">
              <Image src="/images/service/paint-2.png" alt="Interior Painting" fill className="object-cover" />
            </div>
            <div className="flex-1 w-full flex flex-col justify-center">
              <h3 className="text-[1.8rem] font-bold text-[#1a1a1a] mb-3">Interior Painting</h3>
              <p className="text-[#6b7280] text-[1.05rem] leading-relaxed mb-6">
                From accent walls to complete home transformations. We use eco-friendly, low-VOC paints for a healthy home environment.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-[#1a1a1a] text-[0.95rem] font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#b92b2b] flex items-center justify-center text-white shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  2-Year Warranty
                </li>
                <li className="flex items-center gap-3 text-[#1a1a1a] text-[0.95rem] font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#b92b2b] flex items-center justify-center text-white shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  Furniture Protection Included
                </li>
                <li className="flex items-center gap-3 text-[#1a1a1a] text-[0.95rem] font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#b92b2b] flex items-center justify-center text-white shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  Post-Service Cleanup
                </li>
              </ul>
              <button className="text-[#b92b2b] font-bold text-[0.95rem] flex items-center gap-2 hover:gap-3 transition-all w-fit">
                Explore Portfolio 
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </button>
            </div>
          </div>

          {/* Exterior Coating Card */}
          <div className="bg-[#fffcfc] rounded-[2.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col group">
            <div className="relative w-full h-[240px] rounded-[2rem] overflow-hidden mb-6">
              <Image src="/images/service/paint-3.png" alt="Exterior Coating" fill className="object-cover" />
            </div>
            <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] mb-3 px-2">Exterior Coating</h3>
            <p className="text-[#6b7280] text-[1rem] leading-relaxed mb-6 px-2 flex-1">
              Weather-shield technology that protects your facade from the harsh monsoon and humidity.
            </p>
            <button className="text-[#b92b2b] font-bold text-[0.95rem] flex items-center gap-2 px-2 hover:gap-3 transition-all w-fit">
              View Pricing 
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          {/* Bottom Row: Waterproofing (col-span-1), Curated Palettes (col-span-2) */}
          {/* Waterproofing Card */}
          <div className="bg-[#fffcfc] rounded-[2.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f3f4f6] flex flex-col group">
            <div className="relative w-full h-[240px] rounded-[2rem] overflow-hidden mb-6">
              <Image src="/images/service/paint-4.png" alt="Waterproofing" fill className="object-cover" />
            </div>
            <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] mb-3 px-2">Waterproofing</h3>
            <p className="text-[#6b7280] text-[1rem] leading-relaxed mb-6 px-2 flex-1">
              Specialized roof and terrace treatments to eliminate dampness and structural decay permanently.
            </p>
            <button className="text-[#b92b2b] font-bold text-[0.95rem] flex items-center gap-2 px-2 hover:gap-3 transition-all w-fit">
              Get Quote 
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          {/* Curated Color Palettes Card */}
          <div className="lg:col-span-2 bg-[#fff1f1] rounded-[2.5rem] p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#ffe4e4] flex flex-col justify-between">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
              <div>
                <h3 className="text-[1.8rem] font-bold text-[#1a1a1a] mb-2">Curated Color Palettes</h3>
                <p className="text-[#6b7280] text-[1.05rem]">Designed by leading interior stylists.</p>
              </div>
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-[3px] border-[#fff1f1] bg-[#dca8a8] shadow-sm"></div>
                <div className="w-12 h-12 rounded-full border-[3px] border-[#fff1f1] bg-[#b92b2b] shadow-sm"></div>
                <div className="w-12 h-12 rounded-full border-[3px] border-[#fff1f1] bg-[#4b5563] shadow-sm"></div>
                <div className="w-12 h-12 rounded-full border-[3px] border-[#fff1f1] bg-[#e5e7eb] shadow-sm"></div>
                <div className="w-12 h-12 rounded-full border-[3px] border-[#fff1f1] bg-[#ff5a5f] text-white flex items-center justify-center text-[0.75rem] font-bold shadow-sm z-10">
                  +12
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
              <span className="text-[#8c8c8c] font-black text-[1.5rem] tracking-widest uppercase">Berger</span>
              <span className="text-[#8c8c8c] font-bold text-[1.5rem] tracking-tight">AsianPaints</span>
              <span className="text-[#8c8c8c] font-black text-[1.5rem] tracking-widest uppercase">Jotun</span>
              <span className="text-[#8c8c8c] font-black text-[1.5rem] tracking-wider uppercase">Elite</span>
            </div>
          </div>
          
        </div>
      </div>

      {/* Master Artisans Section */}
      <div className="bg-[#fff5f5] pt-20 pb-24 mt-24">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-[2.5rem] font-bold text-[#1a1a1a] tracking-tight mb-2">Our Master Artisans</h2>
              <p className="text-[#6b7280] text-[1.05rem]">Top-rated professionals with verified track records.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={slideLeft}
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-[#1a1a1a]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button 
                onClick={slideRight}
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-[#b92b2b]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>

          <div ref={sliderRef} className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8" >
            {/* Card 1: Imran Hossain */}
            <div className="min-w-[350px] lg:min-w-[400px] bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] snap-start shrink-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#b92b2b] shrink-0">
                  <Image src="/images/service/paintman1.png" alt="Imran Hossain" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-[1.1rem]">Imran Hossain</h4>
                  <p className="text-[#b92b2b] text-[0.85rem] font-bold">★ 4.9 <span className="text-[#6b7280] font-normal">(124 Jobs)</span></p>
                </div>
              </div>
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1 h-[140px] rounded-2xl overflow-hidden bg-gray-100">
                  <Image src="/images/service/paint-5.png" alt="Portfolio 1" fill className="object-cover" />
                </div>
                <div className="relative flex-1 h-[140px] rounded-2xl overflow-hidden bg-gray-100">
                  <Image src="/images/service/paint-6.png" alt="Portfolio 2" fill className="object-cover" />
                </div>
              </div>
              <button className="w-full py-3.5 rounded-[1rem] border border-gray-100 text-[#b92b2b] font-bold text-[0.95rem] hover:bg-gray-50 transition-colors">
                Check Availability
              </button>
            </div>

            {/* Card 2: Farhana Ahmed */}
            <div className="min-w-[350px] lg:min-w-[400px] bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] snap-start shrink-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#b92b2b] shrink-0">
                  <Image src="/images/service/paintman2.png" alt="Farhana Ahmed" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-[1.1rem]">Farhana Ahmed</h4>
                  <p className="text-[#b92b2b] text-[0.85rem] font-bold">★ 5.0 <span className="text-[#6b7280] font-normal">(86 Jobs)</span></p>
                </div>
              </div>
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1 h-[140px] rounded-2xl overflow-hidden bg-gray-100">
                  <Image src="/images/service/paint-7.png" alt="Portfolio 3" fill className="object-cover" />
                </div>
                <div className="relative flex-1 h-[140px] rounded-2xl overflow-hidden bg-gray-100">
                  <Image src="/images/service/paint-8.png" alt="Portfolio 4" fill className="object-cover" />
                </div>
              </div>
              <button className="w-full py-3.5 rounded-[1rem] border border-gray-100 text-[#b92b2b] font-bold text-[0.95rem] hover:bg-gray-50 transition-colors">
                Check Availability
              </button>
            </div>

            {/* Card 3: Kabir Uddin */}
            <div className="min-w-[350px] lg:min-w-[400px] bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] snap-start shrink-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#b92b2b] shrink-0">
                  <Image src="/images/service/paintman3.png" alt="Kabir Uddin" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-[1.1rem]">Kabir Uddin</h4>
                  <p className="text-[#b92b2b] text-[0.85rem] font-bold">★ 4.8 <span className="text-[#6b7280] font-normal">(210 Jobs)</span></p>
                </div>
              </div>
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1 h-[140px] rounded-2xl overflow-hidden bg-gray-100">
                  <Image src="/images/service/paint-9.png" alt="Portfolio 5" fill className="object-cover" />
                </div>
                <div className="relative flex-1 h-[140px] rounded-2xl overflow-hidden bg-gray-100">
                  <Image src="/images/service/paint-10.png" alt="Portfolio 6" fill className="object-cover" />
                </div>
              </div>
              <button className="w-full py-3.5 rounded-[1rem] border border-gray-100 text-[#b92b2b] font-bold text-[0.95rem] hover:bg-gray-50 transition-colors">
                Check Availability
              </button>
            </div>
            
            {/* Card 4: For sliding demo */}
            <div className="min-w-[350px] lg:min-w-[400px] bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] snap-start shrink-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#b92b2b] shrink-0">
                  <Image src="/images/service/paintman1.png" alt="Sajjad Ali" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-[1.1rem]">Sajjad Ali</h4>
                  <p className="text-[#b92b2b] text-[0.85rem] font-bold">★ 4.9 <span className="text-[#6b7280] font-normal">(112 Jobs)</span></p>
                </div>
              </div>
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1 h-[140px] rounded-2xl overflow-hidden bg-gray-100">
                  <Image src="/images/service/paint-5.png" alt="Portfolio 7" fill className="object-cover" />
                </div>
                <div className="relative flex-1 h-[140px] rounded-2xl overflow-hidden bg-gray-100">
                  <Image src="/images/service/paint-6.png" alt="Portfolio 8" fill className="object-cover" />
                </div>
              </div>
              <button className="w-full py-3.5 rounded-[1rem] border border-gray-100 text-[#b92b2b] font-bold text-[0.95rem] hover:bg-gray-50 transition-colors">
                Check Availability
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-16 pb-24">
        <div className="bg-[#b92b2b] rounded-[2.5rem] p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
          
          <div className="flex-1 w-full max-w-[550px] z-10">
            <h2 className="text-[2.5rem] lg:text-[3.2rem] font-bold text-white leading-[1.1] mb-6">
              Ready to see your<br />home in a new light?
            </h2>
            <p className="text-white/90 text-[1.05rem] leading-relaxed mb-10 max-w-[450px]">
              Upload a photo of your room and use our AI visualizer to try different palettes before we start painting.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-white hover:bg-gray-50 text-[#b92b2b] px-8 py-3.5 rounded-[1rem] text-[0.95rem] font-bold transition-colors shadow-lg">
                Try Visualizer
              </button>
              <button className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-3.5 rounded-[1rem] text-[0.95rem] font-bold transition-colors">
                Download Brochure
              </button>
            </div>
          </div>

          <div className="flex-1 w-full relative z-10 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.4)] border-[6px] border-white/30">
              <Image src="/images/service/paint-11.png" alt="AI Visualizer" fill className="object-cover" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
