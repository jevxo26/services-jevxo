"use client";

import React from "react";
import { XCircle } from "lucide-react";
import { CustomSelect } from "@/components/ui/select";
import { LocationCascader } from "@/components/ui/LocationCascader";

interface AddVendorModalProps {
  isAddModalOpen: boolean;
  closeModal: () => void;
  step: 1 | 2;
  handleCreateUser: (e: React.FormEvent<HTMLFormElement>) => void;
  isCreatingUser: boolean;
  handleCreateProfile: (e: React.FormEvent<HTMLFormElement>) => void;
  isCreatingProfile: boolean;
  profileType: string;
  setProfileType: (val: string) => void;
  allCategories: any[];
  isCategoriesLoading: boolean;
  selectedCategoryIds: number[];
  setSelectedCategoryIds: (val: number[]) => void;
  selectedDevision: string;
  setSelectedDevision: (val: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (val: string) => void;
  selectedArea: string;
  setSelectedArea: (val: string) => void;
}

export default function AddVendorModal({
  isAddModalOpen,
  closeModal,
  step,
  handleCreateUser,
  isCreatingUser,
  handleCreateProfile,
  isCreatingProfile,
  profileType,
  setProfileType,
  allCategories,
  isCategoriesLoading,
  selectedCategoryIds,
  setSelectedCategoryIds,
  selectedDevision,
  setSelectedDevision,
  selectedDistrict,
  setSelectedDistrict,
  selectedArea,
  setSelectedArea,
}: AddVendorModalProps) {
  if (!isAddModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {step === 1 ? "Step 1: Vendor Account" : "Step 2: Vendor Profile"}
          </h2>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-all"
          >
            <XCircle size={24} />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="john@vendor.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
              <input
                name="phone"
                type="tel"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="01XXXXXXXXX"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="e.g. 80"
              />
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingUser}
                className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-all disabled:opacity-50"
              >
                {isCreatingUser ? "Saving..." : "Next Step"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Profile Type</label>
              <CustomSelect
                options={[
                  { value: "personal", label: "Personal / Freelancer" },
                  { value: "company", label: "Company / Agency" },
                ]}
                value={profileType}
                onChange={setProfileType}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Categories</label>
              <CustomSelect
                isMulti
                options={allCategories.map((c: any) => ({ value: String(c.id), label: c.name }))}
                value={selectedCategoryIds.map(String)}
                onChange={(val) => setSelectedCategoryIds(Array.isArray(val) ? val.map(Number) : [])}
                placeholder={isCategoriesLoading ? "Loading categories..." : "Select Categories..."}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                Company / Business Name (Optional)
              </label>
              <input
                name="company_name"
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="Acme Services Ltd."
              />
            </div>
            <div>
              <LocationCascader
                selectedDevisionId={selectedDevision}
                selectedDistrictId={selectedDistrict}
                selectedAreaId={selectedArea}
                onDevisionChange={setSelectedDevision}
                onDistrictChange={setSelectedDistrict}
                onAreaChange={setSelectedArea}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                Specific Location (Optional)
              </label>
              <input
                name="location"
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="City, Region"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Description</label>
              <textarea
                name="description"
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                placeholder="Briefly describe the vendor's services..."
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Min Starting Price</label>
                <input
                  name="min_starting_price"
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Google Map Link</label>
                <input
                  name="google_map_link"
                  type="url"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={isCreatingProfile}
                className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-all disabled:opacity-50"
              >
                {isCreatingProfile ? "Saving..." : "Complete Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
