"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Share2,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  // Facebook,
  // Twitter,
  // Instagram,
  // Linkedin,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

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

const CONTACT_INFO = [
  { icon: Phone, label: "+880 1XXX-XXXXXX", href: "tel:+8801XXXXXXXXX" },
  { icon: Mail, label: "support@rajseba.com", href: "mailto:support@rajseba.com" },
  { icon: MapPin, label: "Dhaka, Bangladesh", href: "#" },
];

// const SOCIALS = [
//   {
//     icon: <Facebook size={16} />,
//     label: "Facebook",
//     href: "https://facebook.com/rajseba"
//   },
//   {
//     icon: <Twitter size={16} />,
//     label: "Twitter",
//     href: "https://twitter.com/rajseba"
//   },
//   {
//     icon: <Instagram size={16} />,
//     label: "Instagram",
//     href: "https://instagram.com/rajseba"
//   },
//   {
//     icon: <Linkedin size={16} />,
//     label: "LinkedIn",
//     href: "https://linkedin.com/company/rajseba"
//   },
// ];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#FAF6F6] text-slate-600 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">

          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" aria-label="Rajseba home">
              <Image
                src="/logo.png"
                alt="Rajseba"
                width={40}
                height={40}
                style={{ width: 'auto', height: 'auto' }}
                className="h-9 object-contain"
                priority
              />
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Bangladesh's most trusted home services platform. Book verified professionals for all your household needs — fast, safe, and affordable.
            </p>

            <ul className="space-y-3">
              {CONTACT_INFO.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex items-center gap-3 text-sm text-slate-500 hover:text-[#FF5A5F] transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:border-[#FF5A5F]">
                      <Icon className="w-4 h-4" />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>

          </div>

          {/* Services + Quick Links - 2 Columns on Mobile */}
          <div className="sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-x-8 gap-y-10">
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Our Services</h3>
              <ul className="space-y-2 text-sm">
                {SERVICES.map((s) => (
                  <li key={s.label}>
                    <Link href={s.href} className="text-slate-500 hover:text-[#FF5A5F] hover:font-semibold hover:underline flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-[#FF5A5F]" />
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {QUICK_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-slate-500 hover:text-[#FF5A5F] hover:font-semibold hover:underline flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-[#FF5A5F]" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter + App Download */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Newsletter</h3>
              <p className="text-xs text-slate-400">Get latest offers & updates</p>

              {subscribed ? (
                <div className="text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                  ✅ You're subscribed!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:border-[#FF5A5F] outline-none"
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-3 h-auto rounded-2xl text-sm font-semibold">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>

            {/* App Download Buttons */}
            {/* <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Download App</h3>
              <div className="flex flex-col gap-3">
                <Link
                  href="https://play.google.com/store/apps/details?id=com.rajseba"
                  target="_blank"
                  className="w-full"
                >
                  <Image
                    src="/google-play-badge.png"
                    alt="Get it on Google Play"
                    width={140}
                    height={42}
                    className="h-10 w-auto"
                  />
                </Link>
                <Link
                  href="https://apps.apple.com/app/rajseba"
                  target="_blank"
                  className="w-full"
                >
                  <Image
                    src="/app-store-badge.png"
                    alt="Download on App Store"
                    width={140}
                    height={42}
                    className="h-10 w-auto"
                  />
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="text-center sm:text-left">
            © {new Date().getFullYear()} <span className="font-bold">Rajseba</span>. All rights reserved.
            <p className="mt-1">
              Design & Developed by{" "}
              <Link href="https://jevxo-core-ecosystem.vercel.app/" className="text-primary font-semibold hover:font-bold hover:underline">
                Jevxo
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a href="https://rajseba.com" target="_blank" aria-label="Visit website" className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center hover:text-[#FF5A5F]">
              <Globe size={16} />
            </a>
            <Button
              variant="ghost"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "Rajseba", text: "Premium Home Services in Bangladesh", url: window.location.origin });
                } else {
                  navigator.clipboard.writeText(window.location.origin);
                  toast.success("Link copied!");
                }
              }}
              className="w-9 h-9 p-0 bg-slate-100 hover:bg-slate-200 rounded-full hover:text-[#FF5A5F]"
              aria-label="Share"
            >
              <Share2 size={16} />
            </Button>
            <Link href="/dashboard/support" aria-label="Support chat" className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center hover:text-[#FF5A5F]">
              <MessageSquare size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}