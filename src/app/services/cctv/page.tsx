"use client";

import Image from "next/image";

export default function CCTVServicePage() {
  return (
    <div className="bg-[#fafafa] min-h-screen pb-0">
      {/* How Rajseba Works */}
      <div className="w-full pt-16 pb-12">
        <div className="max-w-[1300px] mx-auto px-6 text-center">
          <h2 className="text-[2.5rem] font-bold text-[#1a1a1a] mb-4 tracking-tight">How Rajseba Works</h2>
          <p className="text-[#6b7280] text-[1.1rem] max-w-[600px] mx-auto mb-16 leading-relaxed">
            Booking a repair is as easy as ordering food. Follow our simple 3-step process to get your home back in order.
          </p>

          <div className="relative flex flex-col md:flex-row justify-between items-start lg:px-12">
            {/* Dashed line connecting steps */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[2px] border-b-2 border-dashed border-[#b92b2b]/30 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center flex-1 mb-12 md:mb-0 px-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.8),0_10px_30px_rgba(185,43,43,0.1)] flex items-center justify-center mb-6">
                <span className="text-[#b92b2b] text-[1.6rem] font-bold">1</span>
              </div>
              <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] mb-2">Book Online</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                Select your service, choose a time slot, and describe the issue.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center flex-1 mb-12 md:mb-0 px-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.8),0_10px_30px_rgba(185,43,43,0.1)] flex items-center justify-center mb-6">
                <span className="text-[#b92b2b] text-[1.6rem] font-bold">2</span>
              </div>
              <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] mb-2">Expert Visit</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                A verified pro arrives at your door for a thorough diagnostic check.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center flex-1 px-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.8),0_10px_30px_rgba(185,43,43,0.1)] flex items-center justify-center mb-6">
                <span className="text-[#b92b2b] text-[1.6rem] font-bold">3</span>
              </div>
              <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] mb-2">Quick Repair</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                On-the-spot repair with genuine parts and a 90-day warranty.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-[1300px] mx-auto px-6 pt-10 pb-20 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 w-full max-w-[600px]">
          <div className="inline-flex items-center gap-2 bg-[#ffebeb] text-[#b92b2b] px-4 py-1.5 rounded-full text-[0.85rem] font-bold mb-6">
            Professional Security
          </div>
          
          <h1 className="text-[3.5rem] lg:text-[4rem] font-bold text-[#1a1a1a] leading-[1.1] mb-6 tracking-tight">
            Fortify Your Home With Rajseba Security
          </h1>
          
          <p className="text-[#6b7280] text-[1.1rem] leading-relaxed mb-10 max-w-[500px]">
            Premium CCTV installation, smart lock integration, and expert maintenance for residential and commercial spaces in Bangladesh.
          </p>
          
          <div className="flex flex-wrap items-center gap-5">
            <button className="bg-[#b92b2b] hover:bg-[#9a2323] text-white px-8 py-3.5 rounded-xl text-[1rem] font-bold transition-colors shadow-lg shadow-[#b92b2b]/30">
              Book Inspection
            </button>
            <button className="bg-white hover:bg-gray-50 text-[#1a1a1a] px-8 py-3.5 rounded-xl text-[1rem] font-bold transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-[#f3f4f6]">
              View Packages
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 w-full relative pl-2 pb-2 lg:pl-6 lg:pb-6">
          <div className="relative w-full h-[350px] lg:h-[400px] bg-white rounded-[2rem] overflow-hidden shadow-xl border border-white">
            <Image src="/images/service/cc tv1.png" alt="CCTV Installation" fill priority className="object-cover object-center" />
          </div>
          
          {/* Floating Badge */}
          <div className="absolute -bottom-6 -left-6 lg:-bottom-6 lg:-left-6 bg-white rounded-[1rem] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 max-w-[250px]">
            <p className="text-[#b92b2b] font-bold text-[0.95rem] leading-tight mb-1">Certified Pros</p>
            <p className="text-[#6b7280] text-[0.8rem] font-medium leading-tight">Experts in Hikvision, Dahua & uale security systems.</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="w-full bg-[#fff0ef] py-20">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-[2.2rem] font-bold text-[#1a1a1a] tracking-tight mb-3">Our Specialized Services</h2>
            <p className="text-[#6b7280] text-[1.1rem]">Comprehensive protection tailored for your peace of mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-[#ffebeb] text-[#b92b2b] flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              </div>
              <h3 className="text-[1.4rem] font-bold text-[#1a1a1a] mb-4">CCTV Installation</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed mb-8">
                End-to-end setup of IP & Analog cameras. Includes wiring, DVR configuration, and mobile app syncing for 24/7 remote monitoring.
              </p>
              
              <ul className="space-y-3 mb-10 flex-1">
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-[#1a1a1a] font-bold text-[0.9rem]">Night Vision Setup</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-[#1a1a1a] font-bold text-[0.9rem]">Motion Detection Alerts</span>
                </li>
              </ul>
              
              <div className="pt-2">
                <a href="#" className="text-[#b92b2b] font-medium text-[1rem] flex items-center gap-2 hover:underline">
                  Book Service <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gray-200 text-gray-700 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              </div>
              <h3 className="text-[1.4rem] font-bold text-[#1a1a1a] mb-4">Security System<br />Maintenance</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed mb-8">
                Periodic health checks, camera lens cleaning, storage optimization, and software updates to ensure your system never fails.
              </p>
              
              <ul className="space-y-3 mb-10 flex-1">
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-[#1a1a1a] font-bold text-[0.9rem]">Hardware Diagnostics</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-[#1a1a1a] font-bold text-[0.9rem]">Cable Repair</span>
                </li>
              </ul>
              
              <div className="pt-2">
                <a href="#" className="text-[#b92b2b] font-medium text-[1rem] flex items-center gap-2 hover:underline">
                  Schedule Checkup <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] flex flex-col group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gray-200 text-gray-700 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h3 className="text-[1.4rem] font-bold text-[#1a1a1a] mb-4">Smart Lock Setup</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed mb-8">
                Upgrade to keyless entry. Expert installation of biometric, PIN-pad, and WiFi-enabled locks for maximum front-door security.
              </p>
              
              <ul className="space-y-3 mb-10 flex-1">
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-[#1a1a1a] font-bold text-[0.9rem]">Fingerprint Registration</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-[#1a1a1a] font-bold text-[0.9rem]">Remote Access Control</span>
                </li>
              </ul>
              
              <div className="pt-2">
                <a href="#" className="text-[#b92b2b] font-medium text-[1rem] flex items-center gap-2 hover:underline">
                  Get Quote <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Leading Brands */}
      <div className="w-full bg-[#fafafa] py-24">
        <div className="max-w-[1300px] mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          {/* Left: Technician Cards */}
          <div className="flex-1 flex gap-4 sm:gap-6 w-full max-w-[500px]">
            {/* Card 1 */}
            <div className="group bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#f3f4f6] flex flex-col items-center justify-center text-center w-[50%] aspect-[4/5] sm:aspect-square relative -top-6 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer">
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full mb-3 sm:mb-4 border-[3px] border-[#b92b2b] p-1">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image src="/images/service/rep-Technician.png" alt="Rahat Khan" fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <h4 className="text-[#1a1a1a] font-bold text-[0.95rem] sm:text-[1.1rem] leading-tight">Rahat Khan</h4>
              <p className="text-[#6b7280] text-[0.75rem] sm:text-[0.85rem] mt-1">8+ years Exp.</p>
            </div>
            
            {/* Card 2 */}
            <div className="group bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#f3f4f6] flex flex-col items-center justify-center text-center w-[50%] aspect-[4/5] sm:aspect-square relative top-6 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer">
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full mb-3 sm:mb-4 border-[3px] border-[#e5e7eb] p-1">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image src="/images/service/rep-Technician1.png" alt="Zubair Ahmed" fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <h4 className="text-[#1a1a1a] font-bold text-[0.95rem] sm:text-[1.1rem] leading-tight">Zubair Ahmed</h4>
              <p className="text-[#6b7280] text-[0.75rem] sm:text-[0.85rem] mt-1 leading-tight">Smart Home Specialist</p>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="flex-1">
            <h2 className="text-[2.2rem] lg:text-[2.5rem] font-bold text-[#1a1a1a] mb-6 tracking-tight">Trusted By Leading Brands</h2>
            <p className="text-[#6b7280] text-[1.05rem] leading-relaxed mb-10 max-w-[550px]">
              Our technicians are factory-certified to install and maintain equipment from the world's most trusted security giants. We don't just fix devices; we architect security solutions.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-[#6b7280] font-bold text-[1.2rem] lg:text-[1.4rem]">
              <span>HIKVISION</span>
              <span>dahua</span>
              <span>CP PLUS</span>
              <span>Yale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exclusive Home Security Packages */}
      <div className="w-full bg-[#fff5f5] py-20 pb-32">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[2.2rem] lg:text-[2.5rem] font-bold text-[#1a1a1a] tracking-tight mb-3">Exclusive Home Security Packages</h2>
            <p className="text-[#6b7280] text-[1.1rem]">Save more with our bundled security solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col border border-[#f3f4f6]">
              <div className="bg-[#e5e7eb] py-8 px-6 text-center">
                <h3 className="text-[#6b7280] font-bold text-[0.85rem] tracking-wider uppercase mb-3">Apartment Starter</h3>
                <div className="flex items-start justify-center gap-1 text-[#1a1a1a]">
                  <span className="text-[1rem] font-bold mt-2">৳</span>
                  <span className="text-[2.5rem] font-bold leading-none tracking-tight">12,500</span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <ul className="space-y-5 mb-10 flex-1">
                  <li className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[#1a1a1a] font-medium text-[0.9rem]">2x 2MP Indoor Cameras</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[#1a1a1a] font-medium text-[0.9rem]">4-Channel DVR</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[#1a1a1a] font-medium text-[0.9rem]">500GB Storage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[#1a1a1a] font-medium text-[0.9rem]">Free App Setup</span>
                  </li>
                </ul>
                <button className="w-full py-3.5 rounded-xl border-2 border-[#e5e7eb] text-[#1a1a1a] font-bold text-[0.95rem] hover:bg-gray-50 transition-colors">
                  Select Package
                </button>
              </div>
            </div>

            {/* Card 2 (Popular) */}
            <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-[0_15px_40px_rgba(185,43,43,0.1)] flex flex-col border-2 border-[#b92b2b] relative transform lg:-translate-y-4">
              <div className="absolute top-0 right-0 bg-[#b92b2b] text-white text-[0.7rem] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">
                Popular
              </div>
              <div className="bg-[#ffebeb] py-8 px-6 text-center relative">
                <h3 className="text-[#b92b2b] font-bold text-[0.85rem] tracking-wider uppercase mb-3">Family Guard</h3>
                <div className="flex items-start justify-center gap-1 text-[#1a1a1a]">
                  <span className="text-[1rem] font-bold mt-2">৳</span>
                  <span className="text-[2.5rem] font-bold leading-none tracking-tight">28,900</span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <ul className="space-y-5 mb-10 flex-1">
                  <li className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[#1a1a1a] font-medium text-[0.9rem]">4x 5MP All-weather Cams</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[#1a1a1a] font-medium text-[0.9rem]">8-Channel DVR</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[#1a1a1a] font-medium text-[0.9rem]">1TB Storage + Smart Lock</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[#1a1a1a] font-medium text-[0.9rem]">1 year Free Maint.</span>
                  </li>
                </ul>
                <button className="w-full py-3.5 rounded-xl bg-[#b92b2b] text-white font-bold text-[0.95rem] hover:bg-[#9a2323] transition-colors shadow-lg shadow-[#b92b2b]/20">
                  Select Package
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col border border-[#f3f4f6]">
              <div className="bg-[#e5e7eb] py-8 px-6 text-center">
                <h3 className="text-[#6b7280] font-bold text-[0.85rem] tracking-wider uppercase mb-3">Business Suite</h3>
                <div className="flex items-start justify-center gap-1 text-[#1a1a1a]">
                  <span className="text-[1rem] font-bold mt-2">৳</span>
                  <span className="text-[2.5rem] font-bold leading-none tracking-tight">45,000</span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <ul className="space-y-5 mb-10 flex-1">
                  <li className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[#1a1a1a] font-medium text-[0.9rem]">8x IP Cameras (Night Vision)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[#1a1a1a] font-medium text-[0.9rem]">16-Channel NVR</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[#1a1a1a] font-medium text-[0.9rem]">2TB Server Storage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#b92b2b] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[#1a1a1a] font-medium text-[0.9rem]">24/7 Priority Support</span>
                  </li>
                </ul>
                <button className="w-full py-3.5 rounded-xl border-2 border-[#e5e7eb] text-[#1a1a1a] font-bold text-[0.95rem] hover:bg-gray-50 transition-colors">
                  Select Package
                </button>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#382b2b] rounded-[1.5rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.1)] flex flex-col text-white">
              <div className="py-8 px-6 text-center border-b border-white/10">
                <h3 className="text-white/70 font-bold text-[0.85rem] tracking-wider uppercase mb-3">Custom Solution</h3>
                <h4 className="text-[2rem] font-bold leading-none tracking-tight">Get Quote</h4>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <p className="text-white/80 text-[0.95rem] leading-relaxed mb-10 text-center flex-1 mt-4">
                  For large estates, multi-floor offices, or high-security data centers. We design to your specs.
                </p>
                <button className="w-full py-3.5 rounded-xl bg-white text-[#1a1a1a] font-bold text-[0.95rem] hover:bg-gray-100 transition-colors mt-auto">
                  Talk to Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="w-full bg-[#fafafa] py-24 pb-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-white rounded-[3rem] p-10 lg:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="flex-1 w-full max-w-[500px]">
              <div className="flex items-center gap-1 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill="#b92b2b" stroke="#b92b2b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              
              <h3 className="text-[1.6rem] lg:text-[1.8rem] font-bold text-[#1a1a1a] leading-relaxed mb-8 italic">
                "The smart lock installation was seamless. I feel much safer being able to monitor my front door from the office. Rajseba technicians are true professionals."
              </h3>
              
              <div>
                <p className="text-[#1a1a1a] font-bold text-[1.05rem]">Ariful Islam</p>
                <p className="text-[#6b7280] text-[0.9rem]">Homeowner in Gulshan</p>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="flex-1 w-full lg:w-1/2">
              <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
                <Image src="/images/service/cctv room.png" alt="Living Room CCTV Setup" fill className="object-cover object-center" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
