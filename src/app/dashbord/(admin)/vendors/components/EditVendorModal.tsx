"use client";

import React from "react";
import { XCircle } from "lucide-react";

interface VendorItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  categoryName?: string;
  profile?: any;
  commission_percentage: number;
  wallet_balance: number;
}

interface EditVendorModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (val: boolean) => void;
  editingVendor: VendorItem | null;
  handleEditVendor: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function EditVendorModal({
  isEditModalOpen,
  setIsEditModalOpen,
  editingVendor,
  handleEditVendor,
}: EditVendorModalProps) {
  if (!isEditModalOpen || !editingVendor) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-extrabold text-slate-800">Edit Vendor</h2>
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-all"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleEditVendor} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
              <input
                name="name"
                type="text"
                defaultValue={editingVendor.name}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
              <input
                name="email"
                type="email"
                defaultValue={editingVendor.email}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
              <input
                name="phone"
                type="tel"
                defaultValue={editingVendor.phone || ""}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                Commission Percentage (%)
              </label>
              <input
                name="commission_percentage"
                type="number"
                min="0"
                max="100"
                defaultValue={editingVendor.commission_percentage || 0}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
