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
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { usePathname } from "next/navigation";

const SERVICES = [
  { label: "Electrician", href: "#" },
  { label: "Plumber", href: "#" },
  { label: "AC Service", href: "#" },
  { label: "Painter", href: "#" },
  { label: "Cleaning", href: "#" },
  { label: "Carpenter", href: "#" },
  { label: "Shifting", href: "#" },
  { label: "Security", href: "#" },
];

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Help Center", href: "/help" },
  { label: "Contact Us", href: "/contact" },
  { label: "Partner with Us", href: "/partner" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com/rajseba",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/rajseba",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/8801XXXXXXXXX",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.407A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 0 1-4.031-1.094l-.29-.172-2.958.834.794-2.878-.189-.295A7.96 7.96 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@rajseba",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@rajseba",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
  },
];

const CONTACT_INFO = [
  { icon: Phone, label: "+880 1XXX-XXXXXX", href: "tel:+8801XXXXXXXXX" },
  {
    icon: Mail,
    label: "support@rajseba.com",
    href: "mailto:support@rajseba.com",
  },
  { icon: MapPin, label: "Dhaka, Bangladesh", href: "#" },
];

const STATS = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "500+", label: "Verified Providers" },
  { value: "20+", label: "Service Types" },
  { value: "4.8★", label: "Average Rating" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#FAF6F6] border-t border-slate-100 text-slate-600">
      {/* ── STATS BANNER ── */}
      {isHomepage ? (
        <div className="bg-[#FF5A5F] text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              {STATS.map((s) => (
                <div key={s.label} className="space-y-0.5">
                  <p className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-xs sm:text-sm text-rose-100 font-medium">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* ── MAIN GRID ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Col 1+2 — Brand + Contact + Social (spans 2 cols on lg) */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-5">
            <Link href="/" aria-label="Rajseba home">
              <Image
                src="/logo.png"
                alt="Rajseba"
                width={130}
                height={36}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Bangladesh's most trusted home services platform. Book verified
              professionals for all your household needs — fast, safe, and
              affordable.
            </p>

            {/* Contact Info */}
            <ul className="space-y-2.5 pt-1">
              {CONTACT_INFO.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-[#FF5A5F] transition-colors group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:border-[#FF5A5F] transition-colors">
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1 flex-wrap">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#FF5A5F] hover:border-[#FF5A5F] transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3 — Services */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Our Services
            </h3>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className="text-sm text-slate-500 hover:text-[#FF5A5F] transition-colors duration-150 flex items-center gap-2 group"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-[#FF5A5F] transition-colors flex-shrink-0"
                      aria-hidden="true"
                    />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-500 hover:text-[#FF5A5F] transition-colors duration-150 flex items-center gap-2 group"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-[#FF5A5F] transition-colors flex-shrink-0"
                      aria-hidden="true"
                    />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5 — Newsletter + App Download */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            {/* Newsletter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Newsletter
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get the latest offers and service updates in your inbox.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  You're subscribed!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 outline-none focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/10 transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full text-sm font-semibold text-white bg-[#FF5A5F] hover:bg-[#FF4449] active:scale-[0.98] py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* App Download */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Download App
              </h3>
              <div className="flex flex-col gap-2">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on Google Play"
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 hover:border-[#FF5A5F] hover:shadow-sm transition-all group"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      fill="#EA4335"
                      d="M1.22 0L13.3 12 1.22 24c-.4-.1-.72-.5-.72-1V1c0-.5.32-.9.72-1z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M17.5 8.3l-3.01 3.01L1.22 0c.18-.08.38-.1.6-.05l15.68 8.35z"
                    />
                    <path
                      fill="#4285F4"
                      d="M22.12 12c0 .56-.3 1.06-.78 1.33l-3.84 2.04-3.41-3.37 3.41-3.41 3.84 2.08c.48.27.78.77.78 1.33z"
                    />
                    <path
                      fill="#34A853"
                      d="M1.22 24c.18.07.38.09.6.04l15.68-8.35-3.01-3.01L1.22 24z"
                    />
                  </svg>
                  <div>
                    <p className="text-[10px] text-slate-400 leading-none">
                      Get it on
                    </p>
                    <p className="text-[13px] font-semibold text-slate-700 group-hover:text-[#FF5A5F] transition-colors leading-tight">
                      Google Play
                    </p>
                  </div>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on the App Store"
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 hover:border-[#FF5A5F] hover:shadow-sm transition-all group"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-slate-700 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div>
                    <p className="text-[10px] text-slate-400 leading-none">
                      Download on the
                    </p>
                    <p className="text-[13px] font-semibold text-slate-700 group-hover:text-[#FF5A5F] transition-colors leading-tight">
                      App Store
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-slate-100 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col-reverse sm:flex-row-reverse items-center justify-between gap-3">
          {/* Copyright notice label */}
          <div className="text-center md:text-right text-sm text-slate-500 font-medium">
            <span>
              © {new Date().getFullYear()}{" "}
              <span className="font-bold">Rajsheba.</span> All rights reserved
            </span>
            <p>
              Design & Developed by{" "}
              <span className="text-primary font-semibold hover:text-secondary">
                <Link href={"https://jevxo-core-ecosystem.vercel.app/"}>
                  Jevxo
                </Link>
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://rajseba.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#FF5A5F] rounded-full flex items-center justify-center transition-colors duration-200 active:scale-95"
            >
              <Globe size={15} />
            </a>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: "Rajseba",
                      text: "Premium Home Services in Bangladesh",
                      url: window.location.origin,
                    })
                    .catch(console.error);
                } else {
                  navigator.clipboard.writeText(window.location.origin);
                  toast.success("Link copied!");
                }
              }}
              aria-label="Share"
              className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#FF5A5F] rounded-full flex items-center justify-center transition-colors duration-200 active:scale-95"
            >
              <Share2 size={15} />
            </button>
            <Link
              href="/dashboard/support"
              aria-label="Support chat"
              className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#FF5A5F] rounded-full flex items-center justify-center transition-colors duration-200 active:scale-95"
            >
              <MessageSquare size={15} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
