"use client";

import React from "react";
import { X } from "lucide-react";
import { Withdraw } from "@/redux/features/shared/withdrawApi";

interface WithdrawDetailModalProps {
  selectedItem: Withdraw | null;
  setSelectedItem: (val: Withdraw | null) => void;
  isUpdating: boolean;
  handleUpdateStatus: (id: number | string, status: "approved" | "rejected" | "pending", admin_note?: string) => void;
  handleDelete: (item: Withdraw) => void;
}

export default function WithdrawDetailModal({
  selectedItem,
  setSelectedItem,
  isUpdating,
  handleUpdateStatus,
  handleDelete,
}: WithdrawDetailModalProps) {
  if (!selectedItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 font-display">Withdraw Details</h2>
          <button
            onClick={() => setSelectedItem(null)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Request ID", value: `#${selectedItem.id}` },
            { label: "Booking ID", value: selectedItem.booking?.id ? `#${selectedItem.booking.id}` : "—" },
            { label: "Vendor", value: selectedItem.vendor?.name || "—" },
            { label: "Email", value: selectedItem.vendor?.email || "—" },
            { label: "Amount", value: `৳${(selectedItem.amount || 0).toLocaleString()}` },
            { label: "Status", value: selectedItem.status },
            { label: "Admin Note", value: selectedItem.admin_note },
            {
              label: "Requested At",
              value: selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : "—",
            },
          ]
            .filter((item) => item.value !== undefined && item.value !== null)
            .map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">{label}</span>
                <span className="text-sm font-bold text-slate-900">{value}</span>
              </div>
            ))}
          <div className="pt-2">
            {selectedItem.getway ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Requested Payment Method</p>
                <p className="font-bold text-slate-800 uppercase text-sm">{selectedItem.getway.getway_type}</p>
                <p className="text-sm font-mono text-slate-600 truncate mt-0.5">
                  {selectedItem.getway.info?.details || JSON.stringify(selectedItem.getway.info)}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic mb-2">No gateway selected.</p>
            )}
            {selectedItem.status === "pending" && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Admin Note / Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  id="adminNoteInput"
                  placeholder="e.g., TrxID 123456"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-[#4F46E5] focus:border-[#4F46E5] block p-2.5 outline-none"
                />
              </div>
            )}
          </div>
          <div className="pt-2 flex gap-3 justify-end">
            {selectedItem.status === "pending" && (
              <>
                <button
                  disabled={isUpdating}
                  onClick={() => {
                    const note = (document.getElementById("adminNoteInput") as HTMLInputElement)?.value;
                    handleUpdateStatus(selectedItem.id, "approved", note);
                    setSelectedItem(null);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
                >
                  Approve
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => {
                    const note = (document.getElementById("adminNoteInput") as HTMLInputElement)?.value;
                    handleUpdateStatus(selectedItem.id, "rejected", note);
                    setSelectedItem(null);
                  }}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
                >
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => handleDelete(selectedItem)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
