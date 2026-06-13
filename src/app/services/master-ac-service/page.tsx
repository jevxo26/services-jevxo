"use client";

import Image from "next/image";

export default function MasterACServicePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section Container */}
      <div className="max-w-[1300px] mx-auto px-6 pt-8">
        <section className="relative w-full h-[450px] rounded-[1.5rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex items-end pb-12">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image src="/images/service/AC Repair Service-1.png" alt="Professional AC Services" fill priority className="object-cover object-[center_20%]" />
            {/* Gradient Overlay for text readability at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full px-10">
            <div className="max-w-[800px]">
              <h1 className="text-white text-[3.2rem] font-bold leading-tight mb-3 tracking-tight">
                Professional AC Services
              </h1>
              <p className="text-white/90 text-[1.1rem] leading-relaxed max-w-[650px] font-medium">
                Expert installation, cleaning, and maintenance for your comfort. Certified
                technicians at your doorstep within 60 minutes.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1300px] mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
        
        {/* Left Column - Details */}
        <div className="flex-1">
          {/* Service Categories */}
          <h2 className="text-[2rem] font-bold text-[#1a1a1a] mb-6 tracking-tight">Service Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {/* Category 1 */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-transparent hover:border-[#fce4e4] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#fff0ef] text-[#d93838] flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/></svg>
              </div>
              <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-2">AC Servicing</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                Deep cleaning of filters, coils, and drainage for optimal performance.
              </p>
            </div>
            
            {/* Category 2 */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-transparent hover:border-[#fce4e4] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#fff0ef] text-[#d93838] flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/><path d="M3 22h8"/><path d="M5 22v-3"/><path d="M9 22v-3"/><path d="M5 12V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/><rect x="5" y="6" width="6" height="4" rx="1"/><path d="M11 8h4a2 2 0 0 1 2 2v4a3 3 0 0 0 3 3h1"/><path d="M21 17v-4.5a2.5 2.5 0 0 0-5 0V17"/></svg>
              </div>
              <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-2">Gas Refill</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                Eco-friendly refrigerant top-up and leakage testing for maximum cooling.
              </p>
            </div>

            {/* Category 3 */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-transparent hover:border-[#fce4e4] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#fff0ef] text-[#d93838] flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
              <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-2">Installation</h3>
              <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                Wall mounting, copper pipe fitting, and electrical setup for new units.
              </p>
            </div>
          </div>

          {/* Transparent Pricing */}
          <div className="bg-[#fffcfc] rounded-[2rem] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h2 className="text-[2rem] font-bold text-[#1a1a1a] mb-8 tracking-tight">Transparent Pricing</h2>
            
            <div className="flex flex-col">
              {/* Price Item 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-[#fce4e4]">
                <div className="mb-3 sm:mb-0">
                  <h4 className="text-[#1a1a1a] font-bold text-[1.05rem] mb-1">Basic Master Service (Split)</h4>
                  <p className="text-[#6b7280] text-[0.95rem]">Indoor & Outdoor units cleaning</p>
                </div>
                <div className="flex items-start text-[#d93838] font-bold">
                  <span className="text-[1rem] mt-1 mr-0.5">৳</span>
                  <span className="text-[1.8rem] leading-none">1,500</span>
                  <span className="text-[0.8rem] text-[#6b7280] font-normal mt-auto mb-1 ml-1">/unit</span>
                </div>
              </div>
              
              {/* Price Item 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-[#fce4e4]">
                <div className="mb-3 sm:mb-0">
                  <h4 className="text-[#1a1a1a] font-bold text-[1.05rem] mb-1">Gas Refill (R22/R410)</h4>
                  <p className="text-[#6b7280] text-[0.95rem]">Full charge with leak repair</p>
                </div>
                <div className="flex items-start text-[#d93838] font-bold">
                  <span className="text-[1rem] mt-1 mr-0.5">৳</span>
                  <span className="text-[1.8rem] leading-none">2,800</span>
                  <span className="text-[0.8rem] text-[#6b7280] font-normal mt-auto mb-1 ml-1">/unit</span>
                </div>
              </div>

              {/* Price Item 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6">
                <div className="mb-3 sm:mb-0">
                  <h4 className="text-[#1a1a1a] font-bold text-[1.05rem] mb-1">Uninstallation & Re-installation</h4>
                  <p className="text-[#6b7280] text-[0.95rem]">Standard 10ft copper pipe</p>
                </div>
                <div className="flex items-start text-[#d93838] font-bold">
                  <span className="text-[1rem] mt-1 mr-0.5">৳</span>
                  <span className="text-[1.8rem] leading-none">4,500</span>
                  <span className="text-[0.8rem] text-[#6b7280] font-normal mt-auto mb-1 ml-1">/unit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Rated Technicians */}
          <div className="mt-12">
            <h2 className="text-[2rem] font-bold text-[#1a1a1a] mb-6 tracking-tight">Top Rated Technicians</h2>
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Technician 1 */}
              <div className="flex-1 bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-transparent flex items-center gap-5">
                <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 shadow-sm">
                  <Image src="/images/service/ac pro 1.png" alt="Karim Ullah" fill className="object-cover object-center" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-[1.1rem] font-bold text-[#1a1a1a] leading-tight mb-1.5">Karim Ullah</h4>
                  <div className="flex items-center text-[#d93838] text-[0.85rem] font-bold mb-1.5">
                    <span className="mr-1 text-[1rem]">★</span>
                    <span>4.9 <span className="text-[#d93838] font-medium">(124 reviews)</span></span>
                  </div>
                  <span className="text-[#6b7280] text-[0.9rem] font-medium">12 Years Experience</span>
                </div>
              </div>

              {/* Technician 2 */}
              <div className="flex-1 bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-transparent flex items-center gap-5">
                <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 shadow-sm">
                  <Image src="/images/service/ac pro 2.png" alt="Zakir Hossain" fill className="object-cover object-center" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-[1.1rem] font-bold text-[#1a1a1a] leading-tight mb-1.5">Zakir Hossain</h4>
                  <div className="flex items-center text-[#d93838] text-[0.85rem] font-bold mb-1.5">
                    <span className="mr-1 text-[1rem]">★</span>
                    <span>4.8 <span className="text-[#d93838] font-medium">(98 reviews)</span></span>
                  </div>
                  <span className="text-[#6b7280] text-[0.9rem] font-medium">8 Years Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Widget */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#f3f4f6] sticky top-24">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[1.5rem] font-bold text-[#1a1a1a] tracking-tight mb-1">Book Service</h3>
                <p className="text-[0.95rem] text-[#6b7280]">Pay after the job is done</p>
              </div>
              <div className="text-right">
                <span className="text-[0.65rem] uppercase text-[#9ca3af] font-bold tracking-wider block mb-0.5">Starts from</span>
                <div className="flex items-start text-[#d93838] font-bold">
                  <span className="text-[1rem] mt-1 mr-0.5">৳</span>
                  <span className="text-[1.8rem] leading-none tracking-tight">1,500</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form className="mt-8">
              {/* Service Select - Accessible */}
              <div className="mb-5">
                <label htmlFor="service-type" className="block text-[0.7rem] font-bold text-[#9ca3af] uppercase tracking-widest mb-2">
                  Select Service
                </label>
                <div className="relative">
                  <select 
                    id="service-type" 
                    name="service-type"
                    className="w-full appearance-none bg-[#f8fafc] border border-transparent text-[#1a1a1a] text-[0.95rem] rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#d93838]/20 focus:border-[#d93838] transition-all cursor-pointer font-medium hover:bg-[#f1f5f9]"
                    aria-label="Select Service"
                  >
                    <option value="master-servicing">AC Master Servicing</option>
                    <option value="basic-servicing">Basic AC Servicing</option>
                    <option value="gas-refill">AC Gas Refill</option>
                    <option value="installation">AC Installation</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* Schedule Select - Accessible */}
              <div className="mb-6">
                <label htmlFor="schedule-time" className="block text-[0.7rem] font-bold text-[#9ca3af] uppercase tracking-widest mb-2">
                  Schedule
                </label>
                <div className="relative">
                  <select 
                    id="schedule-time" 
                    name="schedule-time"
                    className="w-full appearance-none bg-[#f8fafc] border border-transparent text-[#1a1a1a] text-[0.95rem] rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#d93838]/20 focus:border-[#d93838] transition-all cursor-pointer font-medium hover:bg-[#f1f5f9]"
                    aria-label="Select Schedule"
                  >
                    <option value="tomorrow-10">Tomorrow, 10:00 AM</option>
                    <option value="tomorrow-14">Tomorrow, 02:00 PM</option>
                    <option value="tomorrow-16">Tomorrow, 04:00 PM</option>
                    <option value="dayafter-10">Day after tomorrow, 10:00 AM</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button type="button" className="w-full py-4 bg-[#b92b2b] hover:bg-[#a02222] text-white rounded-[14px] text-[1rem] font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                Proceed to Booking
              </button>
              
              <div className="flex items-center justify-center gap-1.5 mt-5 text-[#6b7280]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                <span className="text-[0.8rem] font-medium">100% Satisfaction Guarantee</span>
              </div>
            </form>

            {/* Features List */}
            <div className="mt-6 pt-6 border-t border-[#f3f4f6] flex flex-col gap-3.5">
              <div className="flex items-center gap-3">
                <div className="text-[#d93838]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12.5l3 3 5-6"></path></svg>
                </div>
                <span className="text-[#4b5563] text-[0.9rem] font-medium">Certified Professionals</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[#d93838]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12.5l3 3 5-6"></path></svg>
                </div>
                <span className="text-[#4b5563] text-[0.9rem] font-medium">30-Day Service Warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[#d93838]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12.5l3 3 5-6"></path></svg>
                </div>
                <span className="text-[#4b5563] text-[0.9rem] font-medium">Genuine Spare Parts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
