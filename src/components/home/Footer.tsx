"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  Share2,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Star,
  Calendar,
  Heart,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useGetPublicCategoriesQuery } from "@/redux/features/landing/landingApi";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Services", href: "/services" },
  { label: "Book a Service", href: "/bookings" },
  { label: "Track Booking", href: "/bookings" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Help Center", href: "/help" },
];

const CONTACT_INFO = [
  { icon: Phone, label: "+880 9612-725732", href: "tel:+8809612725732" },
  { icon: Mail, label: "support@rajseba.com", href: "mailto:support@rajseba.com" },
  { icon: MapPin, label: "Banani, Dhaka, Bangladesh", href: "https://maps.google.com/?q=Banani+Dhaka" },
];

const APP_FEATURES = [
  { icon: ShieldCheck, label: "Verified Pros" },
  { icon: Star, label: "4.9★ Rated" },
  { icon: Calendar, label: "Easy Booking" },
  { icon: Heart, label: "Saved Services" },
];

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SOCIALS = [
  { Icon: FacebookIcon, label: "Facebook", href: "https://facebook.com/rajseba" },
  { Icon: InstagramIcon, label: "Instagram", href: "https://instagram.com/rajseba" },
  { Icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/8809612725732" },
  { Icon: YoutubeIcon, label: "YouTube", href: "https://youtube.com/@rajseba" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { data: categoriesRes } = useGetPublicCategoriesQuery();
  const apiCategories: any[] = (
    categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : [])
  ).slice(0, 7);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      toast.success("You're subscribed!");
    }
  };

  return (
    <footer className="relative  bg-gradient-to-b pt-5 from-white/95 to-[#FFFDFB]/95 backdrop-blur-xl md:pb-0 pb-[calc(env(safe-area-inset-bottom)+80px)] overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF6014]/40 to-transparent" />

      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FF6014]/2 blur-[100px] rounded-full pointer-events-none" />

      {/* Main grid */}
      <div className="w-full max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 pt-4 pb-8 md:py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-10 md:gap-x-8">
          {/* ── Brand (4/12 columns on desktop, full width on mobile) ── */}
          <div className="col-span-2 md:col-span-4 space-y-6">
            <Link href="/" aria-label="Rajseba home" className="inline-block hover:opacity-90 transition-opacity">
              <Image
                src="/logo.png"
                alt="Rajseba"
                width={125}
                height={42}
                style={{ width: "auto", height: "auto" }}
                className="h-10 object-contain"
                priority
              />
            </Link>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Bangladesh's most trusted home services platform. Fast, safe, and affordable.
            </p>

            {/* Feature pills grid (2 columns) */}
            <div className="grid grid-cols-2 gap-2 max-w-sm">
              {APP_FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-white border border-slate-100 hover:border-rose-100/80 rounded-xl px-2.5 py-2 text-slate-700 text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.015)] transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5 text-[#FF6014] shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-1">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-white border border-slate-100 hover:border-[#FF6014]/40 hover:shadow-[0_4px_12px_rgba(255,96,20,0.1)] rounded-xl flex items-center justify-center text-slate-400 hover:text-[#FF6014] transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ── Categories (1/2 on mobile, 3/12 on desktop) ── */}
          <div className="col-span-1 md:col-span-3 space-y-5">
            <h3 className="text-xs font-extrabold tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014]" />
              Categories
            </h3>
            <ul className="space-y-2.5">
              {apiCategories.length > 0
                ? apiCategories.map((cat: any) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categories/${cat.id}`}
                      className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-[#FF6014] transition-all duration-200 group/link"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/link:text-[#FF6014] group-hover/link:translate-x-0.5 flex-shrink-0 transition-all duration-200" />
                      <span className="line-clamp-1">{cat.name}</span>
                    </Link>
                  </li>
                ))
                : [1, 2, 3, 4, 5, 6].map((n) => (
                  <li key={n} className="h-3.5 bg-slate-100 rounded animate-pulse w-3/4" />
                ))}
            </ul>
          </div>

          {/* ── Quick Links (1/2 on mobile, 2/12 on desktop) ── */}
          <div className="col-span-1 md:col-span-2 space-y-5">
            <h3 className="text-xs font-extrabold tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014]" />
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-[#FF6014] transition-all duration-200 group/link"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/link:text-[#FF6014] group-hover/link:translate-x-0.5 flex-shrink-0 transition-all duration-200" />
                    <span>{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact & Newsletter (full width on mobile, 3/12 on desktop) ── */}
          <div className="col-span-2 md:col-span-3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014]" />
                  Get in Touch
                </h3>

                <ul className="space-y-3">
                  {CONTACT_INFO.map(({ icon: Icon, label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-3 text-[13px] text-slate-500 hover:text-[#FF6014] transition-all duration-200 group/item"
                      >
                        <span className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 group-item:border-[#FF6014]/20 group-item:bg-[#FF6014]/5 text-slate-400 group-item:text-[#FF6014] transition-all duration-300">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="font-medium">{label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700">
                  Subscribe to our Newsletter
                </h4>
                {subscribed ? (
                  <div className="text-emerald-600 font-semibold bg-emerald-50/50 border border-emerald-100 rounded-xl px-3.5 py-2.5 text-xs flex items-center gap-2">
                    <span>✅</span> Subscribed successfully!
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 placeholder-slate-400 focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/10 focus:outline-none transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#FF6014] hover:bg-[#E0530A] hover:shadow-[0_4px_12px_rgba(255,96,20,0.2)] text-white text-xs font-bold rounded-xl transition-all duration-300"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-slate-200/50 bg-slate-50/40 backdrop-blur-md relative z-10">
        <div className="w-full max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
            <span>
              © {new Date().getFullYear()} Rajseba. All rights reserved.
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span>
              Developed by{" "}
              <Link
                href="https://www.jevxo.com"
                target="_blank"
                className="text-[#FF6014] font-semibold hover:underline"
              >
                Jevxo
              </Link>
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <Link href="/privacy" className="hover:text-[#FF6014] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-200 hidden sm:inline">•</span>
            <Link href="/terms" className="hover:text-[#FF6014] transition-colors">
              Terms of Service
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://rajseba.com"
              target="_blank"
              aria-label="Visit website"
              className="w-8 h-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#FF6014] hover:border-[#FF6014]/20 transition-all duration-200"
            >
              <Globe size={14} />
            </a>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Rajseba",
                    text: "Premium Home Services in Bangladesh",
                    url: window.location.origin,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.origin);
                  toast.success("Link copied!");
                }
              }}
              className="w-8 h-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#FF6014] hover:border-[#FF6014]/20 transition-all duration-200"
              aria-label="Share"
            >
              <Share2 size={14} />
            </button>
            <Link
              href="/dashbord/live-chat"
              aria-label="Live Chat"
              className="w-8 h-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#FF6014] hover:border-[#FF6014]/20 transition-all duration-200"
            >
              <MessageSquare size={14} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}