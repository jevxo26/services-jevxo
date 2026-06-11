"use client"

import * as React from "react"
import Link from "next/link"
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  Star,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Menu,
  X,
  Wind,
  Droplets,
  Sparkles,
  Zap,
  Truck,
  Video,
  Tv,
  Paintbrush,
  Bookmark,
  ChevronDown
} from "lucide-react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState("AC Repair")
  const [selectedLocation, setSelectedLocation] = React.useState("Dhaka")

  // Mock categories data matching explore categories icons
  const categories = [
    { name: "AC Repair", icon: Wind, color: "text-rose-500 bg-rose-50 border-rose-100" },
    { name: "Plumbing", icon: Droplets, color: "text-blue-500 bg-blue-50 border-blue-100" },
    { name: "Cleaning", icon: Sparkles, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
    { name: "Electrical", icon: Zap, color: "text-amber-500 bg-amber-50 border-amber-100" },
    { name: "Shifting", icon: Truck, color: "text-purple-500 bg-purple-50 border-purple-100" },
    { name: "CCTV", icon: Video, color: "text-indigo-500 bg-indigo-50 border-indigo-100" },
    { name: "Appliance Repair", icon: Tv, color: "text-teal-500 bg-teal-50 border-teal-100" },
    { name: "Painting", icon: Paintbrush, color: "text-orange-500 bg-orange-50 border-orange-100" },
  ]

  // Top rated services data
  const topServices = [
    {
      id: 1,
      title: "Dhaka Cool Experts",
      category: "AC Servicing & Gas Refill",
      rating: 4.9,
      price: "৳750",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      title: "ProFlow Plumbing",
      category: "Kitchen & Bathroom Specialist",
      rating: 4.8,
      price: "৳500",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      title: "Sparkle Home Care",
      category: "Sofa Cleaning & Sanitization",
      rating: 5.0,
      price: "৳800",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      title: "VoltGuard Solutions",
      category: "Full Home Wiring & Panel Fix",
      rating: 4.7,
      price: "৳890",
      image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=500&auto=format&fit=crop&q=80",
    },
  ]

  // Testimonials data
  const testimonials = [
    {
      name: "Mithun Hamid",
      avatar: "MH",
      rating: 5,
      review: "The AC service was professional and on time. Best experience in Dhaka so far.",
    },
    {
      name: "Mahzabin R.",
      avatar: "MR",
      rating: 5,
      review: "Finding a reliable plumber was impossible before Rajseba. Life-changing app!",
    },
    {
      name: "Saif Islam",
      avatar: "SI",
      rating: 5,
      review: "Fast, reliable and high-quality cleaning service. I highly recommend them to everyone.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans selection:bg-rose-100 selection:text-rose-600">
      
      {/* 1. Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 focus:outline-none">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Raj<span className="text-rose-500">seba</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/" className="text-rose-500 hover:text-rose-600 transition-colors">Home</Link>
            <Link href="/dashbord" className="hover:text-rose-500 transition-colors">Services</Link>
            <Link href="/dashbord" className="hover:text-rose-500 transition-colors">Bookings</Link>
            <Link href="/dashbord" className="hover:text-rose-500 transition-colors">Profile</Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashbord"
              className="text-sm font-bold text-slate-700 hover:text-rose-500 px-4 py-2 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/dashbord"
              className="bg-gradient-to-r from-rose-500 to-[#FF464C] hover:opacity-95 text-white text-sm font-extrabold px-6 py-2.5 rounded-full shadow-md shadow-rose-500/10 transition-all active:scale-[0.98]"
            >
              Signup
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-4 text-sm font-bold text-slate-700">
              <Link href="/" className="text-rose-500">Home</Link>
              <Link href="/dashbord" onClick={() => setMobileMenuOpen(false)}>Services</Link>
              <Link href="/dashbord" onClick={() => setMobileMenuOpen(false)}>Bookings</Link>
              <Link href="/dashbord" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
            </nav>
            <div className="h-px bg-slate-100 w-full" />
            <div className="flex flex-col gap-3">
              <Link
                href="/dashbord"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center font-bold text-slate-700 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/dashbord"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-gradient-to-r from-rose-500 to-[#FF464C] text-white font-extrabold py-2.5 rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                Signup
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/40 via-white to-slate-50/30 pt-10 pb-20 lg:pt-16 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Expert Home <span className="text-rose-500">Services</span>, Simplified.
              </h1>
              <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 font-medium">
                Premium marketplace for all your household needs in Bangladesh. Book verified professionals in just a few clicks.
              </p>

              {/* Booking/Search Box */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5 max-w-2xl mx-auto lg:mx-0 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  
                  {/* Category Dropdown */}
                  <div className="relative">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 px-1">Service</label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl pl-3 pr-8 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-rose-300 transition-all cursor-pointer appearance-none"
                      >
                        <option>AC Repair</option>
                        <option>Plumbing</option>
                        <option>Cleaning</option>
                        <option>Electrical</option>
                        <option>Appliance Repair</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Location Dropdown */}
                  <div className="relative">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 px-1">Location</label>
                    <div className="relative">
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl pl-3 pr-8 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-rose-300 transition-all cursor-pointer appearance-none"
                      >
                        <option>Dhaka</option>
                        <option>Chittagong</option>
                        <option>Sylhet</option>
                        <option>Rajshahi</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Date Selector */}
                  <div className="relative">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 px-1">Date</label>
                    <Link
                      href="/dashbord/quick-booking"
                      className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 focus:outline-none flex items-center justify-between transition-all"
                    >
                      <span>Select Date</span>
                      <Calendar size={14} className="text-slate-400" />
                    </Link>
                  </div>

                </div>

                <div className="mt-4 pt-4 border-t border-slate-100/80 flex justify-end">
                  <Link
                    href="/dashbord/quick-booking"
                    className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-[#FF464C] hover:opacity-95 text-white text-sm font-extrabold px-8 py-3 rounded-xl shadow-lg shadow-rose-500/15 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                  >
                    <Search size={16} /> Book Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Graphic/Illustration */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="aspect-square bg-gradient-to-br from-rose-100/50 to-orange-100/40 rounded-full absolute -inset-4 blur-2xl -z-10" />
              <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-2xl relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80"
                  alt="Expert service provider cleaning room"
                  className="rounded-[24px] w-full h-[400px] object-cover"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-100/50 shadow-lg flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">100% Verified Crew</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Top-rated home care partners</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Explore Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Explore Categories</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold">Browse handpicked services ready to book</p>
          </div>
          <Link href="/dashbord" className="text-xs sm:text-sm font-bold text-rose-500 hover:underline flex items-center gap-0.5">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                href="/dashbord/quick-booking"
                className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-rose-100 hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 group"
              >
                <div className={`p-3.5 rounded-2xl ${cat.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={24} />
                </div>
                <span className="text-xs font-bold text-slate-700 tracking-tight">{cat.name}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 4. Top Rated Services */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">Top Rated Services</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold">Handpicked vendors with the highest customer satisfaction.</p>
            </div>
            <Link href="/dashbord" className="text-xs sm:text-sm font-bold text-rose-500 hover:underline">
              Show All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group relative"
              >
                {/* Card Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <CheckCircle2 size={10} /> Verified
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-500 hover:text-rose-500 transition-colors shadow-sm focus:outline-none">
                    <Bookmark size={14} className="fill-current" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{service.category}</span>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                        <Star size={12} className="fill-current" /> {service.rating}
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">{service.title}</h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div>
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Starting at</span>
                      <span className="text-sm font-black text-slate-800">{service.price}</span>
                    </div>
                    <Link
                      href="/dashbord/quick-booking"
                      className="bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200"
                    >
                      Book Service
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Why Choose Us</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold">Because we care about your safety and convenience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Verified Professionals",
              desc: "Every service provider undergoes a rigorous multi-step background and skill check.",
              icon: ShieldCheck,
              color: "text-rose-500 bg-rose-50",
            },
            {
              title: "Safe Payments",
              desc: "Secure transactions using leading mobile wallets and online banking protocols.",
              icon: CreditCard,
              color: "text-blue-500 bg-blue-50",
            },
            {
              title: "Quality Guarantee",
              desc: "We ensure the highest level of care. If something isn't right, we will make it perfect.",
              icon: CheckCircle2,
              color: "text-emerald-500 bg-emerald-50",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className={`p-4 rounded-full ${item.color}`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 6. How It Works */}
      <section className="bg-slate-50 py-16 sm:py-24 space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">How it works</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold">Easiest and fastest way to get your service</p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          {/* Connector Line */}
          <div className="absolute top-10 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-rose-100 hidden md:block -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { step: 1, title: "Select Service", desc: "Choose from 100+ professional home services." },
              { step: 2, title: "Schedule", desc: "Pick a date and time slot that fits your lifestyle perfectly." },
              { step: 3, title: "Get Service", desc: "Relax while our experts handle everything for you." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg shadow-rose-500/20">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-2">{s.title}</h3>
                <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed font-semibold">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Real Happy Customers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest block mb-1">Some Happy Faces</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Real Happy Customers, Real Stories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{t.name}</h4>
                  <div className="flex gap-0.5 text-amber-500 mt-0.5">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} size={10} className="fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed italic">
                "{t.review}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Download Our App Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-gradient-to-br from-rose-500 to-[#FF464C] rounded-[40px] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-xl shadow-rose-500/10">
          
          {/* Abstract circles */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-2xl" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            
            {/* Text details */}
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none">
                Download Our App
              </h2>
              <p className="text-sm sm:text-base text-rose-50/90 font-medium max-w-md mx-auto lg:mx-0">
                Any Service, Any Time, Anywhere. Access Bangladesh's best home services marketplace right from your smartphone.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#"
                  className="bg-black text-white px-5 py-2.5 rounded-xl flex items-center gap-2 border border-white/10 hover:bg-zinc-900 transition-colors"
                >
                  <Smartphone size={20} />
                  <div className="text-left">
                    <span className="text-[9px] block opacity-60">GET IT ON</span>
                    <span className="text-xs font-bold block leading-none">Google Play</span>
                  </div>
                </a>

                <a
                  href="#"
                  className="bg-black text-white px-5 py-2.5 rounded-xl flex items-center gap-2 border border-white/10 hover:bg-zinc-900 transition-colors"
                >
                  <Smartphone size={20} />
                  <div className="text-left">
                    <span className="text-[9px] block opacity-60">Download on the</span>
                    <span className="text-xs font-bold block leading-none">App Store</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Smartphone Graphic Mock */}
            <div className="flex justify-center relative">
              <div className="w-56 h-[340px] bg-slate-950 border-4 border-slate-800 rounded-[36px] shadow-2xl relative overflow-hidden hidden sm:block">
                {/* Phone Speaker Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-800 rounded-full z-20" />
                {/* Phone Screen Gradient */}
                <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-rose-950 to-rose-900 flex flex-col justify-between p-4 relative">
                  <div className="text-center pt-8">
                    <span className="text-white font-black text-lg">Rajseba</span>
                    <p className="text-[8px] text-rose-200 mt-1 uppercase tracking-widest font-bold">App Active</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-left">
                    <span className="text-[8px] text-white/60 block">Active Bookings</span>
                    <span className="text-xs font-bold text-white block mt-0.5">AC Repair arriving today</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Footer Section */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <span className="text-xl font-black text-white">Rajseba</span>
            <p className="text-xs leading-relaxed max-w-xs">
              Bangladesh's premium on-demand service marketplace connecting top technicians with home owners.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/dashbord" className="hover:text-white transition-colors">Services Directory</Link></li>
              <li><Link href="/dashbord" className="hover:text-white transition-colors">Agent Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Contact Info</h4>
            <ul className="space-y-2 text-xs">
              <li>Support: support@rajseba.com</li>
              <li>Hotline: +880 9612 345678</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 text-white w-full"
              />
              <button className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 rounded-xl transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Rajseba. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
