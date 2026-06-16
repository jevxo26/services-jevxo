"use client";

import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  User,
  Shield,
  Bell,
  Link as LinkIcon,
  CreditCard,
  LogOut,
  Pencil,
  Mail,
  MessageSquare,
  Megaphone,
  Check,
  Lock,
  Smartphone,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const roleName = getRoleName(role);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");

  // Form Fields State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Zayed Mansoor",
    email: "zayed.mansoor@example.com",
    phone: "+880 1712-345678",
    location: "Gulshan-2, Dhaka",
  });

  // Toggles State
  const [toggles, setToggles] = useState({
    twoFactor: true,
    emailNotif: true,
    smsAlert: false,
    promotions: true,
  });

  // Smooth Scroll Helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Tab click handler
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "personal" || tabId === "security" || tabId === "notifications") {
      // These are on the main scrollable stack
      setTimeout(() => scrollToSection(tabId), 50);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Changes saved successfully!");
  };

  // Custom Toggle Switch Component
  const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 ${checked ? "bg-rose-500" : "bg-slate-200"
        }`}
    >
      <span
        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"
          }`}
      />
    </button>
  );

  return (
    <div className="w-full animate-in fade-in duration-200">

      {/* Background Watermark Pattern Wrapper */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: "url('/Group1.png'), url('/Group2.png')",
          backgroundSize: "800px",
          backgroundRepeat: "repeat",
          opacity: 0.05,
        }}
      />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">



        {/* Main Columns Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* Left Column Navigation Panel (Responsive) */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 lg:p-6 lg:min-h-[480px] flex flex-col justify-between">

            {/* Scrollable tab links on mobile, stacked list on desktop */}
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 pb-2 lg:pb-0 scrollbar-none whitespace-nowrap lg:whitespace-normal">

              {[
                { id: "personal", label: "Personal Info", icon: User },
                { id: "security", label: "Login & Security", icon: Shield },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "linked", label: "Linked Accounts", icon: LinkIcon },
                { id: "payment", label: "Payment Methods", icon: CreditCard },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id ||
                  (activeTab === "personal" && tab.id === "personal") ||
                  (activeTab === "security" && tab.id === "security") ||
                  (activeTab === "notifications" && tab.id === "notifications");

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-left transition-all ${isActive
                      ? "bg-rose-50 text-rose-500 font-bold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-semibold"
                      }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Separator & Logout button */}
            <div className="hidden lg:block pt-6 border-t border-slate-100 mt-6">
              <button
                onClick={() => router.push("/login")}
                className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-left text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-semibold"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>

          </div>

          {/* Right Column content area */}
          <div className="lg:col-span-3 space-y-6">

            {/* Top User Profile Header Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                {/* Avatar with edit float icon */}
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                    alt="Zayed Mansoor Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-white ring-4 ring-slate-100"
                  />
                  <button className="absolute bottom-0 right-0 p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full border-2 border-white shadow-md transition-transform active:scale-90">
                    <Pencil size={12} className="stroke-[2.5]" />
                  </button>
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">Zayed Mansoor</h2>
                  <p className="text-sm text-slate-400 mt-0.5 font-semibold">{personalInfo.email}</p>
                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-500 text-xs font-bold px-3 py-1 rounded-full mt-2 border border-rose-100">
                    ★ Premium Member
                  </span>
                </div>
              </div>

              <button className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md shadow-rose-500/10 transition-all active:scale-[0.98]">
                View Public Profile
              </button>
            </div>

            {/* Render Main Stack (Personal Info, Security, Notifications) */}
            {(activeTab === "personal" || activeTab === "security" || activeTab === "notifications") && (
              <div className="space-y-6">

                {/* 1. Personal Info Card */}
                <div id="personal" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 scroll-mt-6">
                  <h3 className="text-lg font-bold text-slate-900">Personal Info</h3>

                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          value={personalInfo.fullName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-350 focus:ring-4 focus:ring-rose-500/5 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-350 focus:ring-4 focus:ring-rose-500/5 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-350 focus:ring-4 focus:ring-rose-500/5 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Location</label>
                        <input
                          type="text"
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-350 focus:ring-4 focus:ring-rose-500/5 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md shadow-rose-500/10 transition-all active:scale-[0.98]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Login & Security Card */}
                <div id="security" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 scroll-mt-6">
                  <h3 className="text-lg font-bold text-slate-900">Login &amp; Security</h3>

                  <div className="divide-y divide-slate-100">
                    {/* Password Row */}
                    <div className="py-4 flex items-center justify-between gap-4 first:pt-0">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Password</h4>
                        <p className="text-xs text-slate-400 mt-1 font-semibold">Last updated 3 months ago</p>
                      </div>
                      <button className="text-rose-500 hover:text-rose-600 text-xs font-bold focus:outline-none hover:underline">
                        Update
                      </button>
                    </div>

                    {/* 2FA Row */}
                    <div className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Two-Factor Authentication</h4>
                        <p className="text-xs text-slate-400 mt-1 font-semibold">Add an extra layer of security to your account.</p>
                      </div>
                      <Switch
                        checked={toggles.twoFactor}
                        onChange={() => setToggles({ ...toggles, twoFactor: !toggles.twoFactor })}
                      />
                    </div>

                    {/* Recent Logins Row */}
                    <div className="py-4 flex items-center justify-between gap-4 last:pb-0">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Recent Logins</h4>
                        <p className="text-xs text-slate-400 mt-1 font-semibold">Chrome on MacOS • Dhaka, BD</p>
                      </div>
                      <button className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-xl border border-slate-100 transition-colors">
                        Review
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Notifications Card */}
                <div id="notifications" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 scroll-mt-6">
                  <h3 className="text-lg font-bold text-slate-900">Notifications</h3>

                  <div className="space-y-4">
                    {/* Email Notifications Row */}
                    <div className="flex items-center justify-between gap-4 p-4 bg-slate-50/50 hover:bg-slate-50/80 rounded-2xl border border-slate-50 transition-colors">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500 shrink-0">
                          <Mail size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Email Notifications</h4>
                          <p className="text-xs text-slate-400 mt-1 font-semibold">Updates about your bookings and account.</p>
                        </div>
                      </div>
                      <Switch
                        checked={toggles.emailNotif}
                        onChange={() => setToggles({ ...toggles, emailNotif: !toggles.emailNotif })}
                      />
                    </div>

                    {/* SMS Alerts Row */}
                    <div className="flex items-center justify-between gap-4 p-4 bg-slate-50/50 hover:bg-slate-50/80 rounded-2xl border border-slate-50 transition-colors">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500 shrink-0">
                          <MessageSquare size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">SMS Alerts</h4>
                          <p className="text-xs text-slate-400 mt-1 font-semibold">Urgent updates and service confirmations.</p>
                        </div>
                      </div>
                      <Switch
                        checked={toggles.smsAlert}
                        onChange={() => setToggles({ ...toggles, smsAlert: !toggles.smsAlert })}
                      />
                    </div>

                    {/* Promotions Row */}
                    <div className="flex items-center justify-between gap-4 p-4 bg-slate-50/50 hover:bg-slate-50/80 rounded-2xl border border-slate-50 transition-colors">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500 shrink-0">
                          <Megaphone size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Promotions</h4>
                          <p className="text-xs text-slate-400 mt-1 font-semibold">News, offers, and seasonal discounts.</p>
                        </div>
                      </div>
                      <Switch
                        checked={toggles.promotions}
                        onChange={() => setToggles({ ...toggles, promotions: !toggles.promotions })}
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Render Linked Accounts tab content */}
            {activeTab === "linked" && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Linked Accounts</h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Manage your linked social accounts and login authenticators.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-700">G</div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-800">Google</h5>
                        <p className="text-xs text-emerald-600 font-semibold mt-0.5">Connected</p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-rose-500 text-xs font-bold transition-colors">Disconnect</button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white">f</div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-800">Facebook</h5>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">Not Connected</p>
                      </div>
                    </div>
                    <button className="text-rose-500 hover:text-rose-600 text-xs font-bold transition-colors">Connect</button>
                  </div>
                </div>
              </div>
            )}

            {/* Render Payment Methods tab content */}
            {activeTab === "payment" && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Payment Methods</h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Configure your saved wallets and cards for seamless checkouts.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-rose-100 bg-rose-50/20 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black bg-rose-500 text-white px-2 py-1 rounded">bKash</span>
                      <div>
                        <h5 className="text-sm font-bold text-slate-800">01712 ****78</h5>
                        <span className="text-[10px] text-rose-500 font-bold block mt-0.5">Primary Payment Option</span>
                      </div>
                    </div>
                    <span className="text-xs text-rose-500 font-extrabold uppercase">Active</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black bg-indigo-600 text-white px-2 py-1 rounded">Visa</span>
                      <div>
                        <h5 className="text-sm font-bold text-slate-800">**** **** **** 4812</h5>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Expires 12/28</span>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
