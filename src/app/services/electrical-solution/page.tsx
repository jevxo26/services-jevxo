"use client";

import Image from "next/image";

export default function ElectricalSolutionPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-16 lg:pt-24 pb-12 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 w-full max-w-[600px]">
          <div className="inline-flex items-center gap-2 bg-[#ffeaeb] text-[#b92b2b] px-4 py-1.5 rounded-full text-[0.85rem] font-bold mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            Urgent Repairs Available 24/7
          </div>
          
          <h1 className="text-[3.5rem] lg:text-[4rem] font-bold text-[#1a1a1a] leading-[1.1] mb-6 tracking-tight">
            Certified Electrical <br />
            <span className="text-[#b92b2b]">Experts in Dhaka</span>
          </h1>
          
          <p className="text-[#6b7280] text-[1.1rem] leading-relaxed mb-10 max-w-[500px]">
            From flickering lights to full-house wiring, our certified technicians ensure your home's safety with premium electrical solutions.
          </p>
          
          <div className="flex flex-wrap items-center gap-5">
            <button className="bg-[#ff5a5f] hover:bg-[#e0484d] text-white px-8 py-4 rounded-full text-[1rem] font-bold transition-colors shadow-lg shadow-[#ff5a5f]/30 flex items-center gap-2">
              Book Urgent Repair
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <button className="bg-white hover:bg-gray-50 text-[#1a1a1a] px-8 py-4 rounded-full text-[1rem] font-bold transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-[#f3f4f6]">
              View Rate Card
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 w-full relative pl-2 pb-2 lg:pl-6 lg:pb-6">
          <div className="relative w-full h-[400px] lg:h-[500px] bg-white/60 backdrop-blur-sm rounded-[3rem] p-3 lg:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
            <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden">
              <Image src="/images/service/Electrician working service-3.png" alt="Electrician working on panel" fill priority className="object-cover object-center" />
            </div>
          </div>
          
          {/* Floating Badge */}
          <div className="absolute -bottom-2 -left-2 lg:bottom-12 lg:-left-4 bg-white/95 backdrop-blur-xl rounded-[1.8rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-4 border border-white/80">
            <div className="w-12 h-12 rounded-full bg-[#ffeaeb] text-[#ff5a5f] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </div>
            <div className="pr-2">
              <p className="text-[#1a1a1a] font-bold text-[0.95rem] leading-tight mb-0.5">ISO Certified</p>
              <p className="text-[#6b7280] text-[0.85rem] font-medium">Safety Standard 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-20">
        <div className="mb-10">
          <h2 className="text-[2rem] font-bold text-[#1a1a1a] tracking-tight mb-2">Our Specialized Services</h2>
          <p className="text-[#6b7280] text-[1.05rem]">Transparent pricing. Guaranteed workmanship.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#fff0ef] text-[#b92b2b] flex items-center justify-center mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 0 2.22 1.5 3.5.76.76 1.23 1.52 1.41 2.5"></path></svg>
            </div>
            <h3 className="text-[1.4rem] font-bold text-[#1a1a1a] mb-4">Fan/Light Repair</h3>
            <p className="text-[#6b7280] text-[1rem] leading-relaxed mb-8 flex-1">
              Quick fixes for ceiling fans, dimmers, LED panels, and chandelier installations.
            </p>
            <div className="pt-6 border-t border-[#f3f4f6]">
              <p className="text-[#b92b2b] font-bold text-[0.95rem] flex items-center">
                Starts at <span className="text-[1.1rem] ml-1">৳ 250</span>
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#fff0ef] text-[#b92b2b] flex items-center justify-center mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            </div>
            <h3 className="text-[1.4rem] font-bold text-[#1a1a1a] mb-4">Circuit Breaker Fix</h3>
            <p className="text-[#6b7280] text-[1rem] leading-relaxed mb-8 flex-1">
              Troubleshooting tripping breakers, fuse replacements, and short-circuit diagnosis.
            </p>
            <div className="pt-6 border-t border-[#f3f4f6]">
              <p className="text-[#b92b2b] font-bold text-[0.95rem] flex items-center">
                Starts at <span className="text-[1.1rem] ml-1">৳ 450</span>
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#fff0ef] text-[#b92b2b] flex items-center justify-center mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 4v16M12 4v16M17 4v16" />
                <path d="M5 10h4M10 14h4M15 10h4" />
              </svg>
            </div>
            <h3 className="text-[1.4rem] font-bold text-[#1a1a1a] mb-4">Full House Wiring</h3>
            <p className="text-[#6b7280] text-[1rem] leading-relaxed mb-8 flex-1">
              Comprehensive wiring for new homes or safe rewiring of older properties with premium materials.
            </p>
            <div className="pt-6 border-t border-[#f3f4f6]">
              <p className="text-[#b92b2b] font-bold text-[0.95rem]">
                Free Inspection
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="mt-16 bg-[#211515] rounded-[2.5rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="absolute top-1/2 -right-[10%] w-[500px] h-[500px] bg-[#ff5a5f] rounded-full mix-blend-screen filter blur-[120px] opacity-20 transform -translate-y-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-[500px]">
            <h3 className="text-[2.2rem] font-bold text-white mb-4 tracking-tight">Electrical Emergency?</h3>
            <p className="text-white/80 text-[1.05rem] leading-relaxed mb-8">
              Smoke from an outlet? Total power loss? Our rapid response team arrives in 60 minutes or less, anywhere in the metropolitan area.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <button className="flex items-center gap-3 px-8 py-4 bg-[#ff5a5f] hover:bg-[#e0484d] text-white rounded-full text-[1rem] font-bold transition-colors shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Call 16500
              </button>
              <div className="flex flex-col">
                <span className="text-white/60 text-[0.75rem] font-medium uppercase tracking-wider">Response Time</span>
                <span className="text-white font-bold text-[1.1rem]">~45 Minutes</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 hidden md:flex items-center justify-center">
            <div className="w-[280px] h-[280px] rounded-full border-[15px] border-[#3a2525] flex items-center justify-center relative shadow-inner">
              <div className="w-[220px] h-[220px] rounded-full border-[10px] border-[#2e1d1d] flex items-center justify-center">
                 <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ff5a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M12 2v4"></path>
                   <path d="M5.5 5.5l2.5 2.5"></path>
                   <path d="M18.5 5.5l-2.5 2.5"></path>
                   <path d="M2 12h4"></path>
                   <path d="M18 12h4"></path>
                   <path d="M6 22L8 10h8l2 12z"></path>
                   <path d="M4 22h16"></path>
                 </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rated Experts */}
        <div className="mt-24 mb-16">
          <h2 className="text-[2.2rem] font-bold text-[#1a1a1a] tracking-tight mb-10 text-center">Meet Our Top Rated Experts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Expert 1 */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col items-center text-center group">
              <div className="relative w-[120px] h-[120px] mb-4">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#f8fafc]">
                  <Image src="/images/service/Electrician Ariful.png" alt="Ariful Islam" fill className="object-cover object-top" />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#10b981] rounded-full border-4 border-white flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-1">Ariful Islam</h3>
              <p className="text-[0.85rem] text-[#6b7280] mb-3">Senior Technician (8yr Exp)</p>
              <div className="flex items-center gap-1.5 text-[#1a1a1a] font-bold text-[0.95rem]">
                <span className="text-[#b92b2b]">★</span> 4.9 <span className="text-[#6b7280] font-normal text-[0.85rem] ml-0.5">(420+ jobs)</span>
              </div>
            </div>

            {/* Expert 2 */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col items-center text-center group">
              <div className="relative w-[120px] h-[120px] mb-4">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#f8fafc]">
                  <Image src="/images/service/Electrician Tanvir.png" alt="Tanvir Ahmed" fill className="object-cover object-top" />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#10b981] rounded-full border-4 border-white flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-1">Tanvir Ahmed</h3>
              <p className="text-[0.85rem] text-[#6b7280] mb-3">Wiring Specialist</p>
              <div className="flex items-center gap-1.5 text-[#1a1a1a] font-bold text-[0.95rem]">
                <span className="text-[#b92b2b]">★</span> 4.8 <span className="text-[#6b7280] font-normal text-[0.85rem] ml-0.5">(215+ jobs)</span>
              </div>
            </div>

            {/* Expert 3 */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col items-center text-center group">
              <div className="relative w-[120px] h-[120px] mb-4">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#f8fafc]">
                  <Image src="/images/service/Electrician Zahid.png" alt="Md. Zahid" fill className="object-cover object-top" />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#10b981] rounded-full border-4 border-white flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-1">Md. Zahid</h3>
              <p className="text-[0.85rem] text-[#6b7280] mb-3">Master Electrician</p>
              <div className="flex items-center gap-1.5 text-[#1a1a1a] font-bold text-[0.95rem]">
                <span className="text-[#b92b2b]">★</span> 5.0 <span className="text-[#6b7280] font-normal text-[0.85rem] ml-0.5">(580+ jobs)</span>
              </div>
            </div>

            {/* Expert 4 */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col items-center text-center group">
              <div className="relative w-[120px] h-[120px] mb-4">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#f8fafc]">
                  <Image src="/images/service/Electrician Salman.png" alt="Salman Khan" fill className="object-cover object-top" />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#10b981] rounded-full border-4 border-white flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-1">Salman Khan</h3>
              <p className="text-[0.85rem] text-[#6b7280] mb-3">Installation Pro</p>
              <div className="flex items-center gap-1.5 text-[#1a1a1a] font-bold text-[0.95rem]">
                <span className="text-[#b92b2b]">★</span> 4.7 <span className="text-[#6b7280] font-normal text-[0.85rem] ml-0.5">(180+ jobs)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Section */}
      <div className="max-w-[1300px] mx-auto px-6 pb-20">
        <div className="w-full bg-[#ffecec] rounded-[3rem] py-16 px-8">
          <h2 className="text-[2.2rem] font-bold text-[#1a1a1a] tracking-tight mb-12 text-center">Committed to Zero-Risk Safety</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,90,95,0.15)] mb-5 text-[#ff5a5f]">
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
              </div>
              <h4 className="font-bold text-[#1a1a1a] text-[1.05rem]">Insured Work</h4>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,90,95,0.15)] mb-5 text-[#ff5a5f]">
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
              </div>
              <h4 className="font-bold text-[#1a1a1a] text-[1.05rem]">PPE Mandatory</h4>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,90,95,0.15)] mb-5 text-[#ff5a5f]">
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              </div>
              <h4 className="font-bold text-[#1a1a1a] text-[1.05rem]">License Verified</h4>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,90,95,0.15)] mb-5 text-[#ff5a5f]">
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 13l-6.5 6.5a2.12 2.12 0 1 1-3-3L11 10"></path><path d="M15 12l2.5-2.5a2.12 2.12 0 1 1 3 3L18 15"></path><path d="M15 12l-3-3"></path><path d="M18 15l-3-3"></path></svg>
              </div>
              <h4 className="font-bold text-[#1a1a1a] text-[1.05rem]">Code Compliant</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
