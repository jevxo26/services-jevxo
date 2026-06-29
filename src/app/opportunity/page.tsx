"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  UserCheck,
  ChevronLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  Building,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { LocationCascader } from "@/components/ui/LocationCascader";
import Select from "react-select";
import { uploadImage } from "@/lib/upload";
import { useCreateProfileMutation } from "@/redux/features/admin/profile";
import { useGetPublicRolesQuery, useGetPublicCategoriesQuery } from "@/redux/features/landing/landingApi";

export default function OpportunityPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"Vendor" | "Agent" | null>(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      // Ensure we have a token if it's returned so we can call the protected profile endpoint
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

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pt-24 pb-12 px-4 font-sans">
        <div className="max-w-4xl mx-auto w-full">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-[#FF6014] mb-8 transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Join Rajseba Platform</h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Partner with Bangladesh's leading home service platform and grow your business with us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setSelectedRole("Vendor")}
              className="bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-[#FF6014] hover:shadow-xl hover:shadow-[#FF6014]/10 transition-all text-left group"
            >
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6014] mb-6 group-hover:scale-110 transition-transform">
                <Briefcase size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Become a Vendor</h2>
              <p className="text-slate-500 mb-6">List your services, manage bookings, and reach thousands of customers across the country.</p>
              <div className="flex items-center text-[#FF6014] font-bold text-sm">
                Apply Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setSelectedRole("Agent")}
              className="bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all text-left group"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <UserCheck size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Become an Agent</h2>
              <p className="text-slate-500 mb-6">Manage a network of vendors, oversee operations in your designated area, and earn commissions.</p>
              <div className="flex items-center text-blue-500 font-bold text-sm">
                Apply Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      <div className="hidden md:flex md:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        
        <div className="relative z-10">
          <Link href="/" className="text-2xl font-black text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF6014] rounded-lg flex items-center justify-center text-sm">R</div>
            Rajseba
          </Link>
          <div className="mt-24">
            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
              Apply as {selectedRole === "Vendor" ? "a Vendor" : "an Agent"}
            </h2>
            <p className="text-slate-400 text-lg max-w-md">
              Complete your application to join our growing network of service professionals.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle className="text-emerald-400" size={20} />
            <span>Fast onboarding process</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle className="text-emerald-400" size={20} />
            <span>Dedicated support team</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle className="text-emerald-400" size={20} />
            <span>Secure & reliable platform</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto">
        <button
          onClick={() => setSelectedRole(null)}
          className="mb-8 text-sm font-bold text-slate-400 hover:text-slate-800 flex items-center transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> Back
        </button>

        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? "bg-[#FF6014]" : "bg-slate-100"}`} />
            <div className={`flex-1 h-1.5 rounded-full ml-2 ${step >= 2 ? "bg-[#FF6014]" : "bg-slate-100"}`} />
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-6">
            {step === 1 ? "Basic Information" : "Profile Details"}
          </h3>

          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all outline-none"
                  placeholder="01712-XXXXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full mt-6 bg-[#FF6014] hover:bg-[#FF6014]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#FF6014]/20 flex justify-center items-center gap-2 transition-all"
              >
                {isRegistering ? <Loader2 size={18} className="animate-spin" /> : "Next Step"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Building size={14}/> Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all outline-none"
                  placeholder="Your Business Name"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Categories</label>
                <Select
                  isMulti
                  options={categories.map((c: any) => ({ value: c.id, label: c.name }))}
                  onChange={(selected: any) => setSelectedCategoryIds(selected.map((s: any) => s.value))}
                  placeholder="Select Categories"
                  required={selectedCategoryIds.length === 0}
                  styles={{
                    control: (base: any, state: any) => ({
                      ...base,
                      borderRadius: "0.75rem",
                      borderColor: state.isFocused ? "#FF6014" : "#e2e8f0",
                      padding: "2px",
                      backgroundColor: "#f8fafc",
                      boxShadow: state.isFocused ? "0 0 0 2px rgba(255, 96, 20, 0.1)" : "none",
                      "&:hover": {
                        borderColor: state.isFocused ? "#FF6014" : "#cbd5e1"
                      }
                    })
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setPictureFile(e.target.files[0]);
                    }
                  }}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e: any) => handleChange(e)}
                  required
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all outline-none"
                  placeholder="Describe your services briefly"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Min Starting Price</label>
                  <input
                    type="number"
                    name="min_starting_price"
                    value={formData.min_starting_price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all outline-none"
                    placeholder="e.g. 500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Google Map Link</label>
                  <input
                    type="url"
                    name="google_map_link"
                    value={formData.google_map_link}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all outline-none"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <LocationCascader
                  selectedDevisionId={formData.devision_id}
                  selectedDistrictId={formData.district_id}
                  selectedAreaId={formData.area_id}
                  onDevisionChange={(id) => setFormData(prev => ({ ...prev, devision_id: id, district_id: "", area_id: "" }))}
                  onDistrictChange={(id) => setFormData(prev => ({ ...prev, district_id: id, area_id: "" }))}
                  onAreaChange={(id) => setFormData(prev => ({ ...prev, area_id: id }))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><MapPin size={14}/> Detailed Location Address</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all outline-none"
                  placeholder="Street, Area, City"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingProfile || isUploading}
                className="w-full mt-6 bg-[#FF6014] hover:bg-[#FF6014]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#FF6014]/20 flex justify-center items-center gap-2 transition-all"
              >
                {(isCreatingProfile || isUploading) ? <Loader2 size={18} className="animate-spin" /> : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
