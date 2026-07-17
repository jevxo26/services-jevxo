"use client";

import React from "react";
import { User as UserIcon, Save } from "lucide-react";
import { LocationCascader } from "@/components/ui/LocationCascader";
import { CustomSelect } from "@/components/ui/select";
import { useProfileState } from "./hooks/useProfileState";
import ProfileCard from "./components/ProfileCard";
import { useAppSelector } from "@/redux/hooks";

export default function ProfilePage() {
  const state = useProfileState();
  const lang = useAppSelector((state) => state.lang.value);

  if (state.isUserLoading && !state.user) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse font-semibold">
        {lang === "bn" ? "প্রোফাইল লোড হচ্ছে..." : "Loading profile..."}
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-12 sm:pb-16 animate-in fade-in duration-200 relative">
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: "auto" }}
      />
      {/* Premium Profile Page Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8 text-white shadow-xl shadow-slate-950/15">
        {/* Decorative Glow Circles */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#4F46E5]/25 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-md text-[#4F46E5] rounded-2xl border border-white/10">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#4F46E5] tracking-widest uppercase bg-[#4F46E5]/10 px-2.5 py-1 rounded-md border border-[#4F46E5]/20">
                {lang === "bn" ? "ইউজার প্রোফাইল" : "User Profile"}
              </span>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white mt-2">
                {lang === "bn" ? "আমার প্রোফাইল" : "My Profile"}
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                {lang === "bn"
                  ? "ব্যক্তিগত কন্টাক্ট কার্ড, ঠিকানা এবং অ্যাকাউন্টের বিবরণ পরিচালনা করুন।"
                  : "Manage personal contact card, address, and account details."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Premium ID Card */}
        <ProfileCard
          name={state.name}
          role={state.role}
          email={state.email}
          phone={state.phone}
          address={state.address}
          avatarUrl={state.avatarUrl}
          isUploadingAvatar={state.isUploadingAvatar}
          handleAvatarUpload={state.handleAvatarUpload}
          lang={lang}
        />

        {/* Right Column: Update Forms */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <form onSubmit={state.handleSave} className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">
              {lang === "bn" ? "বিবরণ এডিট করুন" : "Edit Details"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                  {lang === "bn" ? "পুরো নাম" : "Full Name"}
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={state.name !== "Unknown User" ? state.name : ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#4F46E5]/40 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                  {lang === "bn" ? "কন্টাক্ট নম্বর" : "Contact Number"}
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={state.phone !== "No Phone" ? state.phone : ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#4F46E5]/40 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                  {lang === "bn" ? "প্রাথমিক ডেলিভারি ঠিকানা" : "Primary Delivery Address"}
                </label>
                <input
                  name="address"
                  type="text"
                  defaultValue={state.address !== "No Address Provided" ? state.address : ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#4F46E5]/40 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                  required
                />
              </div>

              <div className="sm:col-span-2 pt-6 pb-2">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  {lang === "bn" ? "পেশাগত ও পাবলিক বিবরণ" : "Professional & Public Details"}
                </h4>
                <div className="flex flex-wrap gap-1 mt-4">
                  {state.profile?.categories?.length > 0 ? (
                    state.profile.categories.map((cat: any) => (
                      <span
                        key={cat.id}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm"
                      >
                        {cat.name}
                      </span>
                    ))
                  ) : (
                    <span className="font-semibold text-slate-900">—</span>
                  )}
                </div>
              </div>

              <div>
                <CustomSelect
                  label={lang === "bn" ? "প্রোফাইলের ধরন" : "Profile Type"}
                  options={[
                    {
                      value: "personal",
                      label: lang === "bn" ? "ব্যক্তিগত / ফ্রিল্যান্সার" : "Personal / Freelancer",
                    },
                    {
                      value: "company",
                      label: lang === "bn" ? "কোম্পানি / এজেন্সি" : "Company / Agency",
                    },
                  ]}
                  value={state.selectedType}
                  onChange={state.setSelectedType}
                  placeholder={lang === "bn" ? "ধরন নির্বাচন করুন" : "Select Type"}
                />
              </div>

              <div>
                <CustomSelect
                  label={lang === "bn" ? "ক্যাটাগরি (একাধিক)" : "Categories (Multiple)"}
                  options={state.allCategories.map((c: any) => ({ value: c.id.toString(), label: c.name }))}
                  value={state.selectedCategories}
                  onChange={state.setSelectedCategories}
                  placeholder={
                    state.isCategoriesLoading
                      ? lang === "bn"
                        ? "লোড হচ্ছে..."
                        : "Loading..."
                      : lang === "bn"
                      ? "ক্যাটাগরি নির্বাচন করুন"
                      : "Select Categories"
                  }
                  isMulti={true}
                  disabled={state.isCategoriesLoading}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                  {lang === "bn" ? "কোম্পানি / ব্যবসার নাম (ঐচ্ছিক)" : "Company / Business Name (Optional)"}
                </label>
                <input
                  name="company_name"
                  type="text"
                  defaultValue={state.profile?.company_name || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#4F46E5]/40 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                  placeholder={lang === "bn" ? "ব্যক্তিগত হলে খালি রাখুন" : "Leave blank if personal"}
                />
              </div>

              <div className="sm:col-span-2">
                <LocationCascader
                  selectedDevisionId={state.selectedDevision}
                  selectedDistrictId={state.selectedDistrict}
                  selectedAreaId={state.selectedArea}
                  onDevisionChange={state.setSelectedDevision}
                  onDistrictChange={state.setSelectedDistrict}
                  onAreaChange={state.setSelectedArea}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                  {lang === "bn" ? "নির্দিষ্ট ঠিকানা / বিল্ডিং (ঐচ্ছিক)" : "Specific Address / Building (Optional)"}
                </label>
                <input
                  name="location"
                  type="text"
                  defaultValue={state.profile?.location || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#4F46E5]/40 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                  placeholder={lang === "bn" ? "যেমন: ব্লক সি, বাড়ি ১২" : "e.g. Block C, House 12"}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                  {lang === "bn" ? "পেশাগত বিবরণ" : "Professional Description"}
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={state.profile?.description || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#4F46E5]/40 focus:ring-2 focus:ring-rose-100 transition-all resize-none font-medium"
                  placeholder={
                    lang === "bn"
                      ? "সার্ভিস এবং দক্ষতা সম্পর্কে লিখুন..."
                      : "Write about services and skills..."
                  }
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                  {lang === "bn" ? "শুরুর সর্বনিম্ন মূল্য" : "Min Starting Price"}
                </label>
                <input
                  name="min_starting_price"
                  type="number"
                  step="0.01"
                  defaultValue={state.profile?.min_starting_price || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#4F46E5]/40 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                  {lang === "bn" ? "গুগল ম্যাপ লিংক" : "Google Map Link"}
                </label>
                <input
                  name="google_map_link"
                  type="url"
                  defaultValue={state.profile?.google_map_link || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#4F46E5]/40 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                  placeholder="https://maps.app.goo.gl/..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-50">
              <button
                type="submit"
                disabled={state.isSaving}
                className="w-full sm:w-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold px-6 py-3 sm:py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />{" "}
                {state.isSaving
                  ? lang === "bn"
                    ? "সেভ হচ্ছে..."
                    : "Saving..."
                  : lang === "bn"
                  ? "পরিবর্তনগুলো সেভ করুন"
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
