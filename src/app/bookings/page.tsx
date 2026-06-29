"use client";

import { useState } from "react";
import { useGetAllBookingsQuery, useUpdateBookingStatusMutation, useDeleteBookingMutation } from "@/redux/features/admin/booking";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  Package as PkgIcon,
  User,
  X,
  Search,
  Lock,
  LogIn,
  UserPlus,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Trash2,
  Sparkles,
  ChevronRight,
  FileText
} from "lucide-react";

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled" | "assigned" | "on_the_way";

const STATUS_CONFIG: Record<
  BookingStatus,
  {
    label: string;
    pillBg: string;
    pillText: string;
    borderColor: string;
    iconBg: string;
    iconText: string;
    glowColor: string;
  }
> = {
  confirmed: {
    label: "Confirmed",
    pillBg: "bg-[#FFF8F4] border-[#FF6014]/20",
    pillText: "text-[#FF6014]",
    borderColor: "border-l-[#FF6014]",
    iconBg: "bg-[#FFF8F4]",
    iconText: "text-[#FF6014]",
    glowColor: "shadow-[0_0_15px_rgba(255,96,20,0.08)]",
  },
  assigned: {
    label: "Assigned",
    pillBg: "bg-blue-50/70 border-blue-100",
    pillText: "text-blue-600",
    borderColor: "border-l-blue-500",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    glowColor: "shadow-[0_0_15px_rgba(59,130,246,0.08)]",
  },
  on_the_way: {
    label: "On the way",
    pillBg: "bg-purple-50/70 border-purple-100",
    pillText: "text-purple-600",
    borderColor: "border-l-purple-500",
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
    glowColor: "shadow-[0_0_15px_rgba(168,85,247,0.08)]",
  },
  pending: {
    label: "Pending",
    pillBg: "bg-amber-50/70 border-amber-100",
    pillText: "text-amber-600",
    borderColor: "border-l-amber-500",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    glowColor: "shadow-[0_0_15px_rgba(245,158,11,0.08)]",
  },
  completed: {
    label: "Completed",
    pillBg: "bg-emerald-50/70 border-emerald-100",
    pillText: "text-emerald-600",
    borderColor: "border-l-emerald-500",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    glowColor: "shadow-[0_0_15px_rgba(16,185,129,0.08)]",
  },
  cancelled: {
    label: "Cancelled",
    pillBg: "bg-red-50/70 border-red-100",
    pillText: "text-red-500",
    borderColor: "border-l-red-500",
    iconBg: "bg-red-50",
    iconText: "text-red-500",
    glowColor: "shadow-[0_0_15px_rgba(239,68,68,0.08)]",
  },
};

const FILTERS: { label: string; value: "all" | BookingStatus }[] = [
  { label: "All Bookings", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Assigned", value: "assigned" },
  { label: "On the way", value: "on_the_way" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

// Framer Motion Animation Variants
const staggerContainer: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const cardFadeUp: any = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function BookingsPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAppSelector((state) => state.auth);
  const { data: bookingsRes, isLoading: isBookingsLoading } = useGetAllBookingsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

  const [activeFilter, setActiveFilter] = useState<"all" | BookingStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const bookings = bookingsRes?.data || [];

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await updateStatus({ id, status: "cancelled" }).unwrap();
      toast.success("Booking cancelled successfully.");
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev: any) => ({ ...prev, status: "cancelled" }));
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to cancel booking.");
    }
  };

  const executeDelete = async (id: number) => {
    try {
      await deleteBooking(id).unwrap();
      toast.success("Booking deleted successfully.");
      if (selectedBooking?.id === id) setSelectedBooking(null);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete booking.");
    }
  };

  const handleDelete = (id: number) => {
    toast.error("Are you sure you want to permanently delete this booking?", {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm Delete",
        onClick: () => executeDelete(id),
      },
      duration: 6000,
    });
  };

  const filtered = bookings.filter((b: any) => {
    const matchFilter = activeFilter === "all" || b.status === activeFilter;
    const serviceName = b.nestedService?.name || b.pkg?.name || "";
    const vendorName = b.vendor?.name || "";
    const matchSearch =
      !search ||
      serviceName.toLowerCase().includes(search.toLowerCase()) ||
      vendorName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getStats = () => {
    let pending = 0, completed = 0, cancelled = 0;
    bookings.forEach((b: any) => {
      if (b.status === "pending" || b.status === "assigned" || b.status === "on_the_way") pending++;
      if (b.status === "completed") completed++;
      if (b.status === "cancelled") cancelled++;
    });
    return [
      {
        label: "Total Bookings",
        value: bookings.length.toString(),
        sub: "All time records",
        icon: Briefcase,
        stripeColor: "bg-[#FF6014]",
        iconContainerColor: "bg-[#FFF8F4] border-[#FF6014]/15",
        iconColor: "text-[#FF6014]",
        gradient: "from-white via-white to-orange-50/15",
        borderColor: "hover:border-[#FF6014]/25",
        shadow: "hover:shadow-[0_20px_40px_rgba(255,96,20,0.05)]"
      },
      {
        label: "Upcoming",
        value: pending.toString(),
        sub: "In progress",
        icon: Clock,
        stripeColor: "bg-amber-500",
        iconContainerColor: "bg-amber-50 border-amber-500/15",
        iconColor: "text-amber-500",
        gradient: "from-white via-white to-amber-50/15",
        borderColor: "hover:border-amber-500/25",
        shadow: "hover:shadow-[0_20px_40px_rgba(245,158,11,0.05)]"
      },
      {
        label: "Completed",
        value: completed.toString(),
        sub: "Finished services",
        icon: CheckCircle2,
        stripeColor: "bg-emerald-500",
        iconContainerColor: "bg-emerald-50 border-emerald-500/15",
        iconColor: "text-emerald-500",
        gradient: "from-white via-white to-emerald-50/15",
        borderColor: "hover:border-emerald-500/25",
        shadow: "hover:shadow-[0_20px_40px_rgba(16,185,129,0.05)]"
      },
      {
        label: "Cancelled",
        value: cancelled.toString(),
        sub: "Declined requests",
        icon: ShieldAlert,
        stripeColor: "bg-rose-500",
        iconContainerColor: "bg-rose-50 border-rose-500/15",
        iconColor: "text-rose-500",
        gradient: "from-white via-white to-rose-50/15",
        borderColor: "hover:border-rose-500/25",
        shadow: "hover:shadow-[0_20px_40px_rgba(244,63,94,0.05)]"
      },
    ];
  };

  // If still checking authentication, show a premium layout loader
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F4]/10 flex flex-col justify-center items-center py-16">
        <div className="w-10 h-10 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing bookings page...</p>
      </div>
    );
  }

  // 1. GUEST STATE (UNAUTHENTICATED)
  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#FFF8F4]/40 via-white to-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center">
        {/* Soft premium background glows */}
        <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] bg-[#FF6014]/4 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[450px] h-[450px] bg-[#FF6014]/2 blur-[130px] rounded-full pointer-events-none" />
        <div
          className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
          style={{ backgroundSize: 'auto' }}
        />

        <div className="mx-auto max-w-2xl w-full text-center relative z-10 space-y-6">
          {/* Lock Icon */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="inline-flex p-4.5 bg-[#FFF8F4] text-[#FF6014] rounded-3xl border border-[#FF6014]/15 shadow-sm shadow-[#FF6014]/5 mb-2"
          >
            <Lock className="w-8 h-8" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight"
          >
            Manage Your <span className="text-[#FF6014]">Schedules</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-semibold"
          >
            Please log in to your account to view booking summaries, active schedules, and track your verified home care experts.
          </motion.p>

          {/* Cards showcasing benefits */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-left"
          >
            <motion.div variants={cardFadeUp} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-[#FF6014]/10 transition-colors">
              <div className="w-8 h-8 bg-[#FFF8F4] text-[#FF6014] rounded-xl flex items-center justify-center mb-3">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Real-time Tracker</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-1.5 leading-relaxed">Track your service provider as they arrive.</p>
            </motion.div>
            <motion.div variants={cardFadeUp} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-[#FF6014]/10 transition-colors">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Satisfied Guarantee</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-1.5 leading-relaxed">Release funds only when you are satisfied.</p>
            </motion.div>
            <motion.div variants={cardFadeUp} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-[#FF6014]/10 transition-colors col-span-2 sm:col-span-1">
              <div className="w-8 h-8 bg-purple-50 text-purple-50 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Premium Perks</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-1.5 leading-relaxed">Access exclusive promo codes and rewards.</p>
            </motion.div>
          </motion.div>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF6014] hover:bg-[#E0530A] text-white font-extrabold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                <LogIn className="w-4 h-4" />
                Sign In Now
              </motion.button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-extrabold py-3.5 px-8 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                <UserPlus className="w-4 h-4" />
                Create Free Account
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  // 2. AUTHENTICATED STATE
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FFF8F4]/20 via-white to-white px-4 py-8 md:py-12 lg:px-8 relative overflow-hidden">
      {/* Background radial depth glow */}
      <div className="absolute top-[5%] left-[-10%] w-[350px] h-[350px] bg-[#FF6014]/3 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[450px] h-[450px] bg-[#FF6014]/2 blur-[150px] rounded-full pointer-events-none" />
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: 'auto' }}
      />

      <div className="mx-auto max-w-5xl relative z-10">

        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF8F4] text-[#FF6014] rounded-2xl border border-[#FF6014]/15 shadow-sm shadow-[#FF6014]/2">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">My Bookings</h1>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">View your schedule times, order status, and booking history</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {getStats().map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={cardFadeUp}
                whileHover={{ y: -5 }}
                className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} p-5 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 ${stat.borderColor} ${stat.shadow} group`}
              >
                {/* Stripe accent line at the top */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${stat.stripeColor}`} />

                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                    {stat.label}
                  </span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${stat.iconContainerColor} ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                    <Icon size={14} />
                  </div>
                </div>

                <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3 mb-0.5">
                  {stat.value}
                </h2>
                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">{stat.sub}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filters and Search Bar Container */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-3xl border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] mb-6 space-y-4"
        >
          {/* Search bar */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 focus-within:border-[#FF6014]/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#FF6014]/5 transition-all">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bookings by service name or provider..."
              className="flex-1 bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-650 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
                  activeFilter === f.value
                    ? "bg-[#FF6014] text-white shadow-sm shadow-[#FF6014]/20"
                    : "bg-[#FFF8F4] text-[#FF6014] hover:bg-[#FFF0EB] border border-[#FF6014]/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bookings List */}
        <motion.div 
          layout
          className="space-y-4"
        >
          {isBookingsLoading ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 border-2 border-[#FF6014] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest animate-pulse">Loading your bookings...</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFF8F4] text-[#FF6014] flex items-center justify-center mx-auto border border-[#FF6014]/10">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">No Bookings Found</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-semibold">
                  {search ? "No matching records found. Try adjusting your search query." : "You don't have any bookings in this category yet."}
                </p>
              </div>
              {!search && (
                <Link href="/services" className="inline-block pt-1">
                  <button className="bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-extrabold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md hover:shadow-[0_8px_20px_rgba(255,96,20,0.2)] uppercase tracking-wider">
                    Book a Service
                  </button>
                </Link>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((booking: any) => {
                const cfg = STATUS_CONFIG[booking.status as BookingStatus] || STATUS_CONFIG['pending'];
                const serviceName = booking.nestedService?.name || booking.pkg?.name || "Premium Home Service";
                const dateStr = booking.date
                  ? new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                  : "Scheduled Date N/A";

                return (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    whileHover={{ y: -3, boxShadow: "0 12px 30px -5px rgba(0,0,0,0.03)" }}
                    className={`flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border-l-4 bg-white p-5 border border-slate-100/90 transition-all ${cfg.borderColor} ${cfg.glowColor}`}
                  >
                    {/* Left Column: Icon and Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${cfg.iconBg} ${cfg.iconText} border border-slate-100 shadow-inner`}>
                        {booking.nestedService ? <Briefcase size={20} /> : <PkgIcon size={20} />}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-extrabold text-slate-800 truncate leading-snug">
                          {serviceName}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-400">
                          <span className="flex items-center gap-1.5 shrink-0"><Calendar size={13} className="text-slate-400" /> {dateStr}</span>
                          <span className="flex items-center gap-1.5 shrink-0"><User size={13} className="text-slate-400" /> {booking.vendor?.name || "Expert assignment pending"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Status pill and details CTA */}
                    <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-3 pt-3.5 md:pt-0 border-t border-slate-50 md:border-0">
                      <span className={`rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider border ${cfg.pillBg} ${cfg.pillText} select-none`}>
                        {cfg.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded-xl border border-slate-200 hover:border-[#FF6014] hover:text-[#FF6014] bg-slate-50/50 hover:bg-[#FFF8F4] px-4 py-2.5 text-xs font-extrabold text-slate-600 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
                        >
                          View Details
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          disabled={isDeleting}
                          className="p-2.5 rounded-xl border border-rose-100 hover:border-rose-500 hover:text-white hover:bg-rose-500 text-rose-500 bg-rose-50/50 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                          title="Delete Booking"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* Details Modal with AnimatePresence */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 relative z-10"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF6014] animate-pulse" />
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Booking Information
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-800 leading-snug">
                      {selectedBooking.nestedService?.name || selectedBooking.pkg?.name || "Premium Home Service"}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      Booking ID: <span className="font-mono text-slate-700">#{selectedBooking.id}</span>
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider border shrink-0 ${STATUS_CONFIG[selectedBooking.status as BookingStatus]?.pillBg} ${STATUS_CONFIG[selectedBooking.status as BookingStatus]?.pillText}`}>
                    {STATUS_CONFIG[selectedBooking.status as BookingStatus]?.label || selectedBooking.status}
                  </span>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400" /> Date
                    </p>
                    <p className="text-xs font-extrabold text-slate-750">
                      {selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                    </p>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <User size={12} className="text-slate-400" /> Vendor/Partner
                    </p>
                    <p className="text-xs font-extrabold text-slate-750 truncate">
                      {selectedBooking.vendor?.name || "Pending Assignment"}
                    </p>
                  </div>
                </div>

                {/* Location and Notes */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <div>
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-400" /> Delivery Address
                    </p>
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">{selectedBooking.location || "No address provided"}</p>
                  </div>

                  {selectedBooking.notes && (
                    <div className="pt-3 border-t border-slate-200/60">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Customer Notes</p>
                      <p className="text-xs font-medium text-slate-650 italic bg-white p-3 rounded-xl border border-slate-100">
                        "{selectedBooking.notes}"
                      </p>
                    </div>
                  )}

                  {selectedBooking.employee && (
                    <div className="pt-3 border-t border-slate-200/60">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Assigned Service Professional</p>
                      <p className="text-xs font-extrabold text-slate-700">{selectedBooking.employee.name}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  {(selectedBooking.status === "pending" || selectedBooking.status === "assigned") && (
                    <button
                      onClick={() => handleCancel(selectedBooking.id)}
                      disabled={isUpdating}
                      className="w-full bg-amber-55 bg-amber-50 hover:bg-amber-100 text-amber-600 font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer border border-amber-150/40 disabled:opacity-50"
                    >
                      {isUpdating ? "Processing..." : "Cancel Booking Request"}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(selectedBooking.id)}
                    disabled={isDeleting}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer border border-rose-150/40 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    {isDeleting ? "Deleting..." : "Delete Booking"}
                  </button>

                  <p className="text-center text-[10px] text-slate-400 mt-1 font-medium">
                    Note: Booking cancellations or deletions are permanent and cannot be undone.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}