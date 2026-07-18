"use client";

import React from "react";
import { X } from "lucide-react";
import { Withdraw } from "@/redux/features/shared/withdrawApi";

interface WithdrawActionModalProps {
  actionModal: { type: "approved" | "rejected"; item: Withdraw } | null;
  setActionModal: (val: { type: "approved" | "rejected"; item: Withdraw } | null) => void;
  isUpdating: boolean;
  handleUpdateStatus: (id: number | string, status: "approved" | "rejected" | "pending", admin_note?: string) => void;
}

export default function WithdrawActionModal({
  actionModal,
  setActionModal,
  isUpdating,
  handleUpdateStatus,
}: WithdrawActionModalProps) {
  if (!actionModal) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 capitalize font-display">{actionModal.type} Request</h2>
          <button
            onClick={() => setActionModal(null)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {actionModal.item.getway ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Requested Payment Method</p>
              <p className="font-bold text-slate-800 uppercase text-sm">{actionModal.item.getway.getway_type}</p>
              <p className="text-sm font-mono text-slate-600 truncate mt-0.5">
                {actionModal.item.getway.info?.details || JSON.stringify(actionModal.item.getway.info)}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic mb-2">No gateway selected.</p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-700 mb-2">Admin Note / Transaction ID (Optional)</label>
            <input
              type="text"
              id="actionModalNoteInput"
              placeholder={actionModal.type === "approved" ? "e.g., TrxID 123456" : "e.g., Invalid gateway"}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-[#1E4E8C] focus:border-[#1E4E8C] block p-3 outline-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setActionModal(null)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-all flex-1"
            >
              Cancel
            </button>
            <button
              disabled={isUpdating}
              onClick={() => {
                const note = (document.getElementById("actionModalNoteInput") as HTMLInputElement)?.value;
                handleUpdateStatus(actionModal.item.id, actionModal.type, note);
                setActionModal(null);
              }}
              className={`${
                actionModal.type === "approved" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-[#1E4E8C] hover:bg-[#123C73]"
              } disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all flex-1 capitalize`}
            >
              Confirm {actionModal.type}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
