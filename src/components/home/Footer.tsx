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
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Book a Service", href: "/bookings" },
  { label: "Become a Partner", href: "/opportunity" },
  { label: "Contact Us", href: "/contact" },
  { label: "Terms of Service", href: "/terms" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Home Shifting", href: "/home-shifting" },
  { label: "Track Booking", href: "/track" },
  { label: "Help Center", href: "/help" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Blog", href: "/blog" },
];

const CONTACT_INFO = [
  { icon: Phone, label: "01813-333373", href: "tel:01813333373" },
  { icon: Mail, label: "info@rajseba.com", href: "mailto:info@rajseba.com" },
  { icon: MapPin, label: "Rajshahi High-tech Park, Bangladesh", href: "https://maps.google.com/?q=Rajshahi+High-tech+Park" },
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
  {
    Icon: FacebookIcon,
    label: "Facebook",
    href: "https://facebook.com/rajseba",
    hoverClass: "hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:shadow-[0_4px_12px_rgba(24,119,242,0.15)]"
  },
  {
    Icon: InstagramIcon,
    label: "Instagram",
    href: "https://instagram.com/rajseba",
    hoverClass: "hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:shadow-[0_4px_12px_rgba(228,64,95,0.15)]"
  },
  {
    Icon: WhatsAppIcon,
    label: "WhatsApp",
    href: "https://wa.me/8801813333373",
    hoverClass: "hover:text-[#25D366] hover:border-[#25D366]/40 hover:shadow-[0_4px_12px_rgba(37,211,102,0.15)]"
  },
  {
    Icon: YoutubeIcon,
    label: "YouTube",
    href: "https://youtube.com/@rajseba",
    hoverClass: "hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:shadow-[0_4px_12px_rgba(255,0,0,0.15)]"
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

function FooterLinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[13px] font-extrabold tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014]" />
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="flex items-center gap-1.5 text-[13px] text-slate-600 hover:text-[#FF6014] transition-all duration-200 group/link"
            >
              <ChevronRight className="w-4 h-4 text-[#FF6014] group-hover/link:translate-x-1 flex-shrink-0 transition-all duration-200" />
              <span>{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      toast.success("You're subscribed!");
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-white/95 to-[#FFFDFB]/95 backdrop-blur-xl pt-5 md:pb-0 pb-[calc(env(safe-area-inset-bottom)+80px)] overflow-hidden text-[15px] leading-normal">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF6014]/40 to-transparent" />

      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FF6014]/2 blur-[100px] rounded-full pointer-events-none" />

      {/* Main grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="w-full max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 pt-6 pb-8 md:pt-12 md:pb-16 relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-10 md:gap-x-8 lg:gap-x-10">
          {/* ── Brand (4/12 columns on desktop, full width on mobile) ── */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-4 space-y-4">
            <Link href="/" aria-label="Rajseba home" className="inline-block hover:opacity-90 transition-opacity">
              <Image
                src="/logo.png"
                alt="Rajseba"
                width={100}
                height={48}
                style={{ width: "auto", height: "auto" }}
                className="h-11 object-contain"
                priority
              />
            </Link>

            <p className="text-[13px] text-slate-600 leading-relaxed max-w-sm">
              Bangladesh's leading service marketplace, connecting you with verified professionals for shifting, cleaning, and home maintenance. Fast, safe, and reliable.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-1">
              {SOCIALS.map(({ Icon, label, href, hoverClass }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 transition-all duration-300 shrink-0 ${hoverClass}`}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── Quick Links (own title) ── */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
            <FooterLinkColumn title="Quick Links" links={QUICK_LINKS} />
          </motion.div>

          {/* ── Company (own title, previously untitled) ── */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
            <FooterLinkColumn title="Company" links={COMPANY_LINKS} />
          </motion.div>

          {/* ── Get in Touch ── */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-2 space-y-4 max-w-sm">
            <h3 className="text-[13px] font-extrabold tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014]" />
              Get in Touch
            </h3>

            <ul className="space-y-2.5">
              {CONTACT_INFO.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 text-[13px] text-slate-600 hover:text-[#FF6014] transition-all duration-200 group/item"
                  >
                    <motion.span
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover/item:border-[#FF6014]/20 group-hover/item:bg-[#FF6014]/5 text-slate-400 group-hover/item:text-[#FF6014] transition-all duration-300"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.span>
                    <span className="font-semibold">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Newsletter (fills the previously empty space) ── */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-2 space-y-4 max-w-sm">
            <h3 className="text-[13px] font-extrabold tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014]" />
              Newsletter
            </h3>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Get updates on new services and offers.
            </p>
            {subscribed ? (
              <div className="text-emerald-600 font-semibold bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3 text-[13px] flex items-center gap-2">
                <span>✅</span> Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-700 placeholder-slate-400 focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/10 focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF6014] hover:bg-[#E0530A] hover:shadow-[0_4px_12px_rgba(255,96,20,0.2)] text-white text-[13px] font-bold rounded-xl transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-slate-200/50 bg-slate-50/40 backdrop-blur-md relative z-10">
        <div className="w-full max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-[12px] text-slate-500 font-medium">
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
              className="w-8 h-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#FF6014] hover:border-[#FF6014]/20 transition-all duration-200 shrink-0"
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
              className="w-8 h-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#FF6014] hover:border-[#FF6014]/20 transition-all duration-200 shrink-0"
              aria-label="Share"
            >
              <Share2 size={14} />
            </button>
            <Link
              href="/dashbord/live-chat"
              aria-label="Live Chat"
              className="w-8 h-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#FF6014] hover:border-[#FF6014]/20 transition-all duration-200 shrink-0"
            >
              <MessageSquare size={14} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}