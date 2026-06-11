"use client";

import { useRole, UserRole } from "@/context/RoleContext";
import { useState } from "react";
import { User, Shield, Bell, CreditCard, Sliders, Check, Save } from "lucide-react";

export default function SettingsPage() {
  const { role, roleName } = useRole();
  const [activeTab, setActiveTab] = useState("profile");
  const [successMsg, setSuccessMsg] = useState(false);

  // Handle Form Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  // Determine dynamic tabs based on role
  const getTabs = (r: UserRole) => {
    switch (r) {
      case "superadmin":
      case "operator":
        return [
          { id: "profile", label: "My Profile", icon: User },
          { id: "system", label: "System Config", icon: Sliders },
          { id: "security", label: "Security & Access", icon: Shield },
        ];
      case "provider":
        return [
          { id: "profile", label: "My Profile", icon: User },
          { id: "service", label: "Rates & Services", icon: Sliders },
          { id: "security", label: "Verification & Pass", icon: Shield },
        ];
      case "customer":
        return [
          { id: "profile", label: "My Profile", icon: User },
          { id: "billing", label: "Billing & Address", icon: CreditCard },
          { id: "notifications", label: "Alert Config", icon: Bell },
        ];
      case "agent":
        return [
          { id: "profile", label: "My Profile", icon: User },
          { id: "payout", label: "Payout Accounts", icon: CreditCard },
          { id: "security", label: "Security & Pass", icon: Shield },
        ];
      default:
        return [];
    }
  };

  const tabs = getTabs(role);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Configure profile details and dashboard preferences for {roleName}.</p>
        </div>
        
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm animate-in fade-in slide-in-from-top-1 duration-150">
            <Check size={16} /> Changes saved successfully!
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Tab list */}
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  isActive
                    ? "bg-rose-50 text-rose-600 font-semibold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Column: Tab panels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-3">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Tab: Profile (Shared by all but has custom fields) */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Profile Information</h3>
                  <p className="text-xs text-slate-500 mt-1">Update your basic profile inputs and contact detail.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
                    <input
                      type="text"
                      defaultValue={role === "superadmin" ? "Aftab Farhan" : role === "operator" ? "Tanvir Rahman" : role === "provider" ? "Kabir Hossain" : "Sharmin Akter"}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
                    <input
                      type="email"
                      defaultValue={role === "superadmin" ? "aftab@rajseba.com" : role === "operator" ? "tanvir@rajseba.com" : role === "provider" ? "kabir.ac@rajseba.com" : "sharmin@gmail.com"}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue={role === "provider" ? "+880 1712 345678" : "+880 1819 876543"}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                    />
                  </div>

                  {role === "provider" && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Years of Experience</label>
                      <input
                        type="number"
                        defaultValue="5"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                      />
                    </div>
                  )}
                </div>

                {role === "provider" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Service Bio / Description</label>
                    <textarea
                      rows={3}
                      defaultValue="Certified HVAC repair expert with 5 years experience servicing residential and commercial AC units in Dhaka."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Tab: System Settings (Admin / Operator only) */}
            {activeTab === "system" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">System Configurations</h3>
                  <p className="text-xs text-slate-500 mt-1">Control platform rules, service prices, and dispatcher options.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Base Booking Commission (%)</label>
                    <input
                      type="number"
                      defaultValue="15"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Min Professional Rating Requirement</label>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue="4.5"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Operational Zones (Bangladesh)</label>
                  <div className="flex flex-wrap gap-2">
                    {["Gulshan", "Banani", "Uttara", "Dhanmondi", "Mirpur", "Wari"].map((zone, idx) => (
                      <span key={idx} className="bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1 rounded-xl text-xs font-semibold">
                        {zone} ✓
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Service Provider Config (Provider only) */}
            {activeTab === "service" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Rates &amp; Services Config</h3>
                  <p className="text-xs text-slate-500 mt-1">Configure your active categories and hourly pricing rate.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Base Hourly Rate (৳)</label>
                    <input
                      type="number"
                      defaultValue="450"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Gas Refill service charge (৳)</label>
                    <input
                      type="number"
                      defaultValue="1400"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">My Active Categories</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["AC Maintenance", "AC Leak Fixing", "Gas Refilling", "Compressor Replacement"].map((skill, idx) => (
                      <label key={idx} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 cursor-pointer">
                        <input type="checkbox" defaultChecked className="accent-rose-500" />
                        <span className="font-medium">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Billing & Address (Customer only) */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Billing Address &amp; Accounts</h3>
                  <p className="text-xs text-slate-500 mt-1">Manage saved home/office address and preferred payment options.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Primary Home Address</label>
                  <input
                    type="text"
                    defaultValue="House 24, Road 4, Sector 12, Mirpur, Dhaka"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Saved Payment Methods</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border border-rose-100 bg-rose-50/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-rose-500 text-white px-2 py-1 rounded">bKash</span>
                        <span className="text-sm font-semibold text-slate-700">01712 ****78</span>
                      </div>
                      <span className="text-xs text-rose-500 font-bold">Primary</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-indigo-600 text-white px-2 py-1 rounded">Visa</span>
                        <span className="text-sm font-semibold text-slate-700">**** **** **** 4812</span>
                      </div>
                      <button className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Payout Accounts (Agent only) */}
            {activeTab === "payout" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Payout Accounts</h3>
                  <p className="text-xs text-slate-500 mt-1">Configure your bKash, Nagad or Bank Account details to withdraw commissions.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Primary Mobile Wallet</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                      defaultValue="bKash"
                    >
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Wallet Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+880 1712 345678"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Security & Passwords */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Security Credentials</h3>
                  <p className="text-xs text-slate-500 mt-1">Configure user login credentials and security tokens.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Notifications (Customer only) */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
                  <p className="text-xs text-slate-500 mt-1">Configure your preferred alerts and push notification logs.</p>
                </div>

                <div className="space-y-2">
                  {[
                    { label: "Email Booking Reciepts", desc: "Receive automated billing breakdowns via email", active: true },
                    { label: "SMS Arrival Alerts", desc: "Get text messages when technician is en route to address", active: true },
                    { label: "Monthly platform newsletters", desc: "Promotions and discount updates on seasonal services", active: false },
                  ].map((notif, idx) => (
                    <label key={idx} className="flex items-start gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 cursor-pointer transition-colors">
                      <input type="checkbox" defaultChecked={notif.active} className="accent-rose-500 mt-1" />
                      <div>
                        <h5 className="text-sm font-semibold text-slate-800">{notif.label}</h5>
                        <p className="text-xs text-slate-400 mt-0.5">{notif.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Save size={16} /> Save Settings
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
}
