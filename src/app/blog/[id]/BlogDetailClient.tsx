"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  User as UserIcon,
  Calendar as CalendarIcon,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

const BLOG_POSTS = [
  {
    id: 1,
    title: "Complete Guide to Readying Your AC for Summer",
    category: "AC Maintenance",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?q=80&w=800&auto=format&fit=crop",
    summary: "Learn the key steps to clean filters, check refrigerant levels, and optimize efficiency before the hot season hits.",
    author: "Mahbubur Rahman",
    role: "AC Service Lead",
    readTime: "5 min read",
    date: "July 10, 2026",
    content: [
      "As temperatures climb, having a reliable AC is vital to keep your home comfortable. Neglecting proper checkups can lead to poor air quality, higher electric bills, and unexpected breakdowns when you need cooling the most.",
      "1. Clean or Replace Air Filters: Over time, dust, pollen, and pet hair block airflow and reduce system efficiency. Washable filters should be cleaned every month, while disposable ones should be replaced.",
      "2. Clear the Outdoor Unit: Ensure that the external compressor unit is free of leaves, dirt, and debris. Maintain a 2-foot clearance around the unit to ensure unimpeded air circulation.",
      "3. Inspect Condensation Lines: Check the drain pipe to ensure condensation flows freely. A blocked drain line can cause water damage and ice formation on the coils.",
      "4. Professional Maintenance: Have a professional technician perform a deep wash and verify refrigerant charge to make sure everything runs at peak efficiency. Rajseba offers top-grade AC jet washing services by certified experts."
    ]
  },
  {
    id: 2,
    title: "10 Packing Hacks for a Stress-Free Shifting Day",
    category: "Home Shifting",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    summary: "Packing up your entire life can be overwhelming. These professional shifting secrets will save you hours and prevent damage.",
    author: "Kabir Hossain",
    role: "Shifting Specialist",
    readTime: "6 min read",
    date: "July 08, 2026",
    content: [
      "Moving to a new home is exciting but logistically complex. The key to a successful, damage-free shifting day lies in careful planning and smart techniques.",
      "1. Declutter Before Packing: Don't spend time packing things you no longer need. Donate, sell, or discard items before shifting.",
      "2. Pack an Essentials Box: Keep daily necessities (toiletries, changes of clothes, chargers, basic tools, and important documents) in a separate box that travels with you directly.",
      "3. Use Quality Boxes and Bubble Wrap: Cheap boxes can collapse during transit. Secure heavy items at the bottom and use bubble wrap generously for fragile glassware.",
      "4. Label Every Box: Write the destination room and a brief summary of contents on the side of every box. This makes unloading and sorting a breeze.",
      "5. Trust the Professionals: Hiring professional packing and shifting services guarantees safe transport, proper moving vehicles, and experienced personnel. Rajseba provides end-to-end home and office shifting services across Bangladesh."
    ]
  },
  {
    id: 3,
    title: "The Hidden Benefits of Professional Deep Cleaning",
    category: "Deep Cleaning",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
    summary: "Standard vacuuming only goes surface-deep. Discover how professional sanitization improves indoor air quality and allergen control.",
    author: "Sarah Islam",
    role: "Hygiene Consultant",
    readTime: "4 min read",
    date: "July 05, 2026",
    content: [
      "While daily sweeping keeps dust at bay, dangerous pathogens, allergens, and stubborn grime build up in hidden corners of your home.",
      "1. Elimination of Allergens: Dust mites, pet dander, and mold thrive in carpets and upholstery. Deep steam cleaning eliminates these triggers, making it safer for children and asthma patients.",
      "2. Safe Sanitization: Professional cleaning uses eco-friendly, non-toxic disinfectants that thoroughly sanitize surfaces without leaving harmful chemical residues.",
      "3. Prolongs Appliance & Material Life: Regular deep scrubbing removes rust, limescale, and grime from bathroom fixtures, kitchen hoods, and tiles, extending their operational lifespan.",
      "4. Peace of Mind: A pristine home reduces stress and boosts mental clarity. Let Rajseba's specialized deep cleaning experts handle the work so you can relax."
    ]
  },
  {
    id: 4,
    title: "Why Water Purifier Filters Need Regular Replacement",
    category: "Water Care",
    image: "https://images.unsplash.com/photo-1609842947419-ba4f74d081f2?q=80&w=800&auto=format&fit=crop",
    summary: "Drinking pure water is essential for your family's health. Learn the signs that your purifier system needs immediate servicing.",
    author: "Dr. N. Hasan",
    role: "Health Advocate",
    readTime: "3 min read",
    date: "July 02, 2026",
    content: [
      "A home water purifier is only as good as its filters. Once filters reach capacity, they can no longer trap contaminants and may even harbor bacterial growth.",
      "1. Reduced Flow Rate: If water flows very slowly from your purifier, it usually indicates that sediment filters are clogged with mud, rust, and suspended particles.",
      "2. Changes in Taste or Odor: Activated carbon filters absorb chlorine and organic compounds. If your water tastes metallic or smells odd, it's time to replace the carbon cartridge immediately.",
      "3. RO Membrane Wear: The Reverse Osmosis membrane filters out heavy metals and dissolved salts. Regular filter replacements protect the expensive RO membrane from premature failure.",
      "4. Schedule Maintenance: Most systems require filter changes every 6 to 12 months. Book a certified Rajseba water purifier technician to ensure clean water always."
    ]
  },
  {
    id: 5,
    title: "Common Electrical Safety Hazards in Old Homes",
    category: "Electrical",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    summary: "Flickering lights and warm outlets aren't just minor annoyances—they're potential fire hazards. Learn what to inspect.",
    author: "Arif Ahmed",
    role: "Master Electrician",
    readTime: "5 min read",
    date: "June 28, 2026",
    content: [
      "Electrical issues are major causes of home fires. Understanding safety hazards, particularly in older houses, is critical for family safety.",
      "1. Overloaded Outlets: Plugging too many high-wattage appliances into a single power strip can overheat wires and cause melting or fires.",
      "2. Flickering Lights: This usually points to loose wiring connections. If left unchecked, it can lead to sparking and short circuits.",
      "3. Warm Outlets or Switches: If an outlet feels warm to the touch, unplug appliances immediately. It is a critical warning sign of faulty connections.",
      "4. Lack of GFCI Outlets: Kitchens and bathrooms should have Ground Fault Circuit Interrupter (GFCI) outlets to protect against shocks. Book an inspection with a Rajseba certified electrician to keep your home safe."
    ]
  },
  {
    id: 6,
    title: "How to Protect Your Wooden Sofa from Monsoon Moisture",
    category: "Sofa Care",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop",
    summary: "High humidity can cause mold and fabric deterioration. Professional steam cleaning and polish can safeguard your furniture investment.",
    author: "Rashedul Karim",
    role: "Furniture Expert",
    readTime: "4 min read",
    date: "June 25, 2026",
    content: [
      "Monsoons bring high humidity, causing wood to swell, joints to weaken, and mold to grow on sofa fabrics.",
      "1. Keep Away from Walls: Don't push your wooden furniture flat against walls. Leave a 3 to 4-inch gap to allow airflow and prevent moisture transfer.",
      "2. Regular Dusting: Dust absorbs moisture. Wiping furniture with a dry microfiber cloth helps prevent mold spores from settling.",
      "3. Use Dehumidifiers: Keep rooms well-ventilated or use a dehumidifier to keep indoor moisture levels in check.",
      "4. Upholstery Steam Cleaning: Professional steam cleaning sanitizes fabric, kills mold spores, and removes deep dirt. Rajseba sofa cleaning experts offer premium restoration services."
    ]
  }
];

export default function BlogDetailClient({ id }: { id: number }) {
  const post = BLOG_POSTS.find((p) => p.id === id) || BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-[#FFFDFB] font-sans pb-24">
      {/* ─── HEADER BAR ─── */}
      <div className="bg-white border-b border-slate-100 py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-[#FF6014] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Rajseba Knowledge Article
          </span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 mt-8 md:mt-12 space-y-8">
        {/* Article Metadata */}
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF4EE] border border-[#FF6014]/20 px-3 py-1 rounded-full text-[10px] font-bold text-[#FF6014] uppercase tracking-wider">
            <Sparkles size={12} /> {post.category}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-snug">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-450 font-bold uppercase tracking-wider border-b border-slate-100 pb-6 pt-2">
            <span className="flex items-center gap-1"><CalendarIcon size={13} className="text-[#FF6014]" /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock size={13} className="text-[#FF6014]" /> {post.readTime}</span>
            <span className="flex items-center gap-1"><UserIcon size={13} className="text-[#FF6014]" /> {post.author}</span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative h-[250px] sm:h-[400px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
          />
        </div>

        {/* Article Content */}
        <div className="grid md:grid-cols-12 gap-8 pt-4">
          <div className="md:col-span-8 space-y-6 text-slate-700 text-sm md:text-base leading-relaxed font-medium">
            {post.content.map((paragraph, i) => (
              <p key={i} className={i === 0 ? "text-slate-900 font-semibold text-base sm:text-lg leading-relaxed mb-8" : ""}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-[#FFF9F6] to-[#FFF1E9] border border-orange-100 rounded-3xl p-6 space-y-4">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#FF6014]" /> Rajseba Care
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Need professional help with your home maintenance? Our certified team is ready.
              </p>
              <div className="space-y-2 pt-2">
                <Link
                  href="/services"
                  className="w-full flex items-center justify-center gap-1.5 bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-orange-500/10"
                >
                  Book Service Now
                </Link>
                <a
                  href="tel:01813333373"
                  className="w-full flex items-center justify-center gap-1.5 bg-white border border-orange-150 hover:bg-orange-50/50 text-[#FF6014] text-xs font-bold py-2.5 rounded-xl transition-all"
                >
                  Call Hotline
                </a>
              </div>
            </div>

            <div className="bg-white border border-slate-150 rounded-3xl p-6 space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">About The Author</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6014]">
                  <UserIcon size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{post.author}</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{post.role}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
                Expert contributor at Rajseba helping households maintain healthy and happy living spaces.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
