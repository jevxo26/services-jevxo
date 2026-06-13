"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Briefcase,
  Map as MapIcon,
  Calendar,
  User,
  Search,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const QUICK_ACTIONS = [
  { label: "SERVICES", href: "/services", icon: Briefcase },
  { label: "MAP", href: "/map", icon: MapIcon },
  { label: "BOOKINGS", href: "/bookings", icon: Calendar },
  { label: "PROFILE", href: "/profile", icon: User },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const isHomepage = pathname === "/";

  const { scrollY } = useScroll();

  // Scroll-triggered search bar (desktop/tablet, homepage only)
  const searchOpacity = useTransform(scrollY, [150, 300], [0, 1]);
  const searchScale = useTransform(scrollY, [150, 300], [0.9, 1]);
  const searchY = useTransform(scrollY, [150, 300], [-8, 0]);

  const opacityVal = isHomepage ? searchOpacity : 1;
  const scaleVal = isHomepage ? searchScale : 1;
  const yVal = isHomepage ? searchY : 0;

  // Header shadow on scroll
  const headerShadow = useTransform(
    scrollY,
    [0, 80],
    ["0 0px 0px rgba(0,0,0,0)", "0 4px 20px -2px rgba(0,0,0,0.06)"]
  );
  const borderColor = useTransform(
    scrollY,
    [0, 80],
    ["rgba(226,232,240,0.5)", "rgba(226,232,240,1)"]
  );

  useEffect(() => {
    setMounted(true);
    setCurrentHash(window.location.hash);
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      setTimeout(() => mobileSearchRef.current?.focus(), 100);
    }
  }, [mobileSearchOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && (currentHash === "" || currentHash === "#");
    if (href.startsWith("#")) return pathname === "/" && currentHash === href;
    return pathname === href;
  };

  const handleMobileSearchToggle = () => {
    setMobileSearchOpen((v) => !v);
    if (isOpen) setIsOpen(false);
  };

  const handleMenuToggle = () => {
    setIsOpen((v) => !v);
    if (mobileSearchOpen) setMobileSearchOpen(false);
  };

  return (
    <motion.nav
      style={{ boxShadow: headerShadow, borderBottomColor: borderColor }}
      className="bg-white border-b sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ─── TOP BAR ─── */}
        <div className="flex items-center justify-between h-16 sm:h-[68px] gap-3">

          {/* Brand */}
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity flex-shrink-0"
            aria-label="Rajseba — Home"
          >
            <Image
              src="/logo.png"
              alt="Rajseba"
              width={140}
              height={40}
              className="h-9 sm:h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link, i) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={i}
                  href={link.href}
                  className={`relative font-semibold text-sm lg:text-[15px] py-2 transition-colors ${active ? "text-[#FF5A5F]" : "text-slate-600 hover:text-[#FF5A5F]"
                    }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="navIndicator"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-[#FF5A5F] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Center Search — desktop/tablet, appears on scroll (homepage) or always (other pages) */}
          {isHomepage ? (
            <div className="hidden md:flex flex-1 justify-center max-w-xs lg:max-w-sm mx-2 relative h-10">
              {mounted && (
                <motion.div
                  style={{ opacity: opacityVal, scale: scaleVal, y: yVal }}
                  className="absolute inset-0"
                >
                  <label htmlFor="desktop-search" className="sr-only">Search services</label>
                  <div className="flex items-center h-full bg-slate-50 border border-slate-200 rounded-full px-4 gap-2 focus-within:border-[#FF5A5F] focus-within:ring-2 focus-within:ring-[#FF5A5F]/10 transition-all">
                    <Search className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                    <input
                      id="desktop-search"
                      type="text"
                      placeholder="What service do you need?"
                      className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder-slate-400"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex flex-1 justify-center max-w-xs lg:max-w-sm mx-2">
              <label htmlFor="desktop-search-2" className="sr-only">Search services</label>
              <div className="flex items-center h-10 w-full bg-slate-50 border border-slate-200 rounded-full px-4 gap-2 focus-within:border-[#FF5A5F] focus-within:ring-2 focus-within:ring-[#FF5A5F]/10 transition-all">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                <input
                  id="desktop-search-2"
                  type="text"
                  placeholder="What service do you need?"
                  className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder-slate-400"
                />
              </div>
            </div>
          )}

          {/* Quick Actions (large desktop) */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6">
            {QUICK_ACTIONS.map((action, i) => {
              const Icon = action.icon;
              const active = isActive(action.href);
              return (
                <Link
                  key={i}
                  href={action.href}
                  className={`flex flex-col items-center gap-0.5 transition-colors group ${
                    active ? "text-[#FF5A5F]" : "text-slate-500 hover:text-[#FF5A5F]"
                  }`}
                  aria-label={action.label}
                >
                  <Icon className="w-[18px] h-[18px] group-hover:scale-110 transition-transform duration-150" aria-hidden="true" />
                  <span className="text-[9px] font-bold tracking-widest">{action.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="hidden lg:block h-10 w-px bg-primary/50" />

          {/* Auth Buttons (desktop/tablet) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="font-semibold text-slate-700 hover:text-[#FF5A5F] hover:bg-rose-50 py-2 px-3 rounded-lg text-sm lg:text-[15px] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-5 rounded-lg text-sm lg:text-[15px] transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              Signup
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-1">
            <Button
              variant="ghost"
              onClick={handleMobileSearchToggle}
              className={`p-2.5 h-auto rounded-lg transition-colors ${mobileSearchOpen
                ? "text-[#FF5A5F] bg-rose-50 hover:bg-rose-50 hover:text-[#FF5A5F]"
                : "text-slate-600 hover:text-[#FF5A5F] hover:bg-slate-50"
                }`}
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              aria-expanded={mobileSearchOpen}
            >
              {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              onClick={handleMenuToggle}
              className={`p-2.5 h-auto rounded-lg transition-colors ${isOpen
                ? "text-[#FF5A5F] bg-rose-50 hover:bg-rose-50 hover:text-[#FF5A5F]"
                : "text-slate-600 hover:text-[#FF5A5F] hover:bg-slate-50"
                }`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="w-[22px] h-[22px]" /> : <Menu className="w-[22px] h-[22px]" />}
            </Button>
          </div>

        </div>

        {/* ─── MOBILE SEARCH BAR ─── */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              key="mobile-search"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-slate-100"
            >
              <div className="py-3 px-1">
                <label htmlFor="mobile-search" className="sr-only">Search services</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 h-11 gap-2 focus-within:border-[#FF5A5F] focus-within:ring-2 focus-within:ring-[#FF5A5F]/10 transition-all">
                  <Search className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                  <input
                    id="mobile-search"
                    ref={mobileSearchRef}
                    type="text"
                    placeholder="What service do you need today?"
                    className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder-slate-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ─── MOBILE DRAWER ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-drawer"
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-slate-100 bg-white"
          >
            <div className="px-4 py-4 space-y-1">

              {/* Nav Links */}
              {NAV_LINKS.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={i}
                    href={link.href}
                    className={`flex items-center px-3 py-3 font-semibold text-[15px] rounded-xl transition-colors ${active
                      ? "text-[#FF5A5F] bg-rose-50"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#FF5A5F]"
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Quick Action Icons */}
              <div className="grid grid-cols-4 gap-2 pt-4 pb-1 border-t border-slate-100 mt-3">
                {QUICK_ACTIONS.map((action, i) => {
                  const Icon = action.icon;
                  const active = isActive(action.href);
                  return (
                    <Link
                      key={i}
                      href={action.href}
                      className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-colors ${
                        active
                          ? "text-[#FF5A5F] bg-rose-50/50"
                          : "text-slate-500 hover:text-[#FF5A5F] hover:bg-rose-50"
                      }`}
                      onClick={() => setIsOpen(false)}
                      aria-label={action.label}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      <span className="text-[9px] font-bold tracking-wider leading-none">{action.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Auth Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-1">
                <Link
                  href="/login"
                  className="text-center py-3 text-slate-700 font-semibold text-[15px] border border-slate-200 rounded-xl hover:border-[#FF5A5F] hover:text-[#FF5A5F] hover:bg-rose-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-center py-3 bg-[#FF5A5F] hover:bg-[#FF4449] text-white font-semibold text-[15px] rounded-xl shadow-sm transition-colors active:scale-[0.98]"
                  onClick={() => setIsOpen(false)}
                >
                  Signup
                </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}