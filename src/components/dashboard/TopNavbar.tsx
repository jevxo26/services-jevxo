"use client";

import { Bell, Search, User, ChevronDown, Check, Shield, HardHat, CircleUser, Briefcase, Menu, LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRole, UserRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export function TopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { role, setRole, roleName } = useRole();
  const { logout } = useAuth();
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
    { value: "superadmin", label: "Super Admin", desc: "System control", icon: Shield, color: "text-rose-500 bg-rose-50" },
    { value: "agent", label: "Agent", desc: "Booking agent", icon: Briefcase, color: "text-emerald-500 bg-emerald-50" },
    { value: "provider", label: "Provider", desc: "Service professional", icon: HardHat, color: "text-teal-500 bg-teal-50" },
    { value: "customer", label: "Customer", desc: "Client profile", icon: CircleUser, color: "text-indigo-500 bg-indigo-50" },
  ];

  // Dynamic user data for navbar display
  const getProfileData = (r: UserRole) => {
    switch (r) {
      case "superadmin":
        return { name: "Aftab Farhan", designation: "System Administrator", avatar: "AF" };
      case "agent":
        return { name: "Rezaul Karim", designation: "Booking Partner", avatar: "RK" };
      case "provider":
        return { name: "Kabir AC Repair", designation: "Verified Technician", avatar: "KR" };
      case "customer":
        return { name: "Sharmin Akter", designation: "Premium Client", avatar: "SA" };
      default:
        return { name: "John Doe", designation: "User", avatar: "JD" };
    }
  };

  const profile = getProfileData(role);
  const activeRoleConfig = rolesList.find((x) => x.value === role) || rolesList[0];

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between z-30 shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <button onClick={onMenuClick} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl md:hidden shrink-0 focus:outline-none">
          <Menu size={20} />
        </button>
        <div className="relative w-80 hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search booking ID, service, client..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
          />
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-4">
        {/* Dynamic Role Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98] text-sm font-medium"
          >
            <activeRoleConfig.icon size={16} className={activeRoleConfig.value === "superadmin" ? "text-rose-500" : activeRoleConfig.value === "agent" ? "text-emerald-500" : activeRoleConfig.value === "provider" ? "text-teal-500" : "text-indigo-500"} />
            <span className="text-slate-700 hidden sm:inline">{roleName}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Switch Dashboard View</span>
              </div>
              <div className="p-1 space-y-0.5">
                {rolesList.map((r) => {
                  const Icon = r.icon;
                  const isSelected = r.value === role;
                  return (
                    <button
                      key={r.value}
                      onClick={() => {
                        setRole(r.value);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isSelected ? "bg-rose-50 text-rose-900" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${r.color}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{r.label}</p>
                          <p className="text-xs text-slate-400">{r.desc}</p>
                        </div>
                      </div>
                      {isSelected && <Check size={16} className="text-rose-500 mr-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <button className="p-2.5 hover:bg-slate-100 rounded-xl relative text-slate-600 hover:text-slate-900 transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Profile Info & Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 pl-4 border-l border-slate-200 text-left hover:opacity-85 transition-opacity active:scale-[0.98] focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-none">{profile.name}</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-none">{profile.designation}</p>
            </div>
            <div className="w-10 h-10 bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center justify-center shadow-inner select-none transition-transform hover:scale-105">
              {profile.avatar}
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-sm font-bold text-slate-800 leading-none">{profile.name}</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-none">{profile.designation}</p>
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
                  className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <div className="p-1.5 rounded-lg bg-rose-50 text-rose-500">
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