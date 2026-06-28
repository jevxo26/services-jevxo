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
  { icon: Phone, label: "+880 1XXX-XXXXXX", href: "tel:+8801XXXXXXXXX" },
  { icon: Mail, label: "support@rajseba.com", href: "mailto:support@rajseba.com" },
  { icon: MapPin, label: "Dhaka, Bangladesh", href: "#" },
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
  { Icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/8801XXXXXXXXX" },
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
    <footer className="relative border-t border-slate-200/60 bg-white/60 backdrop-blur-xl">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {/* ── Brand ── */}
          <div className="col-span-2 md:col-span-1 space-y-5 -mt-4">
            <Link href="/" aria-label="Rajseba home">
              <Image
                src="/logo.png"
                alt="Rajseba"
                width={120}
                height={40}
                style={{ width: "auto", height: "auto" }}
                className="h-9 object-contain"
                priority
              />
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed">
              Bangladesh's most trusted home services platform. Fast, safe, and affordable.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-1.5">
              {APP_FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1 bg-white/70 border border-slate-200/80 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  <Icon className="w-3 h-3 text-[#FF6014]" />
                  {label}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 bg-white/70 border border-slate-200/80 rounded-full flex items-center justify-center text-slate-400 hover:text-[#FF6014] hover:border-[#FF6014]/40 transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ── Categories ── */}
          <div className="col-span-1 space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Categories
            </h3>
            <ul className="space-y-2">
              {apiCategories.length > 0
                ? apiCategories.map((cat: any) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categories/${cat.id}`}
                      className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#FF6014] transition-colors group"
                    >
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#FF6014] flex-shrink-0 transition-colors" />
                      <span className="line-clamp-1">{cat.name}</span>
                    </Link>
                  </li>
                ))
                : [1, 2, 3, 4, 5, 6].map((n) => (
                  <li key={n} className="h-3.5 bg-slate-100 rounded animate-pulse w-3/4" />
                ))}
            </ul>
          </div>

          {/* ── Quick Links ── */}
          <div className="col-span-1 space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#FF6014] transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#FF6014] flex-shrink-0 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact + Newsletter ── */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Get in Touch
            </h3>

            <ul className="space-y-2.5">
              {CONTACT_INFO.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-[#FF6014] transition-colors group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white/70 border border-slate-200/80 flex items-center justify-center flex-shrink-0 group-hover:border-[#FF6014]/40 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="pt-1 space-y-2">
              <p className="text-sm text-slate-400 font-medium">
                Get offers & updates
              </p>
              {subscribed ? (
                <div className="text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-sm">
                  ✅ Subscribed!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200/80 bg-white/70 text-sm focus:border-[#FF6014]/50 focus:outline-none transition-colors placeholder:text-slate-300"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#FF6014] hover:bg-[#e0530a] text-white text-sm font-semibold rounded-xl transition-all flex-shrink-0"
                  >
                    Subscribed
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-slate-200/60 bg-white/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-slate-600">
            <span className="font-semibold">
              © {new Date().getFullYear()} Rajseba
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-600">
              Developed by{" "}
              <Link
                href="https://jevxo-core-ecosystem.vercel.app/"
                target="_blank"
                className="text-[#FF6014] font-semibold hover:underline"
              >
                Jevxo
              </Link>
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <Link href="/privacy" className="hover:text-[#FF6014] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#FF6014] transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-[#FF6014] transition-colors">
              Support
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="https://rajseba.com"
              target="_blank"
              aria-label="Visit website"
              className="w-7 h-7 bg-white/70 border border-slate-200/80 rounded-full flex items-center justify-center text-slate-400 hover:text-[#FF6014] hover:border-[#FF6014]/40 transition-all"
            >
              <Globe size={13} />
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
              className="w-7 h-7 bg-white/70 border border-slate-200/80 rounded-full flex items-center justify-center text-slate-400 hover:text-[#FF6014] hover:border-[#FF6014]/40 transition-all"
              aria-label="Share"
            >
              <Share2 size={13} />
            </button>
            <Link
              href="/dashbord/live-chat"
              aria-label="Live Chat"
              className="w-7 h-7 bg-white/70 border border-slate-200/80 rounded-full flex items-center justify-center text-slate-400 hover:text-[#FF6014] hover:border-[#FF6014]/40 transition-all"
            >
              <MessageSquare size={13} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}