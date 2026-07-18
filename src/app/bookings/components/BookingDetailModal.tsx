"use client";

import React from "react";
import { X, MapPin, Calendar, User, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { STATUS_CONFIG } from "@/app/bookings/hooks/useBookingsState";

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled" | "assigned" | "on_the_way";

interface BookingDetailModalProps {
  selectedBooking: any;
  onClose: () => void;
  onCancel: (id: number) => void;
  onDelete: (id: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export default function BookingDetailModal({ selectedBooking, onClose, onCancel, onDelete, isUpdating, isDeleting }: BookingDetailModalProps) {
  return (
    <AnimatePresence>
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 relative z-10"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1E4E8C] animate-pulse" />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Booking Information</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Calendar size={12} className="text-slate-400" /> Date</p>
                  <p className="text-xs font-extrabold text-slate-750">
                    {selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><User size={12} className="text-slate-400" /> Vendor/Partner</p>
                  <p className="text-xs font-extrabold text-slate-750 truncate">{selectedBooking.vendor?.name || "Pending Assignment"}</p>
                </div>
              </div>

              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                <div>
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><MapPin size={12} className="text-slate-400" /> Delivery Address</p>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed">{selectedBooking.location || "No address provided"}</p>
                </div>
                {selectedBooking.notes && (
                  <div className="pt-3 border-t border-slate-200/60">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Customer Notes</p>
                    <p className="text-xs font-medium text-slate-650 italic bg-white p-3 rounded-xl border border-slate-100">"{selectedBooking.notes}"</p>
                  </div>
                )}
                {selectedBooking.employee && (
                  <div className="pt-3 border-t border-slate-200/60">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Assigned Service Professional</p>
                    <p className="text-xs font-extrabold text-slate-700">{selectedBooking.employee.name}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                {(selectedBooking.status === "pending" || selectedBooking.status === "assigned") && (
                  <button onClick={() => onCancel(selectedBooking.id)} disabled={isUpdating} className="w-full bg-amber-50 hover:bg-amber-100 text-amber-600 font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer border border-amber-150/40 disabled:opacity-50">
                    {isUpdating ? "Processing..." : "Cancel Booking Request"}
                  </button>
                )}
                <button onClick={() => onDelete(selectedBooking.id)} disabled={isDeleting} className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer border border-rose-150/40 flex items-center justify-center gap-2 disabled:opacity-50">
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
  );
}
