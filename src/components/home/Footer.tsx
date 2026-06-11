"use client";

import Link from "next/link";
import { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

// Clean Data Architecture - Dynamic footer configurations
const FOOTER_CONTENT = {
  brandName: "Rajseba",
  description:
    "Making home services simple, reliable, and trustworthy across Bangladesh. Verified experts, upfront pricing, guaranteed care.",
  newsletterTitle: "Stay Updated",
  newsletterSubtitle:
    "Subscribe for seasonal discounts and home maintenance tips.",
  newsletterPlaceholder: "Enter your email address",
  newsletterButtonText: "Subscribe",
  columns: [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "#" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "AC Repair", href: "/categories/ac-repair" },
        { label: "Plumbing", href: "/categories/plumbing" },
        { label: "Cleaning", href: "/categories/cleaning" },
        { label: "Painting", href: "/categories/painting" },
        { label: "Electrical", href: "/categories/electrical" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Safety Guarantee", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Privacy Policy", href: "#" },
      ],
    },
  ],
  socials: [
    { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed email:", email);
    setEmail("");
    // Handle newsletter subscription API hook here
  };

  return (
    <footer className="bg-slate-950 text-slate-100 py-16 lg:py-20 border-t border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Main Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-slate-800/60">
          {/* Logo & Description Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {FOOTER_CONTENT.brandName}
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {FOOTER_CONTENT.description}
            </p>

            {/* Social Icons Stack */}
            <div className="flex gap-4">
              {FOOTER_CONTENT.socials.map((social, i) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-slate-900 border border-slate-800 hover:border-[#FF5A5F] rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-1"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {FOOTER_CONTENT.columns.map((column, i) => (
            <div key={i} className="space-y-4">
              <h4 className="font-extrabold text-white text-base tracking-wide uppercase">
                {column.title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-[#FF5A5F] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Metadata & Newsletter grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12 items-center">
          {/* Newsletter Form */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-lg">
              {FOOTER_CONTENT.newsletterTitle}
            </h4>
            <p className="text-slate-400 text-xs md:text-sm">
              {FOOTER_CONTENT.newsletterSubtitle}
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex max-w-md gap-2 mt-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={FOOTER_CONTENT.newsletterPlaceholder}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none w-full placeholder-slate-500 focus:border-[#FF5A5F] transition-all duration-300"
              />
              <button
                type="submit"
                className="bg-[#FF5A5F] hover:bg-[#FF4449] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex-shrink-0 cursor-pointer"
              >
                {FOOTER_CONTENT.newsletterButtonText}
              </button>
            </form>
          </div>

          {/* Copyright notice label */}
          <div className="lg:text-right text-sm text-slate-500 font-medium">
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
        </div>
      </div>
    </footer>
  );
}