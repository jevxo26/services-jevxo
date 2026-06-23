"use client";

import { Bell, Search, User, ChevronDown, Check, Shield, HardHat, CircleUser, Briefcase, Menu, LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { UserRole, setRole as setAuthRole, getRoleName } from "@/redux/features/auth/authSlice";
import { logout as authLogout } from "@/redux/features/auth/authSlice";
import Link from "next/link";

export function TopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const authUser = useAppSelector((state) => state.auth.user);
  const role = useAppSelector((state) => state.auth.role) || "client";
  const dispatch = useAppDispatch();
  const roleName = getRoleName(role);
  const logout = () => dispatch(authLogout());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rolesList: { value: UserRole; label: string; desc: string; icon: React.ComponentType<any>; color: string }[] = [
    { value: "superadmin", label: "Super Admin", desc: "System control", icon: Shield, color: "text-[#FF7C71] bg-[#FFF8F7]" },
    { value: "agent", label: "Agent", desc: "Booking agent", icon: Briefcase, color: "text-emerald-500 bg-emerald-50" },
    { value: "vendor", label: "Vendor", desc: "Service professional", icon: HardHat, color: "text-teal-500 bg-teal-50" },
    { value: "client", label: "Client", desc: "Client profile", icon: CircleUser, color: "text-indigo-500 bg-indigo-50" },
  ];

  // Derive display profile from real user data in Redux
  const name = authUser?.name || "User";
  const email = authUser?.email || authUser?.phone || "";
  const avatar = name.substring(0, 2).toUpperCase();
  const activeRoleConfig = rolesList.find((x) => x.value === role) || rolesList[3];

  return (
    <header className="bg-[#FFF8F7]/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center justify-between z-30 sticky top-0 shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <button onClick={onMenuClick} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl md:hidden shrink-0 focus:outline-none transition-colors">
          <Menu size={20} />
        </button>
        <div className="relative w-full max-w-md hidden md:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF7C71] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search booking ID, service, client..."
            className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#FF7C71]/30 focus:ring-4 focus:ring-[#FFF8F7] transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-5">

        {/* Notifications Button */}
        <button className="p-2.5 hover:bg-slate-50 rounded-full relative text-slate-500 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100 hover:shadow-sm">
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#FF7C71] rounded-full ring-2 ring-white"></span>
        </button>

        {/* Profile Info & Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 pl-5 border-l border-slate-100 text-left hover:opacity-90 transition-all active:scale-[0.98] focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">{name}</p>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium leading-none">{roleName}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF7C71] to-[#FF7C71] text-white font-bold rounded-xl flex items-center justify-center shadow-md shadow-[#FF7C71]/20 select-none transition-transform hover:scale-105">
              {avatar}
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-[#FFF8F7] border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">

              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF7C71] to-[#FF7C71] text-white font-bold rounded-xl flex items-center justify-center shadow-md shadow-[#FF7C71]/20 select-none shrink-0">
                    {avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate leading-none">{name}</p>
                    {email && (
                      <p className="text-xs text-slate-400 mt-1 truncate leading-none">{email}</p>
                    )}
                    <span className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full ${activeRoleConfig.color}`}>
                      {roleName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-1 space-y-0.5">
                <Link
                  href="/dashbord/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500">
                    <User size={16} />
                  </div>
                  <span className="font-medium">My Profile</span>
                </Link>

                <Link
                  href="/dashbord/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500">
                    <Settings size={16} />
                  </div>
                  <span className="font-medium">Settings</span>
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-[#E5675D] hover:bg-[#FFF8F7] transition-all"
                >
                  <div className="p-1.5 rounded-lg bg-[#FFF8F7] text-[#FF7C71]">
                    <LogOut size={16} />
                  </div>
                  <span className="font-semibold">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}