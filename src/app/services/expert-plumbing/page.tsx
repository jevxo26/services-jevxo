"use client";

import Image from "next/image";

export default function ExpertPlumbingPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-8">
        <section className="relative w-full h-[450px] rounded-[2.5rem] overflow-hidden shadow-sm flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/service/plumbing service-1.png"
              alt="Premium Plumbing Solutions"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
            {/* Dark gradient overlay on the left for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </div>

          <div className="relative z-10 w-full px-10 md:px-16">
            <div className="max-w-[650px]">
              <span className="inline-block bg-[#ff5a5f] text-white text-[0.85rem] font-semibold px-4 py-1.5 rounded-full mb-6">
                24/7 Priority Support
              </span>
              <h1 className="text-white text-[3.5rem] font-bold leading-[1.1] mb-5 tracking-tight">
                Premium Plumbing<br />Solutions.
              </h1>
              <p className="text-white/90 text-[1.1rem] leading-relaxed mb-10 max-w-[550px] font-medium">
                Expert assistance for leak repair, pipe installation, and all your plumbing needs. Professional service guaranteed.
              </p>
              
              {/* Search Bar */}
              <div className="relative bg-white/95 backdrop-blur-sm rounded-full p-2 flex items-center shadow-lg max-w-[500px]">
                <div className="pl-4 pr-2 text-[#d93838]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Search specific plumbing task..." 
                  className="flex-1 bg-transparent border-none text-[#1a1a1a] text-[0.95rem] font-medium placeholder:text-[#9ca3af] focus:outline-none px-2"
                />
                <button className="bg-[#b92b2b] hover:bg-[#a02222] text-white px-6 py-3 rounded-full text-[0.95rem] font-bold transition-colors shadow-sm">
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Services Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-[2rem] font-bold text-[#1a1a1a] tracking-tight mb-2">Our Specialized Services</h2>
            <p className="text-[#6b7280] text-[1.05rem]">Transparent pricing and expert craftsmanship.</p>
          </div>
          <button className="flex items-center gap-2 text-[#d93838] font-bold text-[0.95rem] hover:text-[#b92b2b] transition-colors group">
            View All Services
            <svg className="transition-transform group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Card: Leak Repair */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col md:flex-row gap-10 items-center group cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-2xl bg-[#fff0ef] text-[#d93838] flex items-center justify-center mb-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
              </div>
              <h3 className="text-[1.6rem] font-bold text-[#1a1a1a] mb-4">Leak Repair & Detection</h3>
              <p className="text-[#6b7280] text-[1.05rem] leading-relaxed mb-8 max-w-[450px]">
                Non-invasive ultrasonic leak detection for hidden pipes. We fix everything from dripping faucets to underground line bursts.
              </p>
              <div className="flex items-center gap-5">
                <div className="flex items-end text-[#d93838] font-bold">
                  <span className="text-[1.2rem] mr-0.5 mb-0.5">৳</span>
                  <span className="text-[2.2rem] leading-none tracking-tight">800</span>
                  <span className="text-[0.95rem] text-[#6b7280] font-medium ml-1.5 mb-1">/ hr</span>
                </div>
                <button className="px-6 py-3 bg-[#fce4e4] hover:bg-[#fad4d4] text-[#d93838] rounded-xl text-[0.95rem] font-bold transition-colors">
                  Book Now
                </button>
              </div>
            </div>
            <div className="w-full md:w-[320px] h-[300px] relative rounded-[1.5rem] overflow-hidden shrink-0 shadow-sm border border-[#f3f4f6]">
              <Image src="/images/service/plumbing Leak Repair.png" alt="Leak Repair" fill style={{ objectFit: "cover" }} className="transition-transform duration-500 group-hover:scale-105" />
            </div>
          </div>

          {/* Smaller Card: Pipe Installation */}
          <div className="bg-white rounded-[2rem] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col group cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
            <div className="w-full h-[200px] relative rounded-[1.2rem] overflow-hidden mb-6 shadow-sm border border-[#f3f4f6]">
              <Image src="/images/service/plumbing Pipe Installation.png" alt="Pipe Installation" fill style={{ objectFit: "cover" }} className="transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="text-[1.4rem] font-bold text-[#1a1a1a] mb-3">Pipe Installation</h3>
            <p className="text-[#6b7280] text-[1rem] leading-relaxed mb-8">
              Complete PVC & PPR piping for new constructions or renovations.
            </p>
            <div className="flex items-center justify-between mt-auto pt-5 border-t border-[#f3f4f6]">
              <div className="flex items-center gap-1.5 text-[#d93838] font-bold">
                <span className="text-[0.75rem] text-[#9ca3af] font-bold uppercase tracking-wider mt-1">From</span>
                <span className="text-[1rem] ml-1">৳</span>
                <span className="text-[1.4rem]">1,500</span>
              </div>
              <button className="w-9 h-9 rounded-full border-2 border-[#e5e7eb] flex items-center justify-center text-[#9ca3af] group-hover:bg-[#d93838] group-hover:border-[#d93838] group-hover:text-white transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
          </div>

          {/* Smaller Card: Sanitary Fitting */}
          <div className="bg-white rounded-[2rem] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col group cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
            <div className="w-full h-[200px] relative rounded-[1.2rem] overflow-hidden mb-6 shadow-sm border border-[#f3f4f6]">
              <Image src="/images/service/plumbing Sanitary Fitting.png" alt="Sanitary Fitting" fill style={{ objectFit: "cover" }} className="transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="text-[1.4rem] font-bold text-[#1a1a1a] mb-3">Sanitary Fitting</h3>
            <p className="text-[#6b7280] text-[1rem] leading-relaxed mb-8">
              Premium installation of commodes, basins, and luxury shower systems.
            </p>
            <div className="flex items-center justify-between mt-auto pt-5 border-t border-[#f3f4f6]">
              <div className="flex items-center gap-1.5 text-[#d93838] font-bold">
                <span className="text-[0.75rem] text-[#9ca3af] font-bold uppercase tracking-wider mt-1">From</span>
                <span className="text-[1rem] ml-1">৳</span>
                <span className="text-[1.4rem]">1,200</span>
              </div>
              <button className="w-9 h-9 rounded-full border-2 border-[#e5e7eb] flex items-center justify-center text-[#9ca3af] group-hover:bg-[#d93838] group-hover:border-[#d93838] group-hover:text-white transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
          </div>

          {/* Emergency Banner */}
          <div className="lg:col-span-2 bg-[#251818] rounded-[2rem] p-8 lg:p-12 shadow-[0_8px_30px_rgba(42,27,27,0.3)] flex flex-col sm:flex-row justify-between items-center group relative overflow-hidden h-full">
            {/* Red Glow Overlay */}
            <div className="absolute top-[-40%] right-[-10%] w-[500px] h-[500px] bg-[#ff5a5f] rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-[400px]">
              <h3 className="text-[2.2rem] font-bold text-white mb-3 tracking-tight">Plumbing Emergency?</h3>
              <p className="text-white/80 text-[1.05rem] leading-relaxed mb-8">
                Our rapid response team is available 24/7 for burst pipes, flooding, or severe blockages. Arrival in under 60 minutes.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-[#ff5a5f] hover:bg-[#e0484d] text-white rounded-full text-[0.95rem] font-bold transition-colors shadow-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  Call Hotline
                </button>
                <button className="px-6 py-3 bg-transparent hover:bg-white/10 text-white border border-white/30 rounded-full text-[0.95rem] font-bold transition-colors">
                  Chat Now
                </button>
              </div>
            </div>
            <div className="relative z-10 flex flex-col items-center mt-8 sm:mt-0">
              <span className="text-[#ff5a5f] text-[5rem] font-bold leading-none tracking-tighter">60</span>
              <span className="text-white/60 text-[0.8rem] uppercase tracking-widest font-bold">Minute Arrival</span>
            </div>
          </div>
        </div>

        {/* Top Rated Plumbers */}
        <div className="mt-20">
          <h2 className="text-[2rem] font-bold text-[#1a1a1a] tracking-tight mb-8">Top Rated Plumbers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Plumber 1 */}
            <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6]">
              <div className="w-full h-[240px] relative rounded-[1.5rem] overflow-hidden mb-5 bg-[#f8fafc]">
                <Image src="/images/service/plumbing Pro 1.png" alt="Arif Ahmed" fill style={{ objectFit: "cover", objectPosition: "top" }} />
                <div className="absolute bottom-3 left-3 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                  <span className="text-[#f59e0b] text-[0.9rem]">★</span>
                  <span className="text-[0.85rem] font-bold text-[#1a1a1a]">4.9</span>
                </div>
              </div>
              <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-1">Arif Ahmed</h3>
              <p className="text-[0.85rem] text-[#6b7280] mb-3">Master Plumber • 12 years exp.</p>
              <div className="flex items-center gap-1.5 text-[#10b981] mb-5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                <span className="text-[0.75rem] font-bold">Background Verified</span>
              </div>
              <div className="flex items-end justify-between pt-4 border-t border-[#f3f4f6]">
                <div className="flex items-end text-[#d93838] font-bold">
                  <span className="text-[0.9rem] mr-0.5 mb-0.5">৳</span>
                  <span className="text-[1.3rem] leading-none">900</span>
                  <span className="text-[0.75rem] text-[#6b7280] font-normal ml-1 mb-0.5">/hr</span>
                </div>
                <button className="text-[#d93838] text-[0.85rem] font-bold hover:underline">Profile</button>
              </div>
            </div>
            
            {/* Plumber 2 */}
            <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6]">
              <div className="w-full h-[240px] relative rounded-[1.5rem] overflow-hidden mb-5 bg-[#f8fafc]">
                <Image src="/images/service/plumbing  Pro 2.png" alt="Kamrul Islam" fill style={{ objectFit: "cover", objectPosition: "top" }} />
                <div className="absolute bottom-3 left-3 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                  <span className="text-[#f59e0b] text-[0.9rem]">★</span>
                  <span className="text-[0.85rem] font-bold text-[#1a1a1a]">4.8</span>
                </div>
              </div>
              <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-1">Kamrul Islam</h3>
              <p className="text-[0.85rem] text-[#6b7280] mb-3">Sanitary Specialist • 8 years exp.</p>
              <div className="flex items-center gap-1.5 text-[#10b981] mb-5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                <span className="text-[0.75rem] font-bold">Background Verified</span>
              </div>
              <div className="flex items-end justify-between pt-4 border-t border-[#f3f4f6]">
                <div className="flex items-end text-[#d93838] font-bold">
                  <span className="text-[0.9rem] mr-0.5 mb-0.5">৳</span>
                  <span className="text-[1.3rem] leading-none">750</span>
                  <span className="text-[0.75rem] text-[#6b7280] font-normal ml-1 mb-0.5">/hr</span>
                </div>
                <button className="text-[#d93838] text-[0.85rem] font-bold hover:underline">Profile</button>
              </div>
            </div>

            {/* Plumber 3 */}
            <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6]">
              <div className="w-full h-[240px] relative rounded-[1.5rem] overflow-hidden mb-5 bg-[#f8fafc]">
                <Image src="/images/service/plumbing  Pro 3.png" alt="Sajib Hossain" fill style={{ objectFit: "cover", objectPosition: "top" }} />
                <div className="absolute bottom-3 left-3 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                  <span className="text-[#f59e0b] text-[0.9rem]">★</span>
                  <span className="text-[0.85rem] font-bold text-[#1a1a1a]">5.0</span>
                </div>
              </div>
              <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-1">Sajib Hossain</h3>
              <p className="text-[0.85rem] text-[#6b7280] mb-3">Pipe Expert • 15 years exp.</p>
              <div className="flex items-center gap-1.5 text-[#10b981] mb-5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                <span className="text-[0.75rem] font-bold">Background Verified</span>
              </div>
              <div className="flex items-end justify-between pt-4 border-t border-[#f3f4f6]">
                <div className="flex items-end text-[#d93838] font-bold">
                  <span className="text-[0.9rem] mr-0.5 mb-0.5">৳</span>
                  <span className="text-[1.3rem] leading-none">1,000</span>
                  <span className="text-[0.75rem] text-[#6b7280] font-normal ml-1 mb-0.5">/hr</span>
                </div>
                <button className="text-[#d93838] text-[0.85rem] font-bold hover:underline">Profile</button>
              </div>
            </div>

            {/* Plumber 4 */}
            <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6]">
              <div className="w-full h-[240px] relative rounded-[1.5rem] overflow-hidden mb-5 bg-[#f8fafc]">
                <Image src="/images/service/plumbing  Pro 4.png" alt="Mehedi Hasan" fill style={{ objectFit: "cover", objectPosition: "top" }} />
                <div className="absolute bottom-3 left-3 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                  <span className="text-[#f59e0b] text-[0.9rem]">★</span>
                  <span className="text-[0.85rem] font-bold text-[#1a1a1a]">4.7</span>
                </div>
              </div>
              <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-1">Mehedi Hasan</h3>
              <p className="text-[0.85rem] text-[#6b7280] mb-3">Fixture Installer • 5 years exp.</p>
              <div className="flex items-center gap-1.5 text-[#10b981] mb-5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                <span className="text-[0.75rem] font-bold">Background Verified</span>
              </div>
              <div className="flex items-end justify-between pt-4 border-t border-[#f3f4f6]">
                <div className="flex items-end text-[#d93838] font-bold">
                  <span className="text-[0.9rem] mr-0.5 mb-0.5">৳</span>
                  <span className="text-[1.3rem] leading-none">600</span>
                  <span className="text-[0.75rem] text-[#6b7280] font-normal ml-1 mb-0.5">/hr</span>
                </div>
                <button className="text-[#d93838] text-[0.85rem] font-bold hover:underline">Profile</button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="mt-16 py-10 px-8 border border-[#bfdbfe] border-dashed rounded-[2.5rem] bg-white shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              {/* Feature 1 */}
              <div className="flex flex-col items-center">
                 <div className="w-14 h-14 rounded-full bg-[#fff0ef] text-[#d93838] flex items-center justify-center mb-5 shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                 </div>
                 <h4 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-2">Service Warranty</h4>
                 <p className="text-[#6b7280] text-[0.95rem] leading-relaxed max-w-[250px]">Enjoy peace of mind with our 7-day post-service warranty on all repairs.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="flex flex-col items-center">
                 <div className="w-14 h-14 rounded-full bg-[#fff0ef] text-[#d93838] flex items-center justify-center mb-5 shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
                 </div>
                 <h4 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-2">Safety First</h4>
                 <p className="text-[#6b7280] text-[0.95rem] leading-relaxed max-w-[250px]">All our plumbers go through rigorous background checks and training.</p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center">
                 <div className="w-14 h-14 rounded-full bg-[#fff0ef] text-[#d93838] flex items-center justify-center mb-5 shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                 </div>
                 <h4 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-2">Fair Pricing</h4>
                 <p className="text-[#6b7280] text-[0.95rem] leading-relaxed max-w-[250px]">No hidden costs. Pay through our secure platform after job completion.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
