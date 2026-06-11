"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Briefcase, Map as MapIcon, Calendar, User, Search } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

// Dynamic Layout Navigation Data
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "#menu" },
  { label: "Contact", href: "#contact" },
];

const QUICK_ACTIONS = [
  { label: "SERVICES", href: "#services", icon: Briefcase },
  { label: "MAP", href: "#map", icon: MapIcon },
  { label: "BOOKINGS", href: "#bookings", icon: Calendar },
  { label: "PROFILE", href: "#profile", icon: User },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");
  
  const isHomepage = pathname === "/";

  // Track scroll position for header shadow and layout changes
  const { scrollY } = useScroll();
  
  // Clean scroll transforms for the header search bar
  const searchOpacity = useTransform(scrollY, [150, 300], [0, 1]);
  const searchScale = useTransform(scrollY, [150, 300], [0.85, 1]);
  const searchY = useTransform(scrollY, [150, 300], [-10, 0]);
  
  // Bind opacity/scale/translate based on homepage route
  const opacityVal = isHomepage ? searchOpacity : 1;
  const scaleVal = isHomepage ? searchScale : 1;
  const yVal = isHomepage ? searchY : 0;
  
  // Header shadow transition
  const borderOpacity = useTransform(scrollY, [0, 100], ["rgba(241, 245, 249, 1)", "rgba(226, 232, 240, 1)"]);
  const headerShadow = useTransform(scrollY, [0, 100], ["none", "0 4px 20px -2px rgba(0,0,0,0.03)"]);

  useEffect(() => {
    setMounted(true);
    setCurrentHash(window.location.hash);
    
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" && (currentHash === "" || currentHash === "#");
    }
    if (href.startsWith("#")) {
      return pathname === "/" && currentHash === href;
    }
    return pathname === href;
  };

  return (
    <motion.nav 
      style={{ 
        boxShadow: headerShadow,
        borderBottomColor: borderOpacity 
      }}
      className="bg-white border-b sticky top-0 z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand & Links */}
          <div className="flex items-center gap-8 lg:gap-12">
            <Link href="/" className="font-extrabold text-2xl text-slate-900 tracking-tight hover:opacity-90 transition-opacity">
              Rajseba
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {NAV_LINKS.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={i}
                    href={link.href}
                    className={`font-semibold py-2 text-sm lg:text-base transition-colors relative ${
                      active 
                        ? "text-[#FF5A5F]" 
                        : "text-slate-600 hover:text-[#FF5A5F]"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.div 
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5A5F] rounded-full" 
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Middle: Smooth Scroll-triggered Search Bar (Desktop/Tablet) */}
          {isHomepage ? <div className="hidden md:flex flex-1 justify-center max-w-sm lg:max-w-md mx-4 h-10 relative">
            {mounted && (
              <motion.div
                style={{
                  opacity: opacityVal,
                  scale: scaleVal,
                  y: yVal,
                }}
                className="absolute inset-0 flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2"
              >
                <Search className="text-slate-400 w-4 h-4 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="What service do you need today?"
                  className="bg-transparent text-xs sm:text-sm text-slate-700 outline-none w-full placeholder-slate-400"
                />
              </motion.div>
            )}
          </div> : ""}

          {/* Right: Icon Items & Auth Buttons */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            
            {/* 4 Icon Stack (Visible on Large Screens/Desktop) */}
            <div className="hidden lg:flex items-center gap-6">
              {QUICK_ACTIONS.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link 
                    key={i} 
                    href={action.href} 
                    className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#FF5A5F] transition-colors group"
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-[10px] font-bold tracking-wider">{action.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block h-8 w-px bg-slate-200 mx-2" />

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-slate-700 font-semibold hover:text-[#FF5A5F] py-2 px-3 text-sm lg:text-base transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-[#FF5A5F] hover:bg-[#FF4449] text-white font-semibold py-2.5 px-6 rounded-lg text-sm lg:text-base transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                Signup
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button & Scroll-triggered Search Icon */}
          <div className="flex md:hidden items-center gap-4">
            {/* Scroll-triggered Search Icon for Mobile */}
            {mounted && (
              <motion.button
                style={{ opacity: opacityVal, scale: scaleVal }}
                className="p-2 text-slate-600 hover:text-[#FF5A5F]"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 p-2 focus:outline-none hover:text-[#FF5A5F] transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 px-2 bg-white space-y-4 animate-in fade-in slide-in-from-top-5 duration-200">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={i}
                    href={link.href}
                    className={`px-3 py-2 font-semibold rounded-lg transition-colors ${
                      active 
                        ? "text-[#FF5A5F] bg-rose-50/50" 
                        : "text-slate-700 hover:bg-slate-50 hover:text-[#FF5A5F]"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Action Items */}
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 text-center">
              {QUICK_ACTIONS.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link 
                    key={i} 
                    href={action.href} 
                    className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#FF5A5F] py-2 rounded-lg hover:bg-slate-50 transition-colors" 
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[9px] font-bold">{action.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link
                href="/login"
                className="text-center py-2.5 text-slate-700 font-semibold hover:bg-slate-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-center py-3 bg-[#FF5A5F] hover:bg-[#FF4449] text-white font-semibold rounded-lg shadow-sm transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
            </div>
          </div>
        )}

      </div>
    </motion.nav>
  );
}
