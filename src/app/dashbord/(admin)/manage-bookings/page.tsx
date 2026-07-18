"use client";

import { Calendar, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import DeleteBookingModal from "./components/DeleteBookingModal";
import BookingTable from "./components/BookingTable";
import { useBookingState } from "./hooks/useBookingState";

const translations = {
  bn: {
    title: "বুকিং ম্যানেজমেন্ট",
    subtitle: "প্ল্যাটফর্মের সব বুকিং ট্র্যাক এবং ম্যানেজ করুন।",
    createBooking: "বুকিং তৈরি করুন",
    searchPlaceholder: "ক্লায়েন্ট বা লোকেশন দিয়ে খুঁজুন...",
    loading: "বুকিং লোড হচ্ছে...",
    noBookings: "কোনো বুকিং পাওয়া যায়নি",
    noBookingsFilter: "আপনার বর্তমান ফিল্টারের সাথে মিলে এমন কোনো বুকিং পাওয়া যায়নি।",
    noBookingsSys: "সিস্টেমে বর্তমানে কোনো বুকিং নেই।",
    filters: {
      all: "সব",
      pending: "পেন্ডিং",
      assigned: "অ্যাসাইনড",
      completed: "কমপ্লিটেড",
      cancelled: "ক্যান্সেলড"
    }
  },
  en: {
    title: "Manage Bookings",
    subtitle: "Track and manage all service bookings across the platform.",
    createBooking: "Create Booking",
    searchPlaceholder: "Search by client or location...",
    loading: "Loading bookings...",
    noBookings: "No Bookings Found",
    noBookingsFilter: "We couldn't find any bookings matching your current filters.",
    noBookingsSys: "There are currently no bookings in the system.",
    filters: {
      all: "All",
      pending: "Pending",
      assigned: "Assigned",
      completed: "Completed",
      cancelled: "Cancelled"
    }
  }
};

export default function BookingsManagementPage() {
  const {
    isLoading,
    roleName,
    currentUser,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    isAddModalOpen,
    setIsAddModalOpen,
    deleteModalBookingId,
    setDeleteModalBookingId,
    newBooking,
    setNewBooking,
    clients,
    vendors,
    selectedVendorServices,
    selectedService,
    selectedNestedService,
    estimatedTotalPrice,
    filteredBookings,
    handleDeleteConfirm,
    handleCreateSubmit,
    handleStatusChange,
    isDeleting,
    isCreating,
  } = useBookingState();
  const lang = useAppSelector((state) => state.lang.value);
  const t = translations[lang as keyof typeof translations];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EEF2FF] text-[#1E4E8C] rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{t.title}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashbord/quick-booking"
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
          >
            <Calendar size={18} />
            {t.createBooking}
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {["all", "pending", "assigned", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${
                filterStatus === status ? "bg-brand-primary text-white shadow-md" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t.filters[status as keyof typeof t.filters]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">{t.loading}</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <Calendar size={48} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">{t.noBookings}</h3>
            <p className="text-slate-500 text-sm max-w-sm">
              {searchTerm || filterStatus !== "all"
                ? t.noBookingsFilter
                : t.noBookingsSys}
            </p>
          </div>
        ) : (
          <BookingTable 
            filteredBookings={filteredBookings} 
            setDeleteModalBookingId={setDeleteModalBookingId} 
            lang={lang} 
            handleStatusChange={handleStatusChange}
            roleName={roleName}
          />
        )}
      </div>

      <DeleteBookingModal
        deleteModalBookingId={deleteModalBookingId}
        setDeleteModalBookingId={setDeleteModalBookingId}
        handleDeleteConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
