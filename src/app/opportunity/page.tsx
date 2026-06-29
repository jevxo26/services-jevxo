"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  UserCheck,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Building,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  User,
  Image as ImageIcon,
  DollarSign,
  Globe,
  Award,
  Users,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { LocationCascader } from "@/components/ui/LocationCascader";
import Select from "react-select";
import { uploadImage } from "@/lib/upload";
import { useCreateProfileMutation } from "@/redux/features/admin/profile";
import { useGetPublicRolesQuery, useGetPublicCategoriesQuery } from "@/redux/features/landing/landingApi";

function OpportunityPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  // selectedRole state dynamically derived from URL query param
  const selectedRole = (roleParam === "Vendor" || roleParam === "Agent") ? roleParam : null;

  const [step, setStep] = useState<1 | 2>(1);
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);

  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [createProfile, { isLoading: isCreatingProfile }] = useCreateProfileMutation();
  const [isUploading, setIsUploading] = useState(false);

  const { data: rolesRes } = useGetPublicRolesQuery();
  const { data: categoriesRes } = useGetPublicCategoriesQuery();

  const roles = rolesRes?.data || (Array.isArray(rolesRes) ? rolesRes : []);
  const categories = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company_name: "",
    location: "",
    description: "",
    min_starting_price: "",
    google_map_link: "",
    devision_id: "",
    district_id: "",
    area_id: "",
  });

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [pictureFile, setPictureFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectRole = (role: "Vendor" | "Agent") => {
    router.push(`/opportunity?role=${role}`);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.push("/opportunity");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const roleObj = roles.find((r: any) => r.name === selectedRole);
    if (!roleObj) {
      toast.error("Role not found in the system. Please try again later.");
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        roleId: roleObj.id,
        status: "inactive",
      }).unwrap();

      if (response.access_token || response.token) {
        const token = response.access_token || response.token;
        localStorage.setItem("token", token);
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `token=${token}; expires=${expires}; path=/; SameSite=Lax`;
      }

      const newUserId = response.data?.id || response.id || response.user?.id;
      if (newUserId) {
        setCreatedUserId(newUserId);
        toast.success("Account created! Please complete your profile.");
        setStep(2);
      } else {
        toast.error("Failed to get user ID from response.");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdUserId) return;

    if (!formData.devision_id || !formData.district_id || !formData.area_id) {
      toast.error("Please complete the location details (Division, District, Area).");
      return;
    }

    if (selectedCategoryIds.length === 0) {
      toast.error("Please select at least one category.");
      return;
    }

    if (!pictureFile) {
      toast.error("Please upload a picture.");
      return;
    }

    try {
      setIsUploading(true);
      const pictureUrl = await uploadImage(pictureFile);
      setIsUploading(false);

      await createProfile({
        user_id: createdUserId,
        type: "business",
        company_name: formData.company_name,
        category_ids: selectedCategoryIds,
        location: formData.location,
        description: formData.description,
        picture: pictureUrl,
        min_starting_price: Number(formData.min_starting_price) || 0,
        google_map_link: formData.google_map_link,
        devision_id: Number(formData.devision_id),
        district_id: Number(formData.district_id),
        area_id: Number(formData.area_id),
      }).unwrap();

      toast.success("Application submitted successfully! Please wait for admin approval.");
      router.push("/");
    } catch (err: any) {
      setIsUploading(false);
      toast.error(err.data?.message || err.message || "Failed to save profile. Please try again.");
    }
  };

  const inputBase =
    "w-full text-xs px-4 py-3 rounded-xl border bg-[#FAFAF9] text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-355 font-semibold focus:bg-white focus:ring-2";
  const inputNormal = `${inputBase} border-[#E7E5E4] focus:border-[#FF6014] focus:ring-[#FF6014]/10`;

  if (!selectedRole) {
    return (
      <div className="min-h-[80vh] bg-transparent flex flex-col justify-center py-20 px-4 md:px-6 relative overflow-hidden font-sans">
        <div
          className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
          style={{ backgroundSize: 'auto' }}
        />

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 bg-[#FF6014]/5 blur-[120px] rounded-full" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 bg-orange-300/5 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/20">
              <Sparkles className="w-3.5 h-3.5" />
              Partnership Opportunities
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Join <span className="text-[#FF6014]">Rajseba</span> Platform
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-semibold max-w-xl mx-auto leading-relaxed">
              Partner with Bangladesh's leading home service marketplace and grow your business or operations network.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

            {/* Vendor Card */}
            <button
              onClick={() => handleSelectRole("Vendor")}
              className="bg-white border border-slate-100/90 rounded-3xl p-8 hover:border-[#FF6014]/20 hover:shadow-[0_12px_40px_rgba(255,96,20,0.06)] hover:-translate-y-1 transition-all duration-300 text-left group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6014]/[0.01] to-transparent pointer-events-none" />
              <div className="w-14 h-14 bg-[#FFF4EE] border border-[#FF6014]/15 rounded-2xl flex items-center justify-center text-[#FF6014] mb-6 group-hover:scale-110 transition-transform">
                <Briefcase size={26} />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2.5">Become a Vendor</h2>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">
                List your professional services, manage custom bookings, and reach thousands of daily active customers in Dhaka.
              </p>
              <div className="flex items-center text-[#FF6014] font-extrabold text-xs uppercase tracking-wider">
                Apply as Vendor <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Agent Card */}
            <button
              onClick={() => handleSelectRole("Agent")}
              className="bg-white border border-slate-100/90 rounded-3xl p-8 hover:border-[#FF6014]/20 hover:shadow-[0_12px_40px_rgba(255,96,20,0.06)] hover:-translate-y-1 transition-all duration-300 text-left group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6014]/[0.01] to-transparent pointer-events-none" />
              <div className="w-14 h-14 bg-[#FFF4EE] border border-[#FF6014]/15 rounded-2xl flex items-center justify-center text-[#FF6014] mb-6 group-hover:scale-110 transition-transform">
                <UserCheck size={26} />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2.5">Become an Agent</h2>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">
                Manage vendor networks, oversee service dispatch in your designated territory, and earn competitive commissions.
              </p>
              <div className="flex items-center text-[#FF6014] font-extrabold text-xs uppercase tracking-wider">
                Apply as Agent <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-[85vh] flex flex-col justify-center py-10 md:py-16 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: 'auto' }}
      />
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 relative z-10">

        {/* Dynamic Back Navigation */}
        <button
          onClick={handleBack}
          className="mb-8 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-[#FF6014] flex items-center transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} className="mr-1" /> {step === 2 ? "Back to Step 1" : "Back to Role Selection"}
        </button>

        <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-center mt-4">

          {/* ===== LEFT SPLIT PANEL ===== */}
          <div className="md:col-span-5 flex flex-col justify-between shrink-0 min-h-[420px] md:min-h-[520px] py-4">

            <div>
              <span className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
                <span className="w-7 h-7 bg-[#FF6014] rounded-lg flex items-center justify-center text-xs text-white">R</span>
                Rajseba
              </span>
              <div>
                <div className="inline-flex items-center gap-2 text-[9px] font-extrabold text-[#FF6014] uppercase tracking-wider bg-[#FF6014]/10 border border-[#FF6014]/20 px-3 py-1 rounded-full mb-4">
                  <Sparkles className="w-3 h-3" />
                  Onboarding Step {step} of 2
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-3">
                  Join as {selectedRole === "Vendor" ? "a Vendor" : "an Agent"}
                </h2>
                <p className="text-slate-500 text-sm font-semibold max-w-md leading-relaxed">
                  Complete your registration information to launch your service profile on Bangladesh's leading marketplace.
                </p>
              </div>
            </div>

            {/* Vendor/Agent Specific Details & Earnings Share (TEXT ONLY) */}
            <div className="space-y-5 my-6">
              <h4 className="text-sm font-extrabold uppercase tracking-widest text-[#FF6014] border-b border-slate-100 pb-2.5 mb-2">
                {selectedRole === "Vendor" ? "Vendor Benefits & Revenue" : "Agent Opportunities & Commissions"}
              </h4>
              {selectedRole === "Vendor" ? (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF6014]/10 border border-[#FF6014]/20 flex items-center justify-center text-[#FF6014] shrink-0 font-black text-sm">
                      90%
                    </div>
                    <div>
                      <p className="text-slate-900 text-sm md:text-base font-extrabold">Keep 90% of Your Earnings</p>
                      <p className="text-slate-500 text-xs font-semibold mt-0.5 leading-relaxed">We only charge a flat 10% platform commission on completed jobs. You keep the remaining 90% of the revenue.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF6014]/10 border border-[#FF6014]/20 flex items-center justify-center text-[#FF6014] shrink-0 font-black text-sm">
                      ৳0
                    </div>
                    <div>
                      <p className="text-slate-900 text-sm md:text-base font-extrabold">Free Setup & Zero Monthly Fees</p>
                      <p className="text-slate-500 text-xs font-semibold mt-0.5 leading-relaxed">Registration is completely free. We do not charge subscription fees for listing services or accepting leads.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF6014]/10 border border-[#FF6014]/20 flex items-center justify-center text-[#FF6014] shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="text-slate-900 text-sm md:text-base font-extrabold">Weekly Verified Payouts</p>
                      <p className="text-slate-500 text-xs font-semibold mt-0.5 leading-relaxed">Earnings are settled directly into your bank account or Mobile Wallet (bKash/Nagad) securely every week.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF6014]/10 border border-[#FF6014]/20 flex items-center justify-center text-[#FF6014] shrink-0 font-black text-sm">
                      10%
                    </div>
                    <div>
                      <p className="text-slate-900 text-sm md:text-base font-extrabold">10% Recurring Commission</p>
                      <p className="text-slate-500 text-xs font-semibold mt-0.5 leading-relaxed">Earn a solid 10% commission share on every single service job processed by vendors inside your territory.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF6014]/10 border border-[#FF6014]/20 flex items-center justify-center text-[#FF6014] shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-slate-900 text-sm md:text-base font-extrabold">Exclusive Area Ownership</p>
                      <p className="text-slate-500 text-xs font-semibold mt-0.5 leading-relaxed">Obtain exclusive agent rights to coordinate, dispatch, and manage client requests in your selected division/district.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF6014]/10 border border-[#FF6014]/20 flex items-center justify-center text-[#FF6014] shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="text-slate-900 text-sm md:text-base font-extrabold">Onboard & Approve Local Vendors</p>
                      <p className="text-slate-500 text-xs font-semibold mt-0.5 leading-relaxed">Scale up your territory's total booking volume by verifying and approving qualified service providers.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-semibold">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Rajseba Partner Onboarding Portal</span>
            </div>
          </div>

          {/* ===== RIGHT SPLIT PANEL (FORM PANEL) ===== */}
          <div className="md:col-span-7 flex flex-col justify-center py-4">
            <div className="max-w-md w-full mx-auto space-y-6 p-6 sm:p-8 md:p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/40 bg-white">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {step === 1 ? "Basic Credentials" : "Business Details"}
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  {step === 1 ? "Provide your login contact information" : "Add service offerings and location details"}
                </p>
              </div>

              {/* Stepper bar indicator */}
              <div className="flex gap-2">
                <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-[#FF6014]" : "bg-slate-100"}`} />
                <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-[#FF6014]" : "bg-slate-100"}`} />
              </div>

              {step === 1 ? (
                /* ── STEP 1: REGISTRATION FORM ── */
                <form onSubmit={handleRegister} className="space-y-4.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5">
                      <User size={13} className="text-[#FF6014]" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputNormal}
                      placeholder="e.g. Mahbubur Rahman"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5">
                      <Phone size={13} className="text-[#FF6014]" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={inputNormal}
                      placeholder="e.g. 017XXXXXXXX"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5">
                      <Mail size={13} className="text-[#FF6014]" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputNormal}
                      placeholder="e.g. mahbub@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full mt-6 bg-[#FF6014] hover:bg-[#E0530A] disabled:opacity-60 text-white text-[11px] font-extrabold tracking-wide py-3.5 h-auto rounded-xl border-none transition-all duration-200 shadow-[0_4px_16px_rgba(255,96,20,0.3)] hover:shadow-[0_6px_20px_rgba(255,96,20,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2 active:translate-y-0 cursor-pointer"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* ── STEP 2: PROFILE PROFILE DETAILS FORM ── */
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5">
                      <Building size={13} className="text-[#FF6014]" />
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                      className={inputNormal}
                      placeholder="e.g. Rahman Maintenance Services"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">
                      Categories Offered
                    </label>
                    <Select
                      isMulti
                      options={categories.map((c: any) => ({ value: c.id, label: c.name }))}
                      onChange={(selected: any) => setSelectedCategoryIds(selected.map((s: any) => s.value))}
                      placeholder="Select service categories..."
                      required={selectedCategoryIds.length === 0}
                      styles={{
                        control: (base: any, state: any) => ({
                          ...base,
                          borderRadius: "0.75rem",
                          border: "1px solid #E7E5E4",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: "#FAFAF9",
                          outline: "none",
                          boxShadow: state.isFocused ? "0 0 0 2px rgba(255, 96, 20, 0.1)" : "none",
                          borderColor: state.isFocused ? "#FF6014" : "#E7E5E4",
                          "&:hover": {
                            borderColor: state.isFocused ? "#FF6014" : "#D6D3D1"
                          }
                        })
                      }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5">
                      <ImageIcon size={13} className="text-[#FF6014]" />
                      Profile / Logo Picture
                    </label>

                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-200 hover:border-[#FF6014]/40 rounded-xl bg-slate-50/50 hover:bg-white transition-all cursor-pointer relative group">
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-slate-400 group-hover:text-[#FF6014] transition-colors" />
                        <div className="flex text-xs text-slate-600 justify-center">
                          <span className="relative font-bold text-[#FF6014] hover:text-[#E0530A]">
                            {pictureFile ? pictureFile.name : "Upload photo"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">PNG, JPG, JPEG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setPictureFile(e.target.files[0]);
                          }
                        }}
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">
                      Service Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={2}
                      className={`${inputNormal} resize-none`}
                      placeholder="Briefly explain your services or experience..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5">
                        <DollarSign size={13} className="text-[#FF6014]" />
                        Min Starting Price
                      </label>
                      <input
                        type="number"
                        name="min_starting_price"
                        value={formData.min_starting_price}
                        onChange={handleChange}
                        required
                        className={inputNormal}
                        placeholder="e.g. 500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5">
                        <Globe size={13} className="text-[#FF6014]" />
                        Google Map Link
                      </label>
                      <input
                        type="url"
                        name="google_map_link"
                        value={formData.google_map_link}
                        onChange={handleChange}
                        required
                        className={inputNormal}
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">
                      Region Location
                    </label>
                    <LocationCascader
                      selectedDevisionId={formData.devision_id}
                      selectedDistrictId={formData.district_id}
                      selectedAreaId={formData.area_id}
                      onDevisionChange={(id) => setFormData(prev => ({ ...prev, devision_id: id, district_id: "", area_id: "" }))}
                      onDistrictChange={(id) => setFormData(prev => ({ ...prev, district_id: id, area_id: "" }))}
                      onAreaChange={(id) => setFormData(prev => ({ ...prev, area_id: id }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em] flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#FF6014]" />
                      Detailed Street Address
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className={inputNormal}
                      placeholder="e.g. House 45, Road 2, Banani"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCreatingProfile || isUploading}
                    className="w-full mt-6 bg-[#FF6014] hover:bg-[#E0530A] disabled:opacity-60 text-white text-[11px] font-extrabold tracking-wide py-3.5 h-auto rounded-xl border-none transition-all duration-200 shadow-[0_4px_16px_rgba(255,96,20,0.3)] hover:shadow-[0_6px_20px_rgba(255,96,20,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2 active:translate-y-0 cursor-pointer"
                  >
                    {(isCreatingProfile || isUploading) ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <CheckCircle2 size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function OpportunityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF6014]" />
      </div>
    }>
      <OpportunityPageContent />
    </Suspense>
  );
}
