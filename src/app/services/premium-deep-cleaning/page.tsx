"use client";

import Image from "next/image";
import Link from "next/link";

export default function PremiumDeepCleaningPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/service/pre cleaning service-2.png" alt="Professional Cleaning for Your Sanctuary" fill priority className="object-cover" />
          {/* Soft black overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6">
          <div className="max-w-[700px]">
            <h1 className="text-white text-[3.5rem] font-bold leading-tight mb-4 tracking-tight drop-shadow-md">
              Professional Cleaning for<br />Your Sanctuary
            </h1>
            <p className="text-white text-[1.15rem] leading-relaxed mb-8 max-w-[550px] drop-shadow-md">
              Experience the ultimate in hygiene with our premium, hotel-grade
              cleaning services tailored for urban homes in Bangladesh.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="px-8 py-3 bg-[#c92a2a] hover:bg-[#a62323] text-white rounded-lg text-[1rem] font-semibold transition-colors shadow-lg">
                Book Now
              </button>
              <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/50 rounded-lg text-[1rem] font-semibold backdrop-blur-sm transition-colors shadow-lg">
                Explore Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 px-6 bg-[#fff5f5]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#c92a2a] text-[0.85rem] font-bold uppercase tracking-[0.1em] mb-3 block">
              Our Expertise
            </span>
            <h2 className="text-[2.3rem] font-bold text-[#1a1a1a] tracking-tight">
              Specialized Cleaning Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Left Card */}
            <div className="md:col-span-2 relative h-[380px] rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm">
              <Image src="/images/service/pre cleaning service-21.png" alt="Deep Home Cleaning" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-white text-[1.6rem] font-bold mb-2 tracking-tight">Deep Home Cleaning</h3>
                <p className="text-[#e2e8f0] text-[0.95rem] leading-relaxed mb-5 max-w-[500px]">
                  Complete ceiling-to-floor sanitization including windows, switches, and hard-to-reach corners.
                </p>
                <div className="flex items-center text-[#ffcccc] font-medium hover:text-white transition-colors text-[0.95rem]">
                  From ৳4,500
                  <svg className="ml-1.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>

            {/* Top Right Card */}
            <div className="md:col-span-1 relative h-[380px] rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm">
              <Image src="/images/service/pre cleaning service-23.png" alt="Sofa & Carpet" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-white text-[1.6rem] font-bold mb-2 tracking-tight">Sofa & Carpet</h3>
                <p className="text-[#e2e8f0] text-[0.95rem] leading-relaxed mb-5">
                  Revitalize your upholstery with dry and wet shampooing techniques.
                </p>
                <div className="flex items-center text-[#ffcccc] font-medium hover:text-white transition-colors text-[0.95rem]">
                  From ৳1,200
                  <svg className="ml-1.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>

            {/* Bottom Card */}
            <div className="md:col-span-3 relative h-[280px] rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm">
              <Image src="/images/service/pre cleaning service-24.png" alt="Kitchen Degreasing" fill className="object-cover object-[center_60%] transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center max-w-[700px]">
                <h3 className="text-white text-[1.6rem] font-bold mb-2 tracking-tight">Kitchen Degreasing</h3>
                <p className="text-[#e2e8f0] text-[0.95rem] leading-relaxed mb-5">
                  Intensive removal of oil, soot, and grime from cabinets, chimneys, and stovetops using eco-friendly degreasers.
                </p>
                <div className="flex items-center text-[#ffcccc] font-medium hover:text-white transition-colors text-[0.95rem]">
                  From ৳2,800
                  <svg className="ml-1.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Package Pricing Section */}
      <section className="py-24 px-6 bg-[#fff5f5]">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-[2.3rem] font-bold text-[#1a1a1a] tracking-tight">
            Transparent Package Pricing
          </h2>
          <p className="text-[#6b7280] text-[1.1rem] mt-3 mb-16">
            Choose the plan that fits your space and cleaning needs.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-[1050px] mx-auto">
            {/* Essential Card */}
            <div className="bg-white rounded-3xl p-10 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-transparent">
              <span className="text-[#d93838] text-[1rem] font-medium block mb-2">Essential</span>
              <h3 className="text-[3.5rem] font-bold text-[#1a1a1a] tracking-tight mb-8">৳2,499</h3>

              <ul className="space-y-5 mb-10 min-h-[180px]">
                <li className="flex items-center gap-3">
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d93838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 10 16 8 14"></polyline></svg>
                  <span className="text-[#4b5563] text-[1rem]">Standard Room Cleaning</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d93838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 10 16 8 14"></polyline></svg>
                  <span className="text-[#4b5563] text-[1rem]">Bathroom Sanitization</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d93838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 10 16 8 14"></polyline></svg>
                  <span className="text-[#4b5563] text-[1rem]">Floor Mopping & Dusting</span>
                </li>
              </ul>

              <button className="w-full py-4 bg-transparent hover:bg-[#fff0ef] text-[#d93838] border border-[#fce4e4] rounded-2xl text-[1.05rem] font-semibold transition-colors shadow-sm">
                Select Basic
              </button>
            </div>

            {/* Full Deep Clean Card */}
            <div className="bg-white rounded-3xl p-10 text-left shadow-[0_12px_40px_rgba(217,56,56,0.12)] border-[2.5px] border-[#d93838] relative lg:scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d93838] text-white text-[0.75rem] font-bold uppercase tracking-wider py-1.5 px-5 rounded-full shadow-md">
                Most Popular
              </div>
              <span className="text-[#d93838] text-[1rem] font-medium block mb-2 mt-2">Full Deep Clean</span>
              <h3 className="text-[3.5rem] font-bold text-[#1a1a1a] tracking-tight mb-8">৳4,999</h3>

              <ul className="space-y-5 mb-10 min-h-[180px]">
                <li className="flex items-center gap-3">
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d93838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 10 16 8 14"></polyline></svg>
                  <span className="text-[#4b5563] text-[1rem]">Everything in Essential</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d93838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 10 16 8 14"></polyline></svg>
                  <span className="text-[#4b5563] text-[1rem]">Kitchen Deep Scrubbing</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d93838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 10 16 8 14"></polyline></svg>
                  <span className="text-[#4b5563] text-[1rem]">Window & Balcony Cleaning</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d93838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 10 16 8 14"></polyline></svg>
                  <span className="text-[#4b5563] text-[1rem]">Cupboard Internal Cleaning</span>
                </li>
              </ul>

              <button className="w-full py-4 bg-[#c92a2a] hover:bg-[#a62323] text-white rounded-2xl text-[1.05rem] font-semibold transition-colors shadow-lg">
                Select Premium
              </button>
            </div>

            {/* The Royal Suite Card */}
            <div className="bg-white rounded-3xl p-10 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-transparent">
              <span className="text-[#d93838] text-[1rem] font-medium block mb-2">The Royal Suite</span>
              <h3 className="text-[3.5rem] font-bold text-[#1a1a1a] tracking-tight mb-8">৳8,999</h3>

              <ul className="space-y-5 mb-10 min-h-[180px]">
                <li className="flex items-center gap-3">
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d93838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 10 16 8 14"></polyline></svg>
                  <span className="text-[#4b5563] text-[1rem]">Full Deep Clean Package</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d93838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 10 16 8 14"></polyline></svg>
                  <span className="text-[#4b5563] text-[1rem]">Sofa & Carpet Shampooing</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d93838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 10 16 8 14"></polyline></svg>
                  <span className="text-[#4b5563] text-[1rem]">Mattress Steam Sanitizing</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d93838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 10 16 8 14"></polyline></svg>
                  <span className="text-[#4b5563] text-[1rem]">Full House Pest Control</span>
                </li>
              </ul>

              <button className="w-full py-4 bg-transparent hover:bg-[#fff0ef] text-[#d93838] border border-[#fce4e4] rounded-2xl text-[1.05rem] font-semibold transition-colors shadow-sm">
                Select Royal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Certified Specialists */}
      <section className="py-20 px-6 bg-[#fafafa]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-[2.3rem] font-bold text-[#1a1a1a] tracking-tight mb-2">Our Certified Specialists</h2>
              <p className="text-[#6b7280] text-[1rem]">Background-verified experts with 500+ hours of training.</p>
            </div>
            <Link href="/professionals" className="text-[#d93838] font-medium flex items-center gap-2 hover:underline">
              View All Professionals <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Specialist 1 */}
            <div className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-1">
              <div className="relative h-[240px] rounded-[1rem] overflow-hidden mb-5 bg-[#f3f4f6]">
                <Image src="/images/service/pre cleaning service-25.png" alt="Ayesha Siddiqua" fill className="object-cover object-top" />
                <div className="absolute bottom-3 left-3 bg-white px-2.5 py-1 rounded-md text-[0.8rem] font-bold flex items-center gap-1 shadow-sm">
                  <span className="text-[#f59e0b]">★</span> 4.9
                </div>
              </div>
              <div className="px-1">
                <h4 className="text-[1.15rem] font-bold text-[#1a1a1a] mb-0.5">Ayesha Siddiqua</h4>
                <p className="text-[#6b7280] text-[0.85rem] mb-5">Expert in Deep Cleaning</p>
                
                <div className="border-t border-[#f3f4f6] pt-4 flex items-center justify-between">
                  <span className="text-[0.85rem] font-semibold text-[#4b5563]">1,240 Jobs Done</span>
                  <button className="w-8 h-8 rounded-full bg-[#fff0ef] text-[#d93838] flex items-center justify-center hover:bg-[#fce4e4] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Specialist 2 */}
            <div className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-1">
              <div className="relative h-[240px] rounded-[1rem] overflow-hidden mb-5 bg-[#f3f4f6]">
                <Image src="/images/service/pre cleaning service-26.png" alt="Kamal Hossain" fill className="object-cover object-top" />
                <div className="absolute bottom-3 left-3 bg-white px-2.5 py-1 rounded-md text-[0.8rem] font-bold flex items-center gap-1 shadow-sm">
                  <span className="text-[#f59e0b]">★</span> 4.8
                </div>
              </div>
              <div className="px-1">
                <h4 className="text-[1.15rem] font-bold text-[#1a1a1a] mb-0.5">Kamal Hossain</h4>
                <p className="text-[#6b7280] text-[0.85rem] mb-5">Upholstery Specialist</p>
                
                <div className="border-t border-[#f3f4f6] pt-4 flex items-center justify-between">
                  <span className="text-[0.85rem] font-semibold text-[#4b5563]">890 Jobs Done</span>
                  <button className="w-8 h-8 rounded-full bg-[#fff0ef] text-[#d93838] flex items-center justify-center hover:bg-[#fce4e4] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Specialist 3 */}
            <div className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-1">
              <div className="relative h-[240px] rounded-[1rem] overflow-hidden mb-5 bg-[#f3f4f6]">
                <Image src="/images/service/pre cleaning service-27.png" alt="Rahat Ahmed" fill className="object-cover object-top" />
                <div className="absolute bottom-3 left-3 bg-white px-2.5 py-1 rounded-md text-[0.8rem] font-bold flex items-center gap-1 shadow-sm">
                  <span className="text-[#f59e0b]">★</span> 5.0
                </div>
              </div>
              <div className="px-1">
                <h4 className="text-[1.15rem] font-bold text-[#1a1a1a] mb-0.5">Rahat Ahmed</h4>
                <p className="text-[#6b7280] text-[0.85rem] mb-5">Kitchen Specialist</p>
                
                <div className="border-t border-[#f3f4f6] pt-4 flex items-center justify-between">
                  <span className="text-[0.85rem] font-semibold text-[#4b5563]">1,500 Jobs Done</span>
                  <button className="w-8 h-8 rounded-full bg-[#fff0ef] text-[#d93838] flex items-center justify-center hover:bg-[#fce4e4] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Specialist 4 */}
            <div className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-1">
              <div className="relative h-[240px] rounded-[1rem] overflow-hidden mb-5 bg-[#f3f4f6]">
                <Image src="/images/service/pre cleaning service-28.png" alt="Nusrat Jahan" fill className="object-cover object-top" />
                <div className="absolute bottom-3 left-3 bg-white px-2.5 py-1 rounded-md text-[0.8rem] font-bold flex items-center gap-1 shadow-sm">
                  <span className="text-[#f59e0b]">★</span> 4.9
                </div>
              </div>
              <div className="px-1">
                <h4 className="text-[1.15rem] font-bold text-[#1a1a1a] mb-0.5">Nusrat Jahan</h4>
                <p className="text-[#6b7280] text-[0.85rem] mb-5">Full House Expert</p>
                
                <div className="border-t border-[#f3f4f6] pt-4 flex items-center justify-between">
                  <span className="text-[0.85rem] font-semibold text-[#4b5563]">720 Jobs Done</span>
                  <button className="w-8 h-8 rounded-full bg-[#fff0ef] text-[#d93838] flex items-center justify-center hover:bg-[#fce4e4] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <div className="px-6 pb-10">
        <section className="py-20 px-6 bg-[#b92b2b] rounded-[3rem] mt-10 max-w-[1300px] mx-auto shadow-[0_10px_40px_rgba(185,43,43,0.2)]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Safety First */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
              </div>
              <h3 className="text-white text-[1.5rem] font-bold mb-4">Safety First</h3>
              <p className="text-white/90 text-[1rem] leading-relaxed max-w-[300px]">
                Every professional is background checked and verified for your peace of mind.
              </p>
            </div>

            {/* Eco-Friendly */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 22l10-10"></path></svg>
              </div>
              <h3 className="text-white text-[1.5rem] font-bold mb-4">Eco-Friendly</h3>
              <p className="text-white/90 text-[1rem] leading-relaxed max-w-[320px]">
                We use non-toxic, pet-safe, and biodegradable cleaning agents in all packages.
              </p>
            </div>

            {/* 100% Satisfaction */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
              </div>
              <h3 className="text-white text-[1.5rem] font-bold mb-4">100% Satisfaction</h3>
              <p className="text-white/90 text-[1rem] leading-relaxed max-w-[300px]">
                Not happy? We'll re-clean the area within 24 hours at no extra cost.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
