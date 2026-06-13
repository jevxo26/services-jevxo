"use client";

import Image from "next/image";
import { useState } from "react";

export default function SalonSpaServicePage() {
  const [selectedDate, setSelectedDate] = useState("May 24, 2024");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");

  const timeOptions = [
    "10:00 AM",
    "02:00 PM",
    "04:30 PM",
    "06:00 PM"
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1300px] mx-auto px-6 pt-10 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column (Hero & Content) */}
          <div className="flex-[2] flex flex-col">
            {/* Hero Image */}
            <div className="relative w-full h-[400px] lg:h-[450px] rounded-[2.5rem] overflow-hidden mb-12 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
              <Image src="/images/service/Professional Home Salon Stylist.png" alt="Home Salon & Spa Experience" fill priority className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-8 md:bottom-12 left-6 md:left-10 text-white pr-6 md:pr-10">
                <div className="inline-flex items-center gap-2 bg-[#ff5a5f] rounded-full px-4 py-1.5 mb-4 shadow-sm">
                  <span className="text-[0.7rem] font-bold tracking-wider uppercase">Premium Service</span>
                </div>
                <h1 className="text-[2.2rem] md:text-[3.2rem] font-bold mb-4 tracking-tight leading-tight max-w-[800px]">
                  Home Salon & Spa<br />Experience
                </h1>
                <p className="text-[1.1rem] md:text-[1.2rem] font-medium text-white/90 max-w-[600px]">
                  Professional beauty and wellness services delivered at your doorstep.
                </p>
              </div>
            </div>

            {/* About this Service */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-1 bg-[#ff5a5f]"></div>
                <h2 className="text-[2rem] font-bold text-[#1a1a1a] tracking-tight">About this Service</h2>
              </div>
              
              <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <p className="text-[#6b7280] text-[1.05rem] leading-relaxed">
                  Experience the pinnacle of convenience and luxury with Rajseba's Home Salon. We bring the
                  full spectrum of high-end salon treatments directly to your living room. Our certified
                  professionals use premium, hypoallergenic products to ensure you receive the same quality
                  care as a physical luxury spa, without the commute. Whether it's a quick refresh or a full-day
                  pampering session, we tailor every moment to your comfort.
                </p>
              </div>
            </div>

            {/* What's Included */}
            <div>
              <h2 className="text-[2rem] font-bold text-[#1a1a1a] mb-8 tracking-tight">What's Included</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hair Styling */}
                <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex gap-4 items-start hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
                  <div className="text-[#ff5a5f] mt-1 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="6" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
                      <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
                      <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-1.5">Hair Styling</h3>
                    <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                      Precision cuts, professional blow-outs, and nourishing hair treatments.
                    </p>
                  </div>
                </div>

                {/* Luxury Facial */}
                <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex gap-4 items-start hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
                  <div className="text-[#ff5a5f] mt-1 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-1.5">Luxury Facial</h3>
                    <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                      Deep cleansing, exfoliation, and rejuvenation for all skin types.
                    </p>
                  </div>
                </div>

                {/* Manicure */}
                <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex gap-4 items-start hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
                  <div className="text-[#ff5a5f] mt-1 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
                      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-1.5">Manicure</h3>
                    <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                      Expert nail shaping, cuticle care, and long-lasting polish.
                    </p>
                  </div>
                </div>

                {/* Relaxing Massage */}
                <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex gap-4 items-start hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
                  <div className="text-[#ff5a5f] mt-1 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      <path d="M12 8c-2.5 0-4.5 2-4.5 4.5S9.5 17 12 17s4.5-2 4.5-4.5S14.5 8 12 8z"></path>
                      <path d="M12 2v2"></path>
                      <path d="M12 20v2"></path>
                      <path d="M4.93 4.93l1.41 1.41"></path>
                      <path d="M17.66 17.66l1.41 1.41"></path>
                      <path d="M2 12h2"></path>
                      <path d="M20 12h2"></path>
                      <path d="M6.34 17.66l-1.41 1.41"></path>
                      <path d="M19.07 4.93l-1.41 1.41"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-1.5">Relaxing Massage</h3>
                    <p className="text-[#6b7280] text-[0.95rem] leading-relaxed">
                      Swedish or deep tissue massage for ultimate muscle relief.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="mt-16">
              <h2 className="text-[2rem] font-bold text-[#1a1a1a] mb-12 tracking-tight">How it Works</h2>
              
              <div className="flex flex-col md:flex-row justify-between items-start relative gap-8 md:gap-0">
                {/* Connecting Line (hidden on mobile) */}
                <div className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] h-[2px] bg-[#f3f4f6] z-0"></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center flex-1 text-center relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#ff5a5f] text-white flex items-center justify-center font-bold text-[1.2rem] mb-6 shadow-[0_4px_12px_rgba(255,90,95,0.3)]">
                    1
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">Select Package</h3>
                  <p className="text-[#6b7280] text-[0.9rem] leading-relaxed max-w-[220px]">
                    Pick the services that match your mood and needs.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col items-center flex-1 text-center relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#ff5a5f] text-white flex items-center justify-center font-bold text-[1.2rem] mb-6 shadow-[0_4px_12px_rgba(255,90,95,0.3)]">
                    2
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">Schedule Date</h3>
                  <p className="text-[#6b7280] text-[0.9rem] leading-relaxed max-w-[220px]">
                    Choose a convenient time that fits your busy schedule.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col items-center flex-1 text-center relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#ff5a5f] text-white flex items-center justify-center font-bold text-[1.2rem] mb-6 shadow-[0_4px_12px_rgba(255,90,95,0.3)]">
                    3
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">At-Home Service</h3>
                  <p className="text-[#6b7280] text-[0.9rem] leading-relaxed max-w-[220px]">
                    Sit back and relax while our experts pamper you.
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="mt-16 mb-8">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-[2rem] font-bold text-[#1a1a1a] tracking-tight">Customer Reviews</h2>
                <div className="flex items-center gap-2 mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5a5f" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <span className="font-bold text-[#ff5a5f]">4.9</span>
                  <span className="text-[#6b7280] text-[0.85rem]">(120+ reviews)</span>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-[#f3f4f6] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#f3f4f6]">
                    <Image src="/images/service/Sarah J..png" alt="Sarah Jenkins" fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] text-[1.1rem] mb-1">Sarah Jenkins</h4>
                    <div className="flex text-[#fbbf24]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </div>
                  </div>
                </div>
                <p className="text-[#6b7280] italic leading-relaxed text-[0.95rem]">
                  "Absolutely incredible. Having a full facial and massage in my own home was a game-changer. The stylist was professional, tidy, and so skilled."
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (Booking Widget) */}
          <div className="flex-1 w-full lg:w-[400px]">
            <div className="sticky top-32">
              <div className="bg-white rounded-[2.5rem] p-8 border border-[#f3f4f6] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                {/* Header */}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#6b7280] text-[0.8rem] font-bold uppercase tracking-wider">STARTS FROM</span>
                  <div className="flex items-center gap-1.5 bg-[#ecfdf5] text-[#10b981] px-2.5 py-1 rounded-full">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-[0.75rem] font-bold">Verified</span>
                  </div>
                </div>
                <div className="text-[2.5rem] font-bold text-[#ff5a5f] tracking-tight mb-8 leading-none">
                  $35
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-[#4b5563] font-bold text-[0.75rem] uppercase tracking-widest mb-3">SELECT DATE</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-[#f8fafc] text-[#1a1a1a] font-medium border border-transparent rounded-xl py-3.5 pl-4 pr-12 focus:ring-2 focus:ring-[#ff5a5f]/20 outline-none transition-all hover:bg-[#f1f5f9]"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-8">
                  <label className="block text-[#4b5563] font-bold text-[0.75rem] uppercase tracking-widest mb-3">SELECT TIME</label>
                  <div className="grid grid-cols-2 gap-3">
                    {timeOptions.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-2 rounded-xl text-[0.9rem] font-medium border transition-all ${
                          selectedTime === time 
                          ? "bg-[#fff0ef] border-[#ff5a5f] text-[#ff5a5f]" 
                          : "bg-[#f8fafc] border-transparent text-[#4b5563] hover:bg-[#f1f5f9]"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="border-t border-[#f3f4f6] pt-6 pb-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#6b7280] text-[0.95rem]">Service Base Price</span>
                    <span className="text-[#1a1a1a] font-bold text-[0.95rem]">$35.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6b7280] text-[0.95rem]">Service Fee</span>
                    <span className="text-[#1a1a1a] font-bold text-[0.95rem]">$2.50</span>
                  </div>
                </div>

                <div className="border-t border-[#f3f4f6] pt-6 mb-8 flex justify-between items-center">
                  <span className="text-[#1a1a1a] font-bold text-[1.1rem]">Total</span>
                  <span className="text-[#ff5a5f] font-bold text-[1.25rem]">$37.50</span>
                </div>

                {/* Book Now Button */}
                <button 
                  onClick={() => alert(`Booking Salon & Spa for ${selectedDate} at ${selectedTime}`)}
                  className="w-full bg-[#ff5a5f] hover:bg-[#e0484d] text-white font-bold text-[1.1rem] py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(255,90,95,0.25)] hover:shadow-[0_8px_25px_rgba(255,90,95,0.35)] hover:-translate-y-0.5 active:translate-y-0 mb-4"
                >
                  Book Now
                </button>
                
                <div className="text-center">
                  <p className="text-[#9ca3af] text-[0.7rem] leading-relaxed max-w-[250px] mx-auto">
                    No immediate charge. Free cancellation up to 24h before appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
