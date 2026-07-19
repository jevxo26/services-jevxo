"use client";

import { Bell, Search, User, ChevronDown, Check, Shield, HardHat, CircleUser, Briefcase, Menu, LogOut, Settings, Languages, X, Calendar, Info, BellRing } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { UserRole, setRole as setAuthRole, getRoleName } from "@/redux/features/auth/authSlice";
import { logout as authLogout } from "@/redux/features/auth/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from "@/redux/features/notification/notificationApi";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";
import { toggleLanguage } from "@/redux/features/shared/langSlice";
import { format } from "date-fns";

export function TopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const authUser = useAppSelector((state) => state.auth.user);
  const role = useAppSelector((state) => state.auth.role) || "client";
  const lang = useAppSelector((state) => state.lang.value);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const roleName = mounted ? getRoleName(role) : (lang === "bn" ? "ক্লায়েন্ট" : "Client");
  const logout = () => dispatch(authLogout());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { data: bookingsRes, isLoading: bookingsLoading } = useGetAllBookingsQuery(undefined, { skip: !mounted });

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'booking' | 'system'>('all');

  const [prevUnreadCount, setPrevUnreadCount] = useState(0);
  const { data: notifications = [], refetch } = useGetNotificationsQuery(undefined, { 
    skip: !mounted,
    pollingInterval: 30000 
  });
  const [markAsRead] = useMarkNotificationAsReadMutation();

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const formatNotificationTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      if (d.toDateString() === now.toDateString()) {
        return format(d, "h:mm a");
      }
      if (d.getFullYear() === now.getFullYear()) {
        return format(d, "MMM d");
      }
      return format(d, "MMM d, yyyy");
    } catch (error) {
      return "";
    }
  };

  const getNotificationIcon = (type: string, isRead: boolean) => {
    const normalizedType = type?.toLowerCase() || '';
    const hasUnreadDot = !isRead;
    
    let iconElement = <Info size={18} />;
    let colorClasses = "text-slate-500 bg-slate-50 border border-slate-100";
    
    if (normalizedType.includes('booking')) {
      iconElement = <Calendar size={18} />;
      colorClasses = "text-[#1E4E8C] bg-[#EEF2FF] border border-[#1E4E8C]/15";
    } else if (normalizedType.includes('reminder')) {
      iconElement = <BellRing size={18} />;
      colorClasses = "text-blue-500 bg-blue-50 border border-blue-100";
    }

    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative ${colorClasses}`}>
        {hasUnreadDot && (
          <span className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border border-white shadow-xs" />
        )}
        {iconElement}
      </div>
    );
  };

  const getNotificationTitle = (type: string) => {
    const normalizedType = type?.toLowerCase() || '';
    if (normalizedType.includes('booking')) {
      return lang === 'bn' ? 'বুকিং আপডেট' : 'Booking Update';
    }
    if (normalizedType.includes('reminder')) {
      return lang === 'bn' ? 'স্মারক' : 'Reminder';
    }
    if (normalizedType.includes('system')) {
      return lang === 'bn' ? 'সিস্টেম এলার্ট' : 'System Alert';
    }
    return lang === 'bn' ? 'নোটিফিকেশন' : 'Notification';
  };

  const filteredNotifications = notifications.filter((n: any) => {
    if (notificationFilter === 'unread') return !n.isRead;
    if (notificationFilter === 'booking') return n.type?.toLowerCase().includes('booking');
    if (notificationFilter === 'system') return !n.type?.toLowerCase().includes('booking');
    return true;
  });

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n: any) => !n.isRead);
    for (const notification of unreadNotifications) {
      try {
        await markAsRead(notification.id).unwrap();
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
  };

  useEffect(() => {
    if (unreadCount > prevUnreadCount) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); // A6
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        console.log("Audio not supported");
      }
    }
    setPrevUnreadCount(unreadCount);
  }, [unreadCount, prevUnreadCount]);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rolesList: { value: UserRole; label: string; desc: string; icon: React.ComponentType<any>; color: string }[] = [
    { value: "superadmin", label: "Super Admin", desc: "System control", icon: Shield, color: "text-[#1E4E8C] bg-[#EEF2FF]" },
    { value: "admin", label: "Admin", desc: "System Administrator", icon: Shield, color: "text-blue-500 bg-blue-50" },
    { value: "agent", label: "Agent", desc: "Booking agent", icon: Briefcase, color: "text-emerald-500 bg-emerald-50" },
    { value: "vendor", label: "Vendor", desc: "Service professional", icon: HardHat, color: "text-teal-500 bg-teal-50" },
    { value: "client", label: "Client", desc: "Client profile", icon: CircleUser, color: "text-indigo-500 bg-indigo-50" },
    { value: "employee", label: "Employee", desc: "Employee profile", icon: HardHat, color: "text-amber-500 bg-amber-50" },
  ];

  // Derive display profile from real user data in Redux
  const name = mounted && authUser?.name ? authUser.name : "User";
  const email = mounted ? (authUser?.email || authUser?.phone || "") : "";
  const avatarText = name.substring(0, 2).toUpperCase();
  const profileImg = mounted ? (authUser?.profile?.avatar || authUser?.profile?.images?.[0] || authUser?.profile?.picture || authUser?.avatar) : undefined;
  const activeRoleConfig = mounted
    ? (rolesList.find((x) => x.value === role) || rolesList.find((x) => x.value === "client") || rolesList[0])
    : (rolesList.find((x) => x.value === "client") || rolesList[0]);

  return (
    <header className="bg-[#EEF2FF]/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center justify-between z-30 sticky top-0 shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <button onClick={onMenuClick} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl md:hidden shrink-0 focus:outline-none transition-colors">
          <Menu size={20} />
        </button>
        <div ref={searchContainerRef} className="relative w-full max-w-md hidden md:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E4E8C] transition-colors" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder={lang === "bn" ? "বুকিং আইডি, সার্ভিস, ক্লায়েন্ট খুঁজুন..." : "Search booking ID, service, client..."}
            className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl pl-11 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#1E4E8C]/30 focus:ring-4 focus:ring-[#EEF2FF] transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowSearchResults(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}

          {showSearchResults && searchQuery && (() => {
            const bookings = bookingsRes?.data || [];
            const results = bookings.filter((b: any) => {
              const q = searchQuery.toLowerCase();
              const matchId = String(b.id).includes(q);
              const matchService = b.service?.name?.toLowerCase().includes(q) || 
                                   b.nestedService?.name?.toLowerCase().includes(q) ||
                                   b.pkg?.name?.toLowerCase().includes(q) ||
                                   b.subServices?.some((s: any) => s.name?.toLowerCase().includes(q));
              const matchUser = b.user?.name?.toLowerCase().includes(q) || 
                                b.user?.email?.toLowerCase().includes(q) ||
                                b.user?.phone?.toLowerCase().includes(q);
              return matchId || matchService || matchUser;
            });

            return (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-[350px] overflow-y-auto">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {lang === "bn" ? "বুকিং ফলাফল" : "Booking Search Results"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-150 px-2 py-0.5 rounded-full shrink-0">
                    {results.length} {lang === "bn" ? "টি পাওয়া গেছে" : "found"}
                  </span>
                </div>
                {bookingsLoading ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#1E4E8C] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-400 font-medium">
                      {lang === "bn" ? "বুকিং খোঁজা হচ্ছে..." : "Searching bookings..."}
                    </span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-1.5 space-y-0.5">
                    {results.map((b: any) => {
                      const clientName = b.user?.name || "Guest Visitor";
                      const serviceName = b.service?.name || b.nestedService?.name || b.pkg?.name || "General Service";
                      const statusColors: Record<string, string> = {
                        pending: 'bg-amber-50 text-amber-600',
                        assigned: 'bg-blue-50 text-blue-600',
                        on_the_way: 'bg-purple-50 text-purple-600',
                        completed: 'bg-emerald-50 text-emerald-600',
                        cancelled: 'bg-red-50 text-red-600'
                      };
                      return (
                        <button
                          key={b.id}
                          onClick={() => {
                            setSearchQuery("");
                            setShowSearchResults(false);
                            router.push(`/dashbord/manage-bookings/${b.id}`);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all text-left group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-black text-slate-800 truncate group-hover:text-[#1E4E8C] transition-colors">
                                {serviceName}
                              </span>
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0">
                                #{b.id}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium truncate">
                              Client: {clientName}
                            </p>
                          </div>
                          <div className="text-right pl-3 shrink-0">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              statusColors[b.status?.toLowerCase()] || 'bg-slate-50 text-slate-600'
                            }`}>
                              {b.status}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 font-medium">
                    {lang === "bn"
                      ? `"${searchQuery}" এর জন্য কোনো বুকিং পাওয়া যায়নি`
                      : `No bookings found matching "${searchQuery}"`}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-5">

        {/* Role Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {(() => {
            const ActiveIcon = activeRoleConfig.icon;
            return (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all shadow-sm focus:outline-none"
                title={lang === "bn" ? "রোল পরিবর্তন করুন" : "Switch Role"}
              >
                <ActiveIcon className="w-4 h-4 text-[#1E4E8C]" />
                <span className="hidden md:inline">{activeRoleConfig.label}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            );
          })()}

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100/90 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  {lang === "bn" ? "রোল নির্বাচন করুন" : "Select Role"}
                </span>
              </div>
              <div className="p-1 space-y-0.5">
                {rolesList.map((r) => {
                  const isSelected = r.value === role;
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.value}
                      onClick={() => {
                        dispatch(setAuthRole(r.value));
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isSelected 
                          ? "bg-[#EEF2FF] text-[#1E4E8C] font-bold" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${r.color}`}>
                          <Icon size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-none">{r.label}</p>
                          <p className="text-[9px] text-slate-400 mt-1 leading-none font-medium">{r.desc}</p>
                        </div>
                      </div>
                      {isSelected && <Check size={14} className="text-[#1E4E8C] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Language Toggle Button */}
        <button
          onClick={() => dispatch(toggleLanguage())}
          className="p-2 sm:p-2.5 hover:bg-slate-50 rounded-xl sm:rounded-full relative text-slate-500 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100 hover:shadow-sm flex items-center gap-1.5 focus:outline-none"
          title={lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
        >
          <Languages size={18} />
          <span className="text-xs font-black uppercase text-slate-600 hidden sm:inline-block">
            {lang === "bn" ? "EN" : "বাং"}
          </span>
        </button>

        {/* Notifications Button */}
        <div className="relative" ref={notificationDropdownRef}>
          <button 
            onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
            className="p-2.5 hover:bg-slate-50 rounded-full relative text-slate-500 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100 hover:shadow-sm"
          >
            <Bell size={18} className={unreadCount > 0 ? "animate-bounce text-[#1E4E8C]" : ""} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          
          {notificationDropdownOpen && (
            <div className="fixed top-[76px] right-4 left-4 sm:absolute sm:top-auto sm:right-0 sm:left-auto sm:w-[400px] bg-white border border-slate-100/85 rounded-[28px] shadow-2xl shadow-slate-900/10 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header */}
              <div className="flex justify-between items-center pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    {lang === "bn" ? "নোটিফিকেশন" : "Notifications"}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-[#1E4E8C] hover:text-[#123C73] font-extrabold transition-all"
                    >
                      {lang === "bn" ? "সব পঠিত করুন" : "Mark all as read"}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setNotificationDropdownOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                {([
                  { value: 'all', labelEn: 'All', labelBn: 'সব' },
                  { value: 'unread', labelEn: 'Unread', labelBn: 'অপঠিত' },
                  { value: 'booking', labelEn: 'Bookings', labelBn: 'বুকিং' },
                  { value: 'system', labelEn: 'System', labelBn: 'সিস্টেম' }
                ] as const).map((tab) => {
                  const isActive = notificationFilter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setNotificationFilter(tab.value)}
                      className={`text-[11px] uppercase tracking-wider font-extrabold px-3.5 py-1.5 rounded-full transition-all shrink-0 active:scale-[0.97] ${
                        isActive
                          ? "bg-slate-950 text-white shadow-xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {lang === "bn" ? tab.labelBn : tab.labelEn}
                    </button>
                  );
                })}
              </div>

              {/* Notification List */}
              <div className="mt-4 space-y-2.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm font-semibold">
                    {lang === "bn" ? "কোনো নোটিফিকেশন পাওয়া যায়নি" : "No notifications found"}
                  </div>
                ) : (
                  filteredNotifications.map((notification) => {
                    const timeStr = formatNotificationTime(notification.createdAt);
                    const titleStr = getNotificationTitle(notification.type);
                    const isUnread = !notification.isRead;
                    return (
                      <div
                        key={notification.id}
                        onClick={() => {
                          if (isUnread) {
                            markAsRead(notification.id);
                          }
                          setNotificationDropdownOpen(false);
                          // Route navigation based on type
                          const isBooking = notification.type?.toLowerCase().includes('booking') || 
                                            notification.message?.toLowerCase().includes('booking') ||
                                            notification.message?.includes('বুকিং');
                          if (isBooking) {
                            if (role === 'client') {
                              router.push('/dashbord/overview');
                            } else {
                              router.push('/dashbord/manage-bookings');
                            }
                          }
                        }}
                        className={`group p-3.5 rounded-[20px] transition-all duration-200 border flex gap-3.5 items-start cursor-pointer relative ${
                          isUnread
                            ? "bg-[#FFFDFB] border-orange-100/70 hover:bg-orange-50/20 hover:border-orange-200/50 shadow-xs"
                            : "bg-slate-50/70 border-transparent hover:bg-slate-50 hover:border-slate-100"
                        }`}
                      >
                        {/* Circular Icon Container */}
                        {getNotificationIcon(notification.type, notification.isRead)}

                        {/* Content Area */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider truncate">
                              {titleStr}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 shrink-0">
                              {timeStr}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed line-clamp-2 ${
                            isUnread ? 'text-slate-900 font-extrabold' : 'text-slate-500 font-semibold'
                          }`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

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
            <div className="w-10 h-10 bg-gradient-to-br from-[#1E4E8C] to-[#1E4E8C] text-white font-bold rounded-xl flex items-center justify-center overflow-hidden shadow-md shadow-[#1E4E8C]/20 select-none transition-transform hover:scale-105 shrink-0">
              {profileImg ? (
                <img src={profileImg} alt={name} className="w-full h-full object-cover" />
              ) : (
                avatarText
              )}
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-[#EEF2FF] border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">

              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1E4E8C] to-[#1E4E8C] text-white font-bold rounded-xl flex items-center justify-center overflow-hidden shadow-md shadow-[#1E4E8C]/20 select-none shrink-0">
                    {profileImg ? (
                      <img src={profileImg} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      avatarText
                    )}
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
                  <span className="font-medium">{lang === "bn" ? "আমার প্রোফাইল" : "My Profile"}</span>
                </Link>

                <Link
                  href="/dashbord/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500">
                    <Settings size={16} />
                  </div>
                  <span className="font-medium">{lang === "bn" ? "সেটিংস" : "Settings"}</span>
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-[#123C73] hover:bg-[#EEF2FF] transition-all"
                >
                  <div className="p-1.5 rounded-lg bg-[#EEF2FF] text-[#1E4E8C]">
                    <LogOut size={16} />
                  </div>
                  <span className="font-semibold">{lang === "bn" ? "লগআউট" : "Sign Out"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}