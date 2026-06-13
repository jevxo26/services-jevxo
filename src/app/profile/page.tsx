"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Settings, 
  Lock, 
  Camera, 
  Bell, 
  Shield, 
  CheckCircle,
  Clock,
  Star,
  ChevronRight,
  Plus
} from "lucide-react";

// Mock customer profile data
const INITIAL_PROFILE = {
  name: "Ashfaqur Rahman",
  email: "ashfaqur@example.com",
  phone: "+880 1712-345678",
  address: "House 24, Road 12, Banani, Dhaka",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop",
  memberSince: "October 2024",
  tier: "Gold Member",
  tierColor: "from-amber-400 to-yellow-600"
};

const MOCK_BOOKINGS = [
  {
    id: "B001",
    serviceName: "AC Maintenance Service",
    provider: "Dhaka Cool Experts",
    date: "June 18, 2026",
    time: "10:00 AM - 12:00 PM",
    price: "৳750",
    status: "Scheduled",
    statusColor: "bg-blue-50 text-blue-600 border-blue-100",
    icon: Clock
  },
  {
    id: "B002",
    serviceName: "Full Home Deep Cleaning",
    provider: "Sparkle Home Care",
    date: "May 20, 2026",
    time: "09:00 AM - 01:00 PM",
    price: "৳1,200",
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: CheckCircle
  },
  {
    id: "B003",
    serviceName: "Electric Panel Repairs",
    provider: "VoltGuard Solutions",
    date: "April 10, 2026",
    time: "03:00 PM - 05:00 PM",
    price: "৳850",
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: CheckCircle
  }
];

const MOCK_SAVED_EXPERTS = [
  {
    id: "E001",
    name: "Jahangir Alam",
    role: "Senior Electrician",
    rating: 4.8,
    jobs: 142,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    available: true,
    distance: "1.2 km away"
  },
  {
    id: "E002",
    name: "Rashedul Islam",
    role: "Expert Plumber",
    rating: 4.9,
    jobs: 98,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    available: false,
    distance: "2.5 km away"
  },
  {
    id: "E003",
    name: "Asma Begum",
    role: "Home Cleaning Pro",
    rating: 5.0,
    jobs: 210,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    available: true,
    distance: "0.8 km away"
  }
];

type TabType = "personal" | "bookings" | "saved" | "settings";

const tabVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.25 } }
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushAlerts: true,
    smsAlerts: false,
    promotions: true
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      ...formData
    }));
    setEditMode(false);
    showToast("Profile information updated successfully!");
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Security password updated successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        
        {/* Toast Alert Banner */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#FF5A5F] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-semibold text-sm border border-rose-400"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PROFILE HEADER BANNER ── */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs mb-8">
          <div className="h-40 md:h-48 relative bg-slate-200">
            <Image
              src={profile.coverImage}
              alt="Profile Cover"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          </div>
          
          <div className="px-6 md:px-10 pb-6 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 -mt-16 md:-mt-10 relative z-10 text-center md:text-left">
              {/* Profile Avatar */}
              <div className="w-28 h-28 rounded-full border-4 border-white bg-slate-100 overflow-hidden relative shadow-md">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
                <Button 
                  variant="ghost"
                  className="absolute bottom-1 right-1 w-7 h-7 p-0 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full flex items-center justify-center shadow-xs transition-all duration-200 active:scale-95 cursor-pointer hover:text-slate-750 hover:border-slate-300"
                  aria-label="Upload photo"
                  onClick={() => showToast("Avatar upload feature coming soon!")}
                >
                  <Camera className="w-3.5 h-3.5" />
                </Button>
              </div>
              
              <div className="space-y-1.5 pt-1">
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {profile.name}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider text-white bg-gradient-to-r ${profile.tierColor} uppercase shadow-xs`}>
                    {profile.tier}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.address.split(", ").slice(-2).join(", ")}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden md:inline-block" />
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Member since {profile.memberSince}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                variant="outline"
                onClick={() => setEditMode(!editMode)}
                className="flex-1 md:flex-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-extrabold px-5 py-3 h-auto rounded-xl border border-slate-200 transition-all cursor-pointer active:scale-98"
              >
                {editMode ? "Cancel Editing" : "Edit Profile"}
              </Button>
              <Button 
                onClick={() => showToast("Booking shortcuts loaded!")}
                className="flex-1 md:flex-none bg-[#FF5A5F] hover:bg-[#FF4449] text-white text-xs font-extrabold px-5 py-3 h-auto rounded-xl border-none transition-all cursor-pointer shadow-xs active:scale-98"
              >
                Book a Service
              </Button>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENTS GRID ── */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT TABS SIDEBAR (4 Columns on LG) ── */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-4 shadow-xs space-y-1">
            <h2 className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Account Control
            </h2>
            
            <Button
              variant="ghost"
              onClick={() => { setActiveTab("personal"); setEditMode(false); }}
              className={`w-full flex items-center justify-between p-3.5 h-auto rounded-2xl transition-all duration-200 cursor-pointer hover:bg-slate-50 ${
                activeTab === "personal" 
                  ? "bg-[#FFF0F1] hover:bg-[#FFF0F1] text-[#FF5A5F] hover:text-[#FF5A5F] font-bold" 
                  : "text-slate-600 font-medium hover:text-slate-700"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`p-2 rounded-xl transition-all ${activeTab === "personal" ? "bg-[#FF5A5F]/10 text-[#FF5A5F]" : "bg-slate-100 text-slate-500"}`}>
                  <User className="w-4 h-4" />
                </span>
                <span className="text-sm">Personal Info</span>
              </span>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeTab === "personal" ? "rotate-90 text-[#FF5A5F]" : ""}`} />
            </Button>

            <Button
              variant="ghost"
              onClick={() => { setActiveTab("bookings"); setEditMode(false); }}
              className={`w-full flex items-center justify-between p-3.5 h-auto rounded-2xl transition-all duration-200 cursor-pointer hover:bg-slate-50 ${
                activeTab === "bookings" 
                  ? "bg-[#FFF0F1] hover:bg-[#FFF0F1] text-[#FF5A5F] hover:text-[#FF5A5F] font-bold" 
                  : "text-slate-600 font-medium hover:text-slate-700"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`p-2 rounded-xl transition-all ${activeTab === "bookings" ? "bg-[#FF5A5F]/10 text-[#FF5A5F]" : "bg-slate-100 text-slate-500"}`}>
                  <Calendar className="w-4 h-4" />
                </span>
                <span className="text-sm">My Bookings</span>
              </span>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeTab === "bookings" ? "rotate-90 text-[#FF5A5F]" : ""}`} />
            </Button>

            <Button
              variant="ghost"
              onClick={() => { setActiveTab("saved"); setEditMode(false); }}
              className={`w-full flex items-center justify-between p-3.5 h-auto rounded-2xl transition-all duration-200 cursor-pointer hover:bg-slate-50 ${
                activeTab === "saved" 
                  ? "bg-[#FFF0F1] hover:bg-[#FFF0F1] text-[#FF5A5F] hover:text-[#FF5A5F] font-bold" 
                  : "text-slate-600 font-medium hover:text-slate-700"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`p-2 rounded-xl transition-all ${activeTab === "saved" ? "bg-[#FF5A5F]/10 text-[#FF5A5F]" : "bg-slate-100 text-slate-500"}`}>
                  <Heart className="w-4 h-4" />
                </span>
                <span className="text-sm">Saved Experts</span>
              </span>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeTab === "saved" ? "rotate-90 text-[#FF5A5F]" : ""}`} />
            </Button>

            <Button
              variant="ghost"
              onClick={() => { setActiveTab("settings"); setEditMode(false); }}
              className={`w-full flex items-center justify-between p-3.5 h-auto rounded-2xl transition-all duration-200 cursor-pointer hover:bg-slate-50 ${
                activeTab === "settings" 
                  ? "bg-[#FFF0F1] hover:bg-[#FFF0F1] text-[#FF5A5F] hover:text-[#FF5A5F] font-bold" 
                  : "text-slate-600 font-medium hover:text-slate-700"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`p-2 rounded-xl transition-all ${activeTab === "settings" ? "bg-[#FF5A5F]/10 text-[#FF5A5F]" : "bg-slate-100 text-slate-500"}`}>
                  <Settings className="w-4 h-4" />
                </span>
                <span className="text-sm">Preferences & Security</span>
              </span>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeTab === "settings" ? "rotate-90 text-[#FF5A5F]" : ""}`} />
            </Button>
          </div>

          {/* ── RIGHT CONTENT PANEL (8 Columns on LG) ── */}
          <div className="lg:col-span-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: Personal Info */}
              {activeTab === "personal" && (
                <motion.div
                  key="personal"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs"
                >
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                    <p className="text-xs text-slate-500">Update and manage your primary contact details.</p>
                  </div>
                  
                  {editMode ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">Full Name</label>
                          <input 
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/10 transition-all"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">Email Address</label>
                          <input 
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/10 transition-all"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">Phone Number</label>
                        <input 
                          type="text"
                          value={formData.phone}
                          onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/10 transition-all"
                          required
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">Address</label>
                        <input 
                          type="text"
                          value={formData.address}
                          onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/10 transition-all"
                          required
                        />
                      </div>
                      
                      <div className="flex gap-3 pt-3 border-t border-slate-100">
                        <Button
                          type="submit"
                          className="bg-[#FF5A5F] hover:bg-[#FF4449] text-white text-xs font-extrabold px-6 py-3 h-auto rounded-xl border-none transition-all shadow-xs active:scale-95 cursor-pointer"
                        >
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => { setFormData(profile); setEditMode(false); }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold px-6 py-3 h-auto rounded-xl border-none transition-all active:scale-95 cursor-pointer hover:text-slate-700 hover:bg-slate-200"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Full Name</span>
                          <span className="text-sm font-semibold text-slate-800 flex items-center gap-2.5">
                            <span className="p-1.5 bg-slate-50 border border-slate-150 rounded-lg text-slate-500">
                              <User className="w-3.5 h-3.5" />
                            </span>
                            {profile.name}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Email Address</span>
                          <span className="text-sm font-semibold text-slate-800 flex items-center gap-2.5">
                            <span className="p-1.5 bg-slate-50 border border-slate-150 rounded-lg text-slate-500">
                              <Mail className="w-3.5 h-3.5" />
                            </span>
                            {profile.email}
                          </span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Phone Number</span>
                          <span className="text-sm font-semibold text-slate-800 flex items-center gap-2.5">
                            <span className="p-1.5 bg-slate-50 border border-slate-150 rounded-lg text-slate-500">
                              <Phone className="w-3.5 h-3.5" />
                            </span>
                            {profile.phone}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Primary Address</span>
                          <span className="text-sm font-semibold text-slate-800 flex items-center gap-2.5">
                            <span className="p-1.5 bg-slate-50 border border-slate-150 rounded-lg text-slate-500">
                              <MapPin className="w-3.5 h-3.5" />
                            </span>
                            {profile.address}
                          </span>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                          <Shield className="w-4 h-4 text-emerald-500" />
                          <span>All communications and service addresses are verified.</span>
                        </div>
                        <Button
                          onClick={() => setEditMode(true)}
                          className="w-full sm:w-auto bg-rose-50 hover:bg-[#FFF0F1] text-[#FF5A5F] hover:text-[#FF5A5F] text-xs font-extrabold px-4 py-2.5 h-auto rounded-xl border-none transition-all shadow-xs cursor-pointer active:scale-95 text-center"
                        >
                          Modify Details
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: Bookings History */}
              {activeTab === "bookings" && (
                <motion.div
                  key="bookings"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs"
                >
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Booking History</h3>
                    <p className="text-xs text-slate-500">Track and manage scheduled or completed services.</p>
                  </div>
                  
                  <div className="space-y-6">
                    {MOCK_BOOKINGS.map((booking) => {
                      const StatusIcon = booking.icon;
                      return (
                        <div 
                          key={booking.id}
                          className="border border-slate-100 hover:border-slate-200 rounded-2xl p-5 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 bg-white"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                              <span className="text-[10px] font-black text-[#FF5A5F] uppercase tracking-wider block mb-0.5">Booking ID: {booking.id}</span>
                              <h4 className="font-extrabold text-slate-800 text-base">{booking.serviceName}</h4>
                            </div>
                            <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold border ${booking.statusColor} flex items-center gap-1.5`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {booking.status}
                            </span>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-4 border-t border-slate-50 pt-4 text-xs font-semibold text-slate-500">
                            <div>
                              <span className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Service Vendor</span>
                              <span className="text-slate-700">{booking.provider}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Scheduled Date & Time</span>
                              <span className="text-slate-700">{booking.date} at {booking.time.split(" ")[0]}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Total Fare Charged</span>
                              <span className="text-[#FF5A5F] font-extrabold text-sm">{booking.price}</span>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-50/50">
                            {booking.status === "Scheduled" ? (
                              <>
                                <Button 
                                  variant="outline"
                                  onClick={() => showToast("Reschedule request submitted successfully.")}
                                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-extrabold px-4 py-2 h-auto rounded-lg border border-slate-200 transition-all cursor-pointer active:scale-95"
                                >
                                  Reschedule
                                </Button>
                                <Button 
                                  onClick={() => showToast("Cancellation request submitted.")}
                                  className="bg-rose-50 hover:bg-[#FFF0F1] text-[#FF5A5F] hover:text-[#FF5A5F] text-xs font-extrabold px-4 py-2 h-auto rounded-lg border-none transition-all cursor-pointer active:scale-95"
                                >
                                  Cancel Booking
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="outline"
                                onClick={() => showToast("Support details request submitted.")}
                                className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-extrabold px-4 py-2 h-auto rounded-lg border border-slate-200 transition-all cursor-pointer active:scale-95"
                              >
                                View Details / Invoice
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: Saved Experts */}
              {activeTab === "saved" && (
                <motion.div
                  key="saved"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs"
                >
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Saved Experts</h3>
                    <p className="text-xs text-slate-500">Your curated collection of favorited home technicians.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    {MOCK_SAVED_EXPERTS.map((expert) => (
                      <div 
                        key={expert.id}
                        className="border border-slate-100 rounded-2xl p-5 hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.03)] hover:border-[#FF5A5F]/20 transition-all duration-300 bg-white flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-4.5 mb-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 relative border border-slate-150">
                              <Image
                                src={expert.avatar}
                                alt={expert.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{expert.name}</h4>
                              <p className="text-xs font-semibold text-slate-400">{expert.role}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-50 py-3 my-3 text-xs font-semibold text-slate-500">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-slate-800 font-bold">{expert.rating.toFixed(1)}</span>
                              <span className="text-slate-400">({expert.jobs} jobs)</span>
                            </div>
                            <div className="text-right text-slate-400">
                              {expert.distance}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 mt-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${expert.available ? "bg-emerald-500" : "bg-amber-400"}`} />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {expert.available ? "Available" : "Busy"}
                            </span>
                          </div>
                          <Button 
                            onClick={() => showToast(`Initiating direct book link for ${expert.name}`)}
                            className="bg-rose-50 hover:bg-[#FFF0F1] text-[#FF5A5F] hover:text-[#FF5A5F] text-xs font-extrabold px-3 py-1.5 h-auto rounded-xl border-none transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: Preferences & Security */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-8"
                >
                  {/* Preferences Section */}
                  <div>
                    <div className="border-b border-slate-100 pb-4 mb-6">
                      <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
                      <p className="text-xs text-slate-500">Configure how you receive updates and recommendations.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/40">
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-sm">Email Alerts</h4>
                          <p className="text-xs text-slate-400">Receive invoices, receipts, and order statuses in email.</p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setNotificationSettings(prev => ({ ...prev, emailAlerts: !prev.emailAlerts }));
                            showToast("Email notification settings updated.");
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer outline-none border-none p-0 shadow-none hover:bg-transparent ${
                            notificationSettings.emailAlerts ? "bg-[#FF5A5F]" : "bg-slate-300"
                          }`}
                        >
                          <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${
                            notificationSettings.emailAlerts ? "translate-x-5" : "translate-x-0"
                          }`} />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/40">
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-sm">App Push Notifications</h4>
                          <p className="text-xs text-slate-400">Real-time alerts for technician locations and chat updates.</p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setNotificationSettings(prev => ({ ...prev, pushAlerts: !prev.pushAlerts }));
                            showToast("Push notification settings updated.");
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer outline-none border-none p-0 shadow-none hover:bg-transparent ${
                            notificationSettings.pushAlerts ? "bg-[#FF5A5F]" : "bg-slate-300"
                          }`}
                        >
                          <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${
                            notificationSettings.pushAlerts ? "translate-x-5" : "translate-x-0"
                          }`} />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/40">
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-sm">SMS alerts</h4>
                          <p className="text-xs text-slate-400">Receive urgent dispatch and verification codes via text.</p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setNotificationSettings(prev => ({ ...prev, smsAlerts: !prev.smsAlerts }));
                            showToast("SMS notification settings updated.");
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer outline-none border-none p-0 shadow-none hover:bg-transparent ${
                            notificationSettings.smsAlerts ? "bg-[#FF5A5F]" : "bg-slate-300"
                          }`}
                        >
                          <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${
                            notificationSettings.smsAlerts ? "translate-x-5" : "translate-x-0"
                          }`} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div>
                    <div className="border-b border-slate-100 pb-4 mb-6">
                      <h3 className="text-lg font-bold text-slate-900">Security & Credentials</h3>
                      <p className="text-xs text-slate-500">Update your security codes and view account standards.</p>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">Current Password</label>
                        <input 
                          type="password"
                          placeholder="••••••••"
                          className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-850 outline-none focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/10 transition-all"
                          required
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">New Password</label>
                        <input 
                          type="password"
                          placeholder="Minimum 8 characters"
                          className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-850 outline-none focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/10 transition-all"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="bg-[#FF5A5F] hover:bg-[#FF4449] text-white text-xs font-extrabold px-5 py-3 h-auto rounded-xl border-none transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        Change Password
                      </Button>
                    </form>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
