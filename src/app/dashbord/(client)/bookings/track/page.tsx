"use client"

import * as React from "react"
import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import {
  ShieldAlert,
  Calendar as CalendarIcon,
  Clock,
  Shield,
  MapPin,
  CreditCard,
  Check,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Plus,
  Phone,
  MessageCircle,
  HelpCircle,
  TrendingUp,
  MapPinOff,
  UserCheck
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner";

export default function BookingTrackWizard() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const router = useRouter()
  
  // Stepper State (1 to 5)
  const [step, setStep] = React.useState(1)

  // Unified State Object - Easily connected to any API endpoint
  const [bookingData, setBookingData] = React.useState({
    rooms: 3,
    extras: ["balcony", "fridge"],
    date: "17", // Selected day in October
    timeSlot: "03:00 PM",
    professional: "sadiya", // sadiya, kamal
    addressType: "home", // home, office
    addressLine: "House 24, Road 4, Sector 12, Mirpur, Dhaka",
    specialInstruction: "",
    paymentMethod: "bkash", // bkash, card, cash
    promoCode: "",
    promoDiscount: 0,
    isPromoApplied: false
  })

  if (role !== "client") {
    return <AccessDenied roleRequired="Customer" />
  }

  // Cost calculations
  const basePrice = bookingData.rooms === 3 ? 1050 : bookingData.rooms === 4 ? 1400 : bookingData.rooms === 5 ? 1750 : 2100
  const balconyPrice = bookingData.extras.includes("balcony") ? 150 : 0
  const fridgePrice = bookingData.extras.includes("fridge") ? 200 : 0
  const windowPrice = bookingData.extras.includes("window") ? 250 : 0
  const serviceFee = 150
  
  const subTotal = basePrice + balconyPrice + fridgePrice + windowPrice + serviceFee
  const vatTax = Math.round(subTotal * 0.05) // 5% VAT
  const totalPayable = subTotal + vatTax - bookingData.promoDiscount

  // Action handlers
  const toggleExtra = (item: string) => {
    setBookingData(prev => {
      const activeExtras = prev.extras.includes(item)
        ? prev.extras.filter((e) => e !== item)
        : [...prev.extras, item]
      return { ...prev, extras: activeExtras }
    })
  }

  const handleApplyPromo = () => {
    if (bookingData.promoCode.toUpperCase() === "RAJSEBA100") {
      setBookingData(prev => ({
        ...prev,
        promoDiscount: 100,
        isPromoApplied: true
      }))
      toast.success("Promo code applied successfully! ৳100 discount added.")
    } else {
      toast.error("Invalid Promo Code! Use 'RAJSEBA100'")
    }
  }

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleConfirmAndPay = async () => {
    // API connection simulation
    setStep(5)
  }

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Calendar Days generator (October 2024 - starts on a Tuesday)
  const daysInOctober = Array.from({ length: 31 }, (_, i) => String(i + 1))
  const offsetDays = ["", ""] // Offset blank boxes for Sun and Mon

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="w-full space-y-8 relative z-10">
        
        {/* Stepper Header (Extended Width Layout) */}
        {step < 5 && (
          <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md p-7 rounded-[32px] border border-slate-100/90 shadow-sm">
            <div className="flex items-center justify-between relative px-2 sm:px-6">
              
              {/* Step 1 */}
              <div className="flex items-center gap-3 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                    step >= 1 ? "bg-[#FF5B60] text-white" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > 1 ? <Check size={16} className="stroke-[3]" /> : "1"}
                </div>
                <span className={`text-sm font-black tracking-wide ${step >= 1 ? "text-slate-800" : "text-slate-450"}`}>
                  Service
                </span>
              </div>

              <div className={`flex-1 h-[2px] mx-4 transition-colors ${step >= 2 ? "bg-[#FF5B60]" : "bg-slate-100"}`} />

              {/* Step 2 */}
              <div className="flex items-center gap-3 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                    step >= 2 ? "bg-[#FF5B60] text-white" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > 2 ? <Check size={16} className="stroke-[3]" /> : "2"}
                </div>
                <span className={`text-sm font-black tracking-wide ${step >= 2 ? "text-slate-800" : "text-slate-450"}`}>
                  Schedule
                </span>
              </div>

              <div className={`flex-1 h-[2px] mx-4 transition-colors ${step >= 3 ? "bg-[#FF5B60]" : "bg-slate-100"}`} />

              {/* Step 3 */}
              <div className="flex items-center gap-3 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                    step >= 3 ? "bg-[#FF5B60] text-white" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > 3 ? <Check size={16} className="stroke-[3]" /> : "3"}
                </div>
                <span className={`text-sm font-black tracking-wide ${step >= 3 ? "text-slate-800" : "text-slate-450"}`}>
                  Address
                </span>
              </div>

              <div className={`flex-1 h-[2px] mx-4 transition-colors ${step >= 4 ? "bg-[#FF5B60]" : "bg-slate-100"}`} />

              {/* Step 4 */}
              <div className="flex items-center gap-3 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                    step >= 4 ? "bg-[#FF5B60] text-white" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  4
                </div>
                <span className={`text-sm font-black tracking-wide ${step >= 4 ? "text-slate-800" : "text-slate-450"}`}>
                  Payment
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Wizard Main Columns - Extended max-w-7xl layout */}
        {step < 5 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto w-full">
            
            {/* Left Box */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Step 1: Service Configurations */}
              {step === 1 && (
                <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-slate-100 shadow-sm space-y-8">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Selected Service</span>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <img
                          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=120&auto=format&fit=crop&q=80"
                          alt="Service"
                          className="w-20 h-20 rounded-2xl object-cover border border-slate-50"
                        />
                        <div>
                          <h3 className="font-black text-slate-850 text-xl">Deep Home Cleaning</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm font-bold text-slate-400">
                            <span className="flex items-center gap-1.5"><Clock size={16} /> 4-5 hours</span>
                            <span className="flex items-center gap-1.5"><Shield size={16} /> Vetted Pros</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-[#FF5B60] hover:text-[#FF464C] text-sm font-extrabold transition-all px-5 py-2.5 hover:bg-rose-50/40 rounded-xl focus:outline-none">
                        Change
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-800 mb-4">How many rooms need cleaning?</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => setBookingData(prev => ({ ...prev, rooms: num }))}
                          className={`p-5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1 focus:outline-none ${
                            bookingData.rooms === num
                              ? "border-[#FF5B60] bg-rose-50/20 text-[#FF5B60] scale-[1.03] shadow-md shadow-rose-500/5"
                              : "border-slate-100 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span className="text-2xl font-black">{num === 6 ? "6+" : num}</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rooms</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-800 mb-4">Extra Attention Needed?</h4>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: "balcony", label: "Balcony", price: "৳150" },
                        { id: "fridge", label: "Inside Fridge", price: "৳200" },
                        { id: "window", label: "Window Exterior", price: "৳250" }
                      ].map((item) => {
                        const active = bookingData.extras.includes(item.id)
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggleExtra(item.id)}
                            className={`px-6 py-4 rounded-2xl border text-sm font-bold transition-all flex items-center gap-3 focus:outline-none ${
                              active
                                ? "border-[#FF5B60] bg-rose-50/20 text-[#FF5B60] scale-[1.02] shadow-sm"
                                : "border-slate-100 bg-white hover:bg-slate-50 text-slate-600"
                            }`}
                          >
                            <span className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                              active ? "bg-[#FF5B60] border-[#FF5B60] text-white" : "border-slate-350"
                            }`}>
                              {active && <Check size={12} className="stroke-[3]" />}
                            </span>
                            {item.label} ({item.price})
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Schedule & Choose Professional */}
              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calendar select */}
                  <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-slate-100 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-black text-slate-800">Select Date & Time</h4>
                      <span className="text-xs font-black text-[#FF5B60] uppercase tracking-wider">October 2024</span>
                    </div>

                    {/* Month Grid */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-7 text-center text-xs font-black text-slate-400 uppercase">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1.5">
                        {offsetDays.map((_, idx) => <div key={`offset-${idx}`} />)}
                        {daysInOctober.map((day) => {
                          const isSelected = bookingData.date === day
                          return (
                            <button
                              key={day}
                              onClick={() => setBookingData(prev => ({ ...prev, date: day }))}
                              className={`aspect-square rounded-full text-sm font-black flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-[#FF5B60] text-white shadow-md shadow-rose-500/20 scale-110"
                                  : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              {day}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="pt-5 border-t border-slate-100 space-y-3">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider">Available Time Slots</h5>
                      <div className="grid grid-cols-3 gap-3.5">
                        {["09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM", "09:00 PM", "12:00 AM"].map((slot) => {
                          const isSelected = bookingData.timeSlot === slot
                          return (
                            <button
                              key={slot}
                              onClick={() => setBookingData(prev => ({ ...prev, timeSlot: slot }))}
                              className={`py-3 px-2 text-center rounded-xl text-xs font-black border transition-all ${
                                isSelected
                                  ? "border-[#FF5B60] bg-rose-50/20 text-[#FF5B60]"
                                  : "border-slate-100 bg-white hover:bg-slate-50 text-slate-550"
                              }`}
                            >
                              {slot}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Choose Professional */}
                  <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-slate-100 shadow-sm flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <h4 className="text-base font-black text-slate-800">Choose Professional</h4>
                      
                      <div className="space-y-3.5">
                        {[
                          { id: "sadiya", name: "Sadiya Rahman", rating: "4.9", role: "Expert Cleaner", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" },
                          { id: "kamal", name: "Kamal Hossain", rating: "4.8", role: "Senior Cleaning Expert", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" }
                        ].map((pro) => {
                          const isSelected = bookingData.professional === pro.id
                          return (
                            <button
                              key={pro.id}
                              onClick={() => setBookingData(prev => ({ ...prev, professional: pro.id }))}
                              className={`w-full p-5 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 focus:outline-none ${
                                isSelected
                                  ? "border-[#FF5B60] bg-rose-50/20 text-[#FF5B60] scale-[1.01]"
                                  : "border-slate-100 bg-white hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <img
                                  src={pro.avatar}
                                  alt={pro.name}
                                  className="w-12 h-12 rounded-full object-cover border border-slate-100"
                                />
                                <div>
                                  <span className="text-sm font-black block text-slate-800">{pro.name}</span>
                                  <span className="text-xs text-slate-400 font-bold block mt-0.5">{pro.role}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-amber-500">★ {pro.rating}</span>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-[#FF5B60] text-white flex items-center justify-center shadow-sm">
                                    <Check size={10} className="stroke-[3]" />
                                  </div>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="bg-slate-50/80 p-5 rounded-2xl text-xs font-bold text-slate-400 space-y-1">
                      <span className="font-extrabold text-slate-800 block text-xs">Preferred Pro Availability</span>
                      <p>Deep Home Cleaning • Service Duration: 4 hrs</p>
                      <span className="font-black text-[#FF5B60] block mt-1.5 text-sm">Total base: ৳2,450</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Address & Location Map */}
              {step === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address List */}
                  <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-slate-100 shadow-sm space-y-4">
                    <h4 className="text-base font-black text-slate-800">Select Address</h4>
                    
                    <div className="space-y-3.5">
                      {[
                        { id: "home", title: "Home", val: "House 24, Road 4, Sector 12, Mirpur, Dhaka" },
                        { id: "office", title: "Office", val: "Level 4, City Center, Motijheel, Dhaka" }
                      ].map((addr) => {
                        const isSelected = bookingData.addressType === addr.id
                        return (
                          <button
                            key={addr.id}
                            onClick={() => setBookingData(prev => ({ ...prev, addressType: addr.id, addressLine: addr.val }))}
                            className={`w-full p-5 rounded-2xl border transition-all text-left flex items-start justify-between gap-3 focus:outline-none ${
                              isSelected
                                ? "border-[#FF5B60] bg-rose-50/20 text-[#FF5B60] scale-[1.01]"
                                : "border-slate-100 bg-white hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div className="space-y-1">
                              <span className="text-sm font-black block text-slate-800">{addr.title}</span>
                              <span className="text-xs text-slate-400 font-bold leading-relaxed block max-w-[220px]">
                                {addr.val}
                              </span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all mt-0.5 ${
                              isSelected ? "bg-[#FF5B60] border-[#FF5B60] text-white" : "border-slate-200 bg-white"
                            }`}>
                              {isSelected && <Check size={10} className="stroke-[3]" />}
                            </div>
                          </button>
                        )
                      })}
                      
                      <button className="w-full py-4 border border-dashed border-[#FF5B60]/40 rounded-2xl text-xs font-black text-[#FF5B60] hover:bg-rose-50/20 transition-all flex items-center justify-center gap-1.5 focus:outline-none">
                        <Plus size={14} /> Add New Address
                      </button>
                    </div>
                  </div>

                  {/* Simulated Map View */}
                  <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-slate-100 shadow-sm space-y-4">
                    <div className="h-52 bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-50 flex items-center justify-center">
                      
                      {/* Grid background matching map style */}
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]" />
                      
                      {/* Simulated Pin */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-[#FF5B60] text-white text-xs font-black px-4 py-2 rounded-full shadow-md shadow-rose-500/25 mb-1.5">
                          {bookingData.addressLine.split(",")[0]}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#FF5B60]/20 flex items-center justify-center animate-ping absolute top-7" />
                        <div className="w-7 h-7 rounded-full bg-[#FF5B60] border-2 border-white shadow-md z-10 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">Special Instruction (Optional)</label>
                      <textarea
                        value={bookingData.specialInstruction}
                        onChange={(e) => setBookingData(prev => ({ ...prev, specialInstruction: e.target.value }))}
                        rows={2}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-3 text-xs text-slate-700 focus:outline-none focus:border-rose-300 resize-none font-semibold"
                        placeholder="e.g. Please bring a tall ladder..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review Order & Secure Payment */}
              {step === 4 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Review Order card */}
                  <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-slate-100 shadow-sm space-y-4">
                    <h4 className="text-base font-black text-slate-800">Finalize Booking</h4>
                    
                    <div className="p-5 bg-slate-50 rounded-2xl space-y-3.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Review Order</span>
                      <div className="flex gap-4 items-center">
                        <img
                          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&auto=format&fit=crop&q=80"
                          alt="cleaning"
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div>
                          <span className="text-sm font-black text-slate-800 block">Deep Home Cleaning</span>
                          <span className="text-xs text-slate-400 font-bold block mt-1">
                            October {bookingData.date}, 2024 at {bookingData.timeSlot}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3.5 border-t border-slate-200/50 flex gap-2 items-start text-xs font-bold text-slate-500">
                        <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{bookingData.addressLine}</span>
                      </div>
                    </div>

                    {/* Apply Promo Code */}
                    <div className="pt-4 border-t border-slate-100/60 space-y-2.5">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">Apply Promo Code</label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={bookingData.promoCode}
                          onChange={(e) => setBookingData(prev => ({ ...prev, promoCode: e.target.value }))}
                          disabled={bookingData.isPromoApplied}
                          className="flex-1 bg-slate-50/60 border border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-850 focus:outline-none focus:border-rose-350 disabled:opacity-50"
                          placeholder="e.g. RAJSEBA100"
                        />
                        <button
                          onClick={handleApplyPromo}
                          disabled={bookingData.isPromoApplied}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-black px-6 py-3.5 rounded-2xl transition-all disabled:opacity-50"
                        >
                          Apply Code
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Choices */}
                  <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-slate-100 shadow-sm space-y-4">
                    <h4 className="text-base font-black text-slate-800">Payment Method</h4>
                    
                    <div className="space-y-3.5">
                      {[
                        { id: "bkash", name: "bKash Mobile Wallet", desc: "Pay securely with bKash" },
                        { id: "card", name: "Visa / Mastercard Card", desc: "Pay with debit/credit card" },
                        { id: "cash", name: "Cash after Service", desc: "Pay cash after cleaning" }
                      ].map((pay) => {
                        const isSelected = bookingData.paymentMethod === pay.id
                        return (
                          <button
                            key={pay.id}
                            onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: pay.id }))}
                            className={`w-full p-5 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 focus:outline-none ${
                              isSelected
                                ? "border-[#FF5B60] bg-rose-50/20 text-[#FF5B60] scale-[1.01]"
                                : "border-slate-100 bg-white hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div>
                              <span className="text-sm font-black block text-slate-800">{pay.name}</span>
                              <span className="text-xs text-slate-400 font-bold mt-0.5 block">{pay.desc}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected ? "bg-[#FF5B60] border-[#FF5B60] text-white" : "border-slate-200 bg-white"
                            }`}>
                              {isSelected && <Check size={10} className="stroke-[3]" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Control Actions (Common to steps 1-4) */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100/60 mt-6 bg-white/70 backdrop-blur-md p-5 rounded-[24px]">
                {step > 1 ? (
                  <button
                    onClick={handleBackStep}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-black transition-all focus:outline-none"
                  >
                    <ArrowLeft size={16} /> Back to Previous
                  </button>
                ) : (
                  <Link
                    href="/dashbord/bookings"
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-black transition-all focus:outline-none"
                  >
                    ← Cancel Booking
                  </Link>
                )}

                <div className="flex items-center gap-4">
                  {step < 4 && (
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest hidden sm:inline">
                      Next: {step === 1 ? "Schedule" : step === 2 ? "Address" : "Payment"}
                    </span>
                  )}
                  {step === 4 ? (
                    <button
                      onClick={handleConfirmAndPay}
                      className="bg-[#FF5B60] hover:bg-[#FF464C] text-white text-xs font-bold px-9 py-4 rounded-2xl flex items-center gap-2 shadow-sm shadow-rose-500/10 active:scale-[0.98] transition-all focus:outline-none"
                    >
                      Confirm & Pay <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextStep}
                      className="bg-[#FF5B60] hover:bg-[#FF464C] text-white text-xs font-bold px-9 py-4 rounded-2xl flex items-center gap-2 shadow-sm shadow-rose-500/10 active:scale-[0.98] transition-all focus:outline-none"
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Right Box: Booking Summary Panel */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-[36px] border border-slate-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-slate-850 text-lg">Booking Summary</h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5">Deep Home Cleaning Service</p>
              </div>

              <div className="space-y-4 pt-5 border-t border-slate-100">
                <div className="flex justify-between items-center text-sm font-black text-slate-700">
                  <span>Deep Cleaning ({bookingData.rooms} Rooms)</span>
                  <span>৳{basePrice}</span>
                </div>

                {bookingData.extras.includes("balcony") && (
                  <div className="flex justify-between items-center text-sm font-bold text-slate-450">
                    <span>Extra: Balcony Cleaning</span>
                    <span>৳150</span>
                  </div>
                )}

                {bookingData.extras.includes("fridge") && (
                  <div className="flex justify-between items-center text-sm font-bold text-slate-450">
                    <span>Extra: Inside Fridge</span>
                    <span>৳200</span>
                  </div>
                )}

                {bookingData.extras.includes("window") && (
                  <div className="flex justify-between items-center text-sm font-bold text-slate-450">
                    <span>Extra: Window Exterior</span>
                    <span>৳250</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm font-bold text-slate-450">
                  <span>Service Fee</span>
                  <span>৳150</span>
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-slate-450">
                  <span>VAT & Tax (5%)</span>
                  <span>৳{vatTax}</span>
                </div>

                {bookingData.promoDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm font-black text-rose-500">
                    <span>Promo Discount</span>
                    <span>- ৳{bookingData.promoDiscount}</span>
                  </div>
                )}
              </div>

              <div className="pt-5 border-t border-slate-100/60 flex justify-between items-center">
                <div>
                  <span className="text-sm font-black text-slate-800">Total Payable</span>
                  <span className="text-xs text-slate-400 font-bold block mt-0.5">VAT & charges included</span>
                </div>
                <span className="text-2xl font-black text-[#FF5B60]">৳{totalPayable}</span>
              </div>

              {/* Dynamic selections summary list */}
              {step > 1 && (
                <div className="pt-5 border-t border-slate-150 space-y-4">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Selected Details</span>
                  
                  {step >= 2 && (
                    <div className="flex items-start gap-2.5">
                      <CalendarIcon size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-black text-slate-750 block">October {bookingData.date}, 2024</span>
                        <span className="text-[11px] text-slate-400 font-bold block mt-0.5">{bookingData.timeSlot}</span>
                      </div>
                    </div>
                  )}

                  {step >= 3 && (
                    <div className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-black text-slate-750 block">Service Location ({bookingData.addressType})</span>
                        <span className="text-[11px] text-slate-400 font-semibold block mt-0.5 leading-relaxed max-w-[210px]">{bookingData.addressLine}</span>
                      </div>
                    </div>
                  )}

                  {step >= 4 && (
                    <div className="flex items-start gap-2.5">
                      <CreditCard size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-black text-slate-750 block">Payment Choice</span>
                        <span className="text-[11px] text-slate-400 font-bold block mt-0.5 uppercase">{bookingData.paymentMethod}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-rose-50/20 border border-rose-100/30 p-4.5 rounded-2xl text-xs font-bold text-slate-400 leading-relaxed">
                * Prices include premium equipment and non-toxic supplies.
              </div>
            </div>

          </div>
        ) : (
          /* Step 5: Booking Confirmed Success Screen (Extended Layout) */
          <div className="max-w-7xl mx-auto bg-white/95 p-8 sm:p-14 rounded-[40px] border border-slate-100 shadow-sm text-center space-y-10 animate-in zoom-in duration-300 w-full">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-[#FF5B60] mx-auto shadow-sm">
                <Check size={48} className="stroke-[3]" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">Booking Confirmed!</h2>
                <p className="text-sm text-slate-450 font-bold max-w-lg mx-auto leading-relaxed">
                  Please check your inbox. Our representative will contact you shortly to confirm your professional and complete delivery.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 max-w-4xl mx-auto w-full">
              {/* Order Info */}
              <div className="bg-slate-50/60 p-8 rounded-3xl border border-slate-100/50 text-left space-y-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Service Details</span>
                <div className="flex gap-4 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&auto=format&fit=crop&q=80"
                    alt="cleaning"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100"
                  />
                  <div>
                    <span className="text-sm font-black text-slate-800 block">Deep Home Cleaning</span>
                    <span className="text-xs text-slate-400 font-bold block mt-1">
                      Oct {bookingData.date}, 2024 at {bookingData.timeSlot}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-200/50 text-xs font-bold text-slate-400 leading-relaxed">
                  📍 {bookingData.addressLine}
                </div>
              </div>

              {/* Assigned Pro */}
              <div className="bg-slate-50/60 p-8 rounded-3xl border border-slate-100/50 text-left flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Assigned Professional</span>
                  <div className="flex gap-4 items-center">
                    <img
                      src={
                        bookingData.professional === "sadiya"
                          ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      }
                      alt="pro"
                      className="w-16 h-16 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                      <span className="text-sm font-black text-slate-800 block">
                        {bookingData.professional === "sadiya" ? "Sadiya Rahman" : "Kamal Hossain"}
                      </span>
                      <span className="text-xs text-amber-500 font-bold block mt-1">★ 4.9 • Expert Cleaning</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black py-3 px-4 rounded-xl border border-slate-250 transition-colors flex items-center justify-center gap-1.5 focus:outline-none">
                    <Phone size={14} /> Call Pro
                  </button>
                  <button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black py-3 px-4 rounded-xl border border-slate-250 transition-colors flex items-center justify-center gap-1.5 focus:outline-none">
                    <MessageCircle size={14} /> Chat Pro
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 max-w-md mx-auto w-full">
              <Link
                href="/dashbord/overview"
                className="w-full bg-[#FF5B60] hover:bg-[#FF464C] text-white text-xs font-black py-4 px-6 rounded-2xl shadow-sm shadow-rose-500/10 active:scale-[0.98] transition-all inline-block text-center"
              >
                Back to Home
              </Link>
              <button className="w-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-black py-4 px-6 rounded-2xl border border-slate-200 transition-colors focus:outline-none active:scale-[0.98]">
                View Booking
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function AccessDenied({ roleRequired }: { roleRequired: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
      <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 mb-4">
        <ShieldAlert size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        This subpage is only accessible to users with the <strong className="text-slate-800">{roleRequired}</strong> role. 
        Please toggle your preview role using the selector at the top.
      </p>
    </div>
  )
}
