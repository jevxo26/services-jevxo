"use client";

import { useState } from "react";
import { useGetAllBookingsQuery, useUpdateBookingStatusMutation } from "@/redux/features/admin/booking";
import { toast } from "sonner";
import { MapPin, Calendar, Clock, Briefcase, Package as PkgIcon, User, XCircle, Search } from "lucide-react";

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
    pillBg: "bg-[#FFF8F7]",
    pillText: "text-[#E5675D]",
    borderColor: "border-l-[#FF7C71]",
    iconBg: "bg-[#FFF8F7]",
    iconText: "text-[#E5675D]",
  },
  assigned: {
    label: "Assigned",
    pillBg: "bg-blue-50",
    pillText: "text-blue-700",
    borderColor: "border-l-blue-400",
    iconBg: "bg-blue-50",
    iconText: "text-blue-700",
  },
  on_the_way: {
    label: "On the way",
    pillBg: "bg-purple-50",
    pillText: "text-purple-700",
    borderColor: "border-l-purple-400",
    iconBg: "bg-purple-50",
    iconText: "text-purple-700",
  },
  pending: {
    label: "Pending",
    pillBg: "bg-amber-50",
    pillText: "text-amber-700",
    borderColor: "border-l-amber-400",
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
  },
  completed: {
    label: "Completed",
    pillBg: "bg-emerald-50",
    pillText: "text-emerald-700",
    borderColor: "border-l-emerald-400",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    pillBg: "bg-red-50",
    pillText: "text-red-400",
    borderColor: "border-l-red-300",
    iconBg: "bg-red-50",
    iconText: "text-red-400",
  },
};

const FILTERS: { label: string; value: "all" | BookingStatus }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Assigned", value: "assigned" },
  { label: "On the way", value: "on_the_way" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function BookingsPage() {
  const { data: bookingsRes, isLoading } = useGetAllBookingsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const [activeFilter, setActiveFilter] = useState<"all" | BookingStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const bookings = bookingsRes?.data || [];

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await updateStatus({ id, status: "cancelled" }).unwrap();
      toast.success("Booking cancelled successfully.");
      setSelectedBooking(null);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to cancel booking.");
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
      { label: "Total Bookings", value: bookings.length.toString(), sub: "All time" },
      { label: "Upcoming", value: pending.toString(), sub: "Pending/Assigned" },
      { label: "Completed", value: completed.toString(), sub: "Finished" },
      { label: "Cancelled", value: cancelled.toString(), sub: "Stopped" },
    ];
  };

  return (
    <section className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
              My Bookings
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              View your booking history and active requests
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {getStats().map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-[#FFF8F7] px-4 py-3"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-[#E5675D] opacity-70">
                {stat.label}
              </p>
              <p className="mt-1 text-xl font-semibold text-[#E5675D]">
                {stat.value}
              </p>
              <p className="text-xs text-[#FF7C71] opacity-60">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeFilter === f.value
                  ? "bg-[#FF7C71] text-white shadow-sm"
                  : "bg-[#FFF8F7] text-[#E5675D] hover:bg-[#FFEBE9]"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-[var(--border-light)] bg-white px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by service or vendor..."
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
          />
        </div>

        {/* Booking Cards */}
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="py-16 text-center text-[var(--text-secondary)]">
              <div className="w-8 h-8 border-2 border-[#FF7C71] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading bookings...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl">📋</p>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                No bookings found.
              </p>
            </div>
          ) : (
            filtered.map((booking: any) => {
              const cfg = STATUS_CONFIG[booking.status as BookingStatus] || STATUS_CONFIG['pending'];
              const serviceName = booking.nestedService?.name || booking.pkg?.name || "Unknown Service";
              const dateStr = booking.date ? new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A";
              
              return (
                <div
                  key={booking.id}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-r-xl border border-l-4 bg-white px-4 py-4 transition-shadow hover:shadow-md ${cfg.borderColor}`}
                  style={{ borderTopColor: "#e5e7eb", borderRightColor: "#e5e7eb", borderBottomColor: "#e5e7eb" }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.iconBg} ${cfg.iconText}`}>
                      {booking.nestedService ? <Briefcase size={20} /> : <PkgIcon size={20} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                        {serviceName}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {dateStr}</span>
                        <span className="flex items-center gap-1"><User size={12} /> {booking.vendor?.name || "Unassigned"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center sm:flex-col sm:items-end justify-between gap-2 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${cfg.pillBg} ${cfg.pillText}`}>
                      {cfg.label}
                    </span>
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="rounded-lg border border-[var(--border-light)] px-4 py-1.5 text-xs font-bold text-[var(--text-secondary)] transition-colors hover:border-[#FF7C71] hover:text-[#FF7C71] bg-slate-50 hover:bg-white"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Booking Details
              </h2>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {selectedBooking.nestedService?.name || selectedBooking.pkg?.name || "Unknown Service"}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                    Booking ID: <span className="font-mono font-medium text-slate-700">#{selectedBooking.id}</span>
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_CONFIG[selectedBooking.status as BookingStatus]?.pillBg} ${STATUS_CONFIG[selectedBooking.status as BookingStatus]?.pillText}`}>
                  {selectedBooking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar size={12}/> Date</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><User size={12}/> Vendor</p>
                  <p className="text-sm font-semibold text-slate-700">{selectedBooking.vendor?.name || "Pending Assignment"}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin size={12}/> Location</p>
                  <p className="text-sm font-medium text-slate-700">{selectedBooking.location}</p>
                </div>
                {selectedBooking.notes && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-sm font-medium text-slate-600 italic">"{selectedBooking.notes}"</p>
                  </div>
                )}
                {selectedBooking.employee && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Professional</p>
                    <p className="text-sm font-medium text-slate-700">{selectedBooking.employee.name}</p>
                  </div>
                )}
              </div>
              
              {(selectedBooking.status === "pending" || selectedBooking.status === "assigned") && (
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleCancel(selectedBooking.id)}
                    disabled={isUpdating}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    {isUpdating ? "Processing..." : "Cancel Booking"}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-2">
                    Cancelling a booking cannot be undone.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}