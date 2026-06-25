"use client";

import { useState } from "react";
import { useGetAllBookingsQuery, useUpdateBookingStatusMutation, useDeleteBookingMutation } from "@/redux/features/admin/booking";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import Link from "next/link";
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
  Trash2
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
  }
> = {
  confirmed: {
    label: "Confirmed",
    pillBg: "bg-rose-50 border-rose-100",
    pillText: "text-[#E5675D]",
    borderColor: "border-l-[#FF7C71]",
    iconBg: "bg-[#FFF8F7]",
    iconText: "text-[#E5675D]",
  },
  assigned: {
    label: "Assigned",
    pillBg: "bg-blue-50 border-blue-100",
    pillText: "text-blue-700",
    borderColor: "border-l-blue-400",
    iconBg: "bg-blue-50",
    iconText: "text-blue-700",
  },
  on_the_way: {
    label: "On the way",
    pillBg: "bg-purple-50 border-purple-100",
    pillText: "text-purple-700",
    borderColor: "border-l-purple-400",
    iconBg: "bg-purple-50",
    iconText: "text-purple-700",
  },
  pending: {
    label: "Pending",
    pillBg: "bg-amber-50 border-amber-100",
    pillText: "text-amber-700",
    borderColor: "border-l-amber-400",
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
  },
  completed: {
    label: "Completed",
    pillBg: "bg-emerald-50 border-emerald-100",
    pillText: "text-emerald-700",
    borderColor: "border-l-emerald-400",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    pillBg: "bg-red-50 border-red-100",
    pillText: "text-red-500",
    borderColor: "border-l-red-300",
    iconBg: "bg-red-50",
    iconText: "text-red-500",
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
      if (selectedBooking?.id === id) setSelectedBooking({ ...selectedBooking, status: "cancelled" });
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to cancel booking.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this booking?")) return;
    try {
      await deleteBooking(id).unwrap();
      toast.success("Booking deleted successfully.");
      if (selectedBooking?.id === id) setSelectedBooking(null);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete booking.");
    }
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
      { label: "Total Bookings", value: bookings.length.toString(), sub: "All time records", icon: Briefcase, color: "text-blue-500 bg-blue-50/50" },
      { label: "Upcoming", value: pending.toString(), sub: "In progress", icon: Clock, color: "text-amber-500 bg-amber-50/50" },
      { label: "Completed", value: completed.toString(), sub: "Finished services", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50/50" },
      { label: "Cancelled", value: cancelled.toString(), sub: "Declined requests", icon: ShieldAlert, color: "text-rose-500 bg-rose-50/50" },
    ];
  };

  // If still checking authentication, show a premium layout loader
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F7]/20 flex flex-col justify-center items-center py-16">
        <div className="w-10 h-10 border-4 border-[#FF7C71] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Initializing bookings page...</p>
      </div>
    );
  }

  // 1. GUEST STATE (UNAUTHENTICATED)
  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#FFF8F7]/50 via-white to-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center">
        {/* Soft premium background glows */}
        <div className="absolute top-[10%] left-[-10%] w-[300px] h-[300px] bg-[#FF7C71]/4 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-cyan-500/3 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-2xl w-full text-center relative z-10">
          {/* Lock Icon */}
          <div className="inline-flex p-4 bg-[#FFF8F7] text-[#FF7C71] rounded-3xl border border-rose-100/50 shadow-sm mb-6 animate-bounce">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Manage Your Schedules
          </h1>
          <p className="mt-3 text-base text-slate-500 max-w-md mx-auto leading-relaxed">
            Please log in to your account to view booking summaries, active schedules, and track your verified home care experts.
          </p>

          {/* Cards showcasing benefits */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center mb-3">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Real-time Tracking</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal">Track your service provider as they arrive.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Secure Payments</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal">Release funds only when you are satisfied.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm col-span-2 sm:col-span-1">
              <div className="w-8 h-8 bg-rose-50 text-[#FF7C71] rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Premium Perks</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal">Access exclusive promo codes and rewards.</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF7C71] hover:bg-[#E5675D] text-white font-extrabold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer">
                <LogIn className="w-4 h-4" />
                Sign In Now
              </button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-extrabold py-3 px-8 rounded-xl transition-all active:scale-95 cursor-pointer">
                <UserPlus className="w-4 h-4" />
                Create Free Account
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // 2. AUTHENTICATED STATE
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FFF8F7]/30 via-white to-white px-4 py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial depth glow */}
      <div className="absolute top-[5%] left-[-10%] w-[350px] h-[350px] bg-[#FF7C71]/3 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[450px] h-[450px] bg-cyan-500/2 blur-[150px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-4xl relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF8F7] text-[#FF7C71] rounded-2xl border border-rose-100/50 shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
              <p className="text-xs text-slate-400 mt-0.5">View your schedule times, order status, and booking history</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {getStats().map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group hover:-translate-y-0.5"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </span>
                  <div className={`p-1.5 rounded-lg ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon size={14} />
                  </div>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  {stat.value}
                </h2>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-premium mb-6 space-y-4">
          {/* Search bar */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 focus-within:border-[#FF7C71]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF7C71]/5 transition-all">
            <Search className="h-4.5 w-4.5 shrink-0 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bookings by service name or provider..."
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
            />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-650 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === f.value
                    ? "bg-[#FF7C71] text-white shadow-sm shadow-[#FF7C71]/20"
                    : "bg-[#FFF8F7] text-[#E5675D] hover:bg-[#FFEBE9]/50 border border-rose-100/30"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {isBookingsLoading ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-100">
              <div className="w-8 h-8 border-2 border-[#FF7C71] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading your bookings...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-100">
              <span className="text-4xl block mb-3 select-none">📋</span>
              <h3 className="text-base font-bold text-slate-800">No Bookings Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {search ? "No matching records found. Try adjusting your search query." : "You don't have any bookings in this category yet."}
              </p>
              {!search && (
                <Link href="/services" className="inline-block mt-4">
                  <button className="bg-[#FF7C71] hover:bg-[#E5675D] text-white text-xs font-bold py-2 px-5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm">
                    Book a Service
                  </button>
                </Link>
              )}
            </div>
          ) : (
            filtered.map((booking: any) => {
              const cfg = STATUS_CONFIG[booking.status as BookingStatus] || STATUS_CONFIG['pending'];
              const serviceName = booking.nestedService?.name || booking.pkg?.name || "Premium Home Service";
              const dateStr = booking.date 
                ? new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
                : "Scheduled Date N/A";
              
              return (
                <div
                  key={booking.id}
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border-l-4 bg-white p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-slate-100 ${cfg.borderColor}`}
                >
                  {/* Left Column: Icon and Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${cfg.iconBg} ${cfg.iconText} border border-slate-100/50 shadow-inner`}>
                      {booking.nestedService ? <Briefcase size={20} /> : <PkgIcon size={20} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-extrabold text-slate-800 truncate leading-snug">
                        {serviceName}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-400">
                        <span className="flex items-center gap-1.5 shrink-0"><Calendar size={13} className="text-slate-400" /> {dateStr}</span>
                        <span className="flex items-center gap-1.5 shrink-0"><User size={13} className="text-slate-400" /> {booking.vendor?.name || "Expert assignment pending"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Status pill and details CTA */}
                  <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-3 pt-3 md:pt-0 border-t border-slate-50 md:border-0">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider border ${cfg.pillBg} ${cfg.pillText} select-none`}>
                      {cfg.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-xl border border-slate-200 hover:border-[#FF7C71] hover:text-[#FF7C71] bg-slate-50 hover:bg-[#FFF8F7]/30 px-4 py-2 text-xs font-bold text-slate-650 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleDelete(booking.id)}
                        disabled={isDeleting}
                        className="p-2 rounded-xl border border-rose-200 hover:border-rose-500 hover:text-white hover:bg-rose-500 text-rose-500 bg-rose-50 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                        title="Delete Booking"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-extrabold text-slate-800">
                Booking Information
              </h2>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 leading-snug">
                    {selectedBooking.nestedService?.name || selectedBooking.pkg?.name || "Premium Home Service"}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                    Booking ID: <span className="font-mono text-slate-700">#{selectedBooking.id}</span>
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider border shrink-0 ${STATUS_CONFIG[selectedBooking.status as BookingStatus]?.pillBg} ${STATUS_CONFIG[selectedBooking.status as BookingStatus]?.pillText}`}>
                  {STATUS_CONFIG[selectedBooking.status as BookingStatus]?.label || selectedBooking.status}
                </span>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Calendar size={12} className="text-slate-400" /> Date
                  </p>
                  <p className="text-xs font-extrabold text-slate-700">
                    {selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User size={12} className="text-slate-400" /> Vendor/Partner
                  </p>
                  <p className="text-xs font-extrabold text-slate-700 truncate">
                    {selectedBooking.vendor?.name || "Pending Assignment"}
                  </p>
                </div>
              </div>

              {/* Location and Notes */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin size={12} className="text-slate-400" /> Delivery Address
                  </p>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed">{selectedBooking.location || "No address provided"}</p>
                </div>

                {selectedBooking.notes && (
                  <div className="pt-3 border-t border-slate-200/60">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Customer Notes</p>
                    <p className="text-xs font-semibold text-slate-650 italic bg-white p-2.5 rounded-xl border border-slate-100">
                      "{selectedBooking.notes}"
                    </p>
                  </div>
                )}

                {selectedBooking.employee && (
                  <div className="pt-3 border-t border-slate-200/60">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Assigned Expert Professional</p>
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
                    className="w-full bg-amber-50 hover:bg-amber-100 text-amber-600 font-extrabold py-3 rounded-2xl text-xs transition-colors cursor-pointer border border-amber-150/40 disabled:opacity-50"
                  >
                    {isUpdating ? "Processing..." : "Cancel Booking Request"}
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(selectedBooking.id)}
                  disabled={isDeleting}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold py-3 rounded-2xl text-xs transition-colors cursor-pointer border border-rose-150/40 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deleting..." : "Delete Booking"}
                </button>

                <p className="text-center text-[10px] text-slate-400 mt-1 font-medium">
                  Note: Booking cancellations or deletions are permanent and cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}