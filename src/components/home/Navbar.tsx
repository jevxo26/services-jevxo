"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Briefcase,
  Map as MapIcon,
  Calendar,
  Search,
  ChevronDown,
  Home as HomeIcon,
  LayoutGrid,
  Info,
  Phone,
  LucideIcon,
  User,
  LogOut,
  Settings,
  LogIn,
  UserPlus,
  PhoneCall,
  MapPin
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { CATEGORIES_CONTENT } from "./sections/home/ExploreCategories";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout as authLogout, getRoleName } from "@/redux/features/auth/authSlice";

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  hasDropdown?: boolean;
}

const LEFT_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Menu", href: "#menu", icon: LayoutGrid, hasDropdown: true },
  { label: "Services", href: "/services", icon: Briefcase },
];

const RIGHT_NAV_LINKS: NavLink[] = [
  { label: "Map", href: "/map", icon: MapPin },
  { label: "About Us", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: PhoneCall },
  { label: "Booking", href: "/bookings", icon: Calendar },
];

const ALL_NAV_LINKS: NavLink[] = [...LEFT_NAV_LINKS, ...RIGHT_NAV_LINKS];

const MOBILE_BOTTOM_LINKS: NavLink[] = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Menu", href: "#menu", icon: LayoutGrid, hasDropdown: true },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Map", href: "/map", icon: MapPin },
  { label: "Booking", href: "/bookings", icon: Calendar },
  { label: "Login", href: "/login", icon: User },
];

export function Navbar() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, role, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showMobileAccordion, setShowMobileAccordion] = useState(false);
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const isHomepage = pathname === "/";

  const roleName = getRoleName(role);
  const profile = user ? {
    name: user.name || "User",
    email: user.email || "",
    roleName: roleName || "Client",
    avatar: (user.name || "U").substring(0, 2).toUpperCase()
  } : null;

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
    return scrollY.on("change", (latest) => {
      if (latest > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
  }, [scrollY]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    setMobileSearchOpen(false);
    setShowMenuDropdown(false);
    setShowMobileAccordion(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Close profile dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const bottomLinks = MOBILE_BOTTOM_LINKS.map((link) => {
    if (mounted && isAuthenticated && link.label === "Login") {
      return {
        label: "Dashboard",
        href: role === "client" ? "/dashbord/overview" : "/dashbord",
        icon: User,
      };
    }
    return link;
  });

  return (
    <>
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
                width={40}
                height={40}
                className="h-9 sm:h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Left Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-3 lg:gap-4 flex-shrink-0" aria-label="Left navigation">
              {LEFT_NAV_LINKS.map((link, i) => {
                const active = link.hasDropdown ? pathname.startsWith("/categories") : isActive(link.href);
                const Icon = link.icon;

                if (link.hasDropdown) {
                  return (
                    <div
                      key={i}
                      className="relative py-2 group"
                      onMouseEnter={() => setShowMenuDropdown(true)}
                      onMouseLeave={() => setShowMenuDropdown(false)}
                    >
                      <button
                        type="button"
                        className={`flex items-center font-semibold text-xs lg:text-sm transition-colors cursor-pointer ${active ? "text-[#FF5A5F]" : "text-slate-600 hover:text-[#FF5A5F]"
                          }`}
                      >
                        <Icon className={`stroke-[2.2] transition-all duration-300 ease-in-out ${isScrolled ? "w-0 h-0 opacity-0 mr-0 scale-0" : "w-[15px] h-[15px] opacity-100 mr-1.5 scale-100"}`} />
                        <span>{link.label}</span>
                        <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${showMenuDropdown ? "rotate-180" : ""}`} />
                        {active && (
                          <motion.span
                            layoutId="navIndicatorLeft"
                            className="absolute inset-x-0 -bottom-px h-0.5 bg-[#FF5A5F] rounded-full"
                          />
                        )}
                      </button>

                      <AnimatePresence>
                        {showMenuDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[460px] bg-white rounded-2xl border border-slate-100 shadow-xl p-4 z-50"
                          >
                            <div className="grid grid-cols-2 gap-2">
                              {CATEGORIES_CONTENT.categories.map((cat) => {
                                const IconComponent = cat.icon;
                                return (
                                  <Link
                                    key={cat.slug}
                                    href={`/categories/${cat.slug}`}
                                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50/50 group/item transition-colors"
                                    onClick={() => setShowMenuDropdown(false)}
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover/item:bg-[#FF5A5F]/10 group-hover/item:text-[#FF5A5F] transition-colors">
                                      <IconComponent className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-sm text-slate-700 group-hover/item:text-slate-900 transition-colors">
                                      {cat.label}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={i}
                    href={link.href}
                    className={`relative flex items-center font-semibold text-xs lg:text-sm py-2 transition-colors ${active ? "text-[#FF5A5F]" : "text-slate-600 hover:text-[#FF5A5F]"
                      }`}
                  >
                    <Icon className={`stroke-[2.2] transition-all duration-300 ease-in-out ${isScrolled ? "w-0 h-0 opacity-0 mr-0 scale-0" : "w-[15px] h-[15px] opacity-100 mr-1.5 scale-100"}`} />
                    <span>{link.label}</span>
                    {active && (
                      <motion.span
                        layoutId="navIndicatorLeft"
                        className="absolute inset-x-0 -bottom-px h-0.5 bg-[#FF5A5F] rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Center Search — desktop/tablet, appears on scroll (homepage) or always (other pages) */}
            {isHomepage ? (
              <div className="hidden md:flex flex-1 justify-center max-w-xs lg:max-w-sm mx-4 relative h-10">
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
              <div className="hidden md:flex flex-1 justify-center max-w-xs lg:max-w-sm mx-4">
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

            {/* Right Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-3 lg:gap-4 flex-shrink-0" aria-label="Right navigation">
              {RIGHT_NAV_LINKS.map((link, i) => {
                const active = isActive(link.href);
                const Icon = link.icon;

                return (
                  <Link
                    key={i}
                    href={link.href}
                    className={`relative flex items-center font-semibold text-xs lg:text-sm py-2 transition-colors ${active ? "text-[#FF5A5F]" : "text-slate-600 hover:text-[#FF5A5F]"
                      }`}
                  >
                    <Icon className={`stroke-[2.2] transition-all duration-300 ease-in-out ${isScrolled ? "w-0 h-0 opacity-0 mr-0 scale-0" : "w-[15px] h-[15px] opacity-100 mr-1.5 scale-100"}`} />
                    <span>{link.label}</span>
                    {active && (
                      <motion.span
                        layoutId="navIndicatorRight"
                        className="absolute inset-x-0 -bottom-px h-0.5 bg-[#FF5A5F] rounded-full"
                      />
                    )}
                </Link>
                );
              })}
            </nav>

            {/* Auth Buttons or Profile Dropdown (desktop/tablet) */}
            {!mounted || authLoading ? (
              // Skeleton while auth initializes — prevents Login/Signup flash for logged-in users
              <div className="hidden md:flex items-center gap-2">
                <div className="w-20 h-8 bg-slate-100 rounded-lg animate-pulse" />
                <div className="w-9 h-9 bg-slate-100 rounded-full animate-pulse" />
              </div>
            ) : isAuthenticated && profile ? (
              <div className="hidden md:block relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 leading-none">{profile.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-none font-semibold">{profile.roleName}</p>
                  </div>
                  <div className="w-9 h-9 bg-rose-100 text-[#FF5A5F] font-bold rounded-full flex items-center justify-center border border-rose-200 shadow-sm hover:scale-105 transition-transform duration-200 select-none">
                    {profile.avatar}
                  </div>
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/40">
                        <p className="text-sm font-bold text-slate-800 truncate">{profile.name}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">{profile.email}</p>
                        <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-[#FF5A5F] bg-rose-50 border border-rose-100/50 rounded-full mt-2">
                          {profile.roleName}
                        </span>
                      </div>
                      <div className="p-1 space-y-0.5">
                        <Link
                          href={role === "client" ? "/dashbord/overview" : "/dashbord"}
                          className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-[#FF5A5F] transition-all font-semibold"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500">
                            <LayoutGrid size={15} />
                          </div>
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          href="/dashbord/profile"
                          className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-[#FF5A5F] transition-all font-semibold"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500">
                            <User size={15} />
                          </div>
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/dashbord/settings"
                          className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-[#FF5A5F] transition-all font-semibold"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500">
                            <Settings size={15} />
                          </div>
                          <span>Settings</span>
                        </Link>

                        <div className="my-1 border-t border-slate-100/60" />

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            dispatch(authLogout());
                          }}
                          className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-rose-600 hover:bg-rose-50 transition-all font-semibold"
                        >
                          <div className="p-1.5 rounded-lg bg-rose-50 text-[#FF5A5F]">
                            <LogOut size={15} />
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
                <Link
                  href="/login"
                  className="flex items-center gap-2 font-semibold text-slate-700 text-[#FF565C] bg-rose-100 py-2 px-3 rounded-lg text-sm lg:text-[15px] transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#FF4449] text-white font-semibold py-2.5 px-5 rounded-lg text-sm lg:text-[15px] transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  Signup
                </Link>
              </div>
            )}

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
                {ALL_NAV_LINKS.map((link, i) => {
                  const active = link.hasDropdown ? pathname.startsWith("/categories") : isActive(link.href);
                  const Icon = link.icon;

                  if (link.hasDropdown) {
                    return (
                      <div key={i} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => setShowMobileAccordion(!showMobileAccordion)}
                          className={`w-full flex items-center justify-between px-3 py-3 font-semibold text-[15px] rounded-xl transition-colors cursor-pointer ${active ? "text-[#FF5A5F] bg-rose-50" : "text-slate-700 hover:bg-slate-50 hover:text-[#FF5A5F]"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-5 h-5 text-slate-500" />
                            <span>{link.label}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showMobileAccordion ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                          {showMobileAccordion && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-4 pr-2 py-1 space-y-1"
                            >
                              <div className="grid grid-cols-2 gap-1.5">
                                {CATEGORIES_CONTENT.categories.map((cat) => {
                                  const IconComponent = cat.icon;
                                  return (
                                    <Link
                                      key={cat.slug}
                                      href={`/categories/${cat.slug}`}
                                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-[#FF5A5F] transition-colors"
                                      onClick={() => {
                                        setIsOpen(false);
                                        setShowMobileAccordion(false);
                                      }}
                                    >
                                      <IconComponent className="w-4 h-4 text-slate-400" />
                                      <span className="text-xs font-semibold">{cat.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={i}
                      href={link.href}
                      className={`flex items-center gap-2.5 px-3 py-3 font-semibold text-[15px] rounded-xl transition-colors ${active ? "text-[#FF5A5F] bg-rose-50" : "text-slate-700 hover:bg-slate-50 hover:text-[#FF5A5F]"
                        }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5 text-slate-500" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                {/* Auth Section */}
                {!mounted || authLoading ? (
                  <div className="pt-4 border-t border-slate-100 mt-1">
                    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50">
                      <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4" />
                        <div className="h-2.5 bg-slate-200 rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  </div>
                ) : isAuthenticated && profile ? (
                  <div className="pt-4 border-t border-slate-100 mt-1 space-y-4">
                    {/* User profile card */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-12 h-12 bg-rose-100 text-[#FF5A5F] font-bold rounded-full flex items-center justify-center border border-rose-200 shadow-inner select-none shrink-0">
                        {profile.avatar}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="text-sm font-bold text-slate-800 truncate leading-none">{profile.name}</p>
                        <p className="text-xs text-slate-400 mt-1 truncate font-medium leading-none">{profile.email}</p>
                        <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-[#FF5A5F] bg-rose-50 border border-rose-100/50 rounded-full mt-1.5 font-semibold">
                          {profile.roleName}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        href={role === "client" ? "/dashbord/overview" : "/dashbord"}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-rose-50 hover:text-[#FF5A5F] transition-all gap-1.5"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutGrid size={18} className="text-slate-400" />
                        <span className="text-[11px] font-bold">Dashboard</span>
                      </Link>
                      <Link
                        href="/dashbord/profile"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-rose-50 hover:text-[#FF5A5F] transition-all gap-1.5"
                        onClick={() => setIsOpen(false)}
                      >
                        <User size={18} className="text-slate-400" />
                        <span className="text-[11px] font-bold">Profile</span>
                      </Link>
                      <Link
                        href="/dashbord/settings"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-rose-50 hover:text-[#FF5A5F] transition-all gap-1.5"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings size={18} className="text-slate-400" />
                        <span className="text-[11px] font-bold">Settings</span>
                      </Link>
                    </div>

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        dispatch(authLogout());
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100/80 font-bold text-[15px] transition-all active:scale-[0.98]"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 mt-1">
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 py-3 text-slate-700 font-semibold text-[15px] border border-slate-200 rounded-xl hover:border-[#FF5A5F] hover:text-[#FF5A5F] hover:bg-rose-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>

                    <Link
                      href="/register"
                      className="flex items-center justify-center gap-2 py-3 bg-[#FF5A5F] hover:bg-[#FF4449] text-white font-semibold text-[15px] rounded-xl shadow-sm transition-colors active:scale-[0.98]"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserPlus className="w-4 h-4" />
                      Signup
                    </Link>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── MOBILE BOTTOM NAVIGATION ─── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-50 px-2 py-2 pb-safe-bottom">
        <div className="grid grid-cols-6 gap-1 max-w-lg mx-auto">
          {bottomLinks.map((link, i) => {
            const Icon = link.icon;
            const active = link.hasDropdown
              ? pathname.startsWith("/categories") || (isOpen && showMobileAccordion)
              : isActive(link.href);

            const handleClick = (e: React.MouseEvent) => {
              if (link.hasDropdown) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
                setShowMobileAccordion(true);
              } else {
                setIsOpen(false);
              }
            };

            return (
              <Link
                key={i}
                href={link.href}
                onClick={handleClick}
                className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all active:scale-90 ${active
                  ? "text-[#FF5A5F]"
                  : "text-slate-500 hover:text-[#FF5A5F]"
                  }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? "scale-110" : ""}`} />
                <span className="text-[10px] font-semibold tracking-wide leading-none">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}