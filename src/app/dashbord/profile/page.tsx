"use client";

import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import { User as UserIcon, Phone, MapPin, Mail, Save } from "lucide-react";
import { toast } from "sonner";
import { useGetUserProfileQuery } from "@/redux/features/auth/authApi";
import { useUpdateUserMutation } from "@/redux/features/admin/user";
import { useCreateProfileMutation, useUpdateProfileMutation } from "@/redux/features/admin/profile";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { useState, useEffect } from "react";
import { LocationCascader } from "@/components/ui/LocationCascader";
import { CustomSelect } from "@/components/ui/select";

export default function ProfilePage() {
  const role = useAppSelector((state) => state.auth.role) || "client";
  const reduxUser = useAppSelector((state) => state.auth.user);

  const { data: userRes, isLoading: isUserLoading, refetch } = useGetUserProfileQuery();
  const [updateUserMut] = useUpdateUserMutation();
  const [createProfileMut, { isLoading: isCreatingProfile }] = useCreateProfileMutation();
  const [updateProfileMut, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const { data: apiCategoriesRes, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();
  const allCategories = apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);

  // Prefer API response, fall back to Redux store (which is persisted from localStorage)
  const apiUser = userRes?.data?.user || userRes?.data || userRes;
  const user = (apiUser && Object.keys(apiUser).length > 1 ? apiUser : null) || reduxUser || {};
  const profile = apiUser?.profile;

  const name = (user as any).name || ((user as any).firstName ? `${(user as any).firstName} ${(user as any).lastName || ''}`.trim() : null) || "Unknown User";
  const email = (user as any).email || "No Email";
  const phone = (user as any).phone || (user as any).phoneNumber || "No Phone";
  const address = profile?.location || "No Address Provided";
  const hasProfile = !!profile;

  const [selectedDevision, setSelectedDevision] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("personal");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (profile && !selectedDevision && !selectedDistrict && !selectedArea) {
      if (profile.devision?.id) setSelectedDevision(profile.devision.id.toString());
      if (profile.district?.id) setSelectedDistrict(profile.district.id.toString());
      if (profile.area?.id) setSelectedArea(profile.area.id.toString());
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      if (profile.type) setSelectedType(profile.type);
      if (profile.categories?.length) setSelectedCategories(profile.categories.map((c: any) => c.id.toString()));
    }
  }, [profile]);


  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedUserData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
    };

    const primaryAddress = formData.get("address")?.toString().trim() || "";
    const specificLocation = formData.get("location")?.toString().trim() || "";
    const locationParts = [primaryAddress, specificLocation].filter(
      (part, index, arr) => part && arr.indexOf(part) === index
    );
    const combinedLocation = locationParts.join(", ");

    const profileData = {
      user_id: user.id || user._id,
      category_ids: selectedCategories.map(id => Number(id)),
      type: selectedType,
      location: combinedLocation,
      devision_id: selectedDevision ? Number(selectedDevision) : undefined,
      district_id: selectedDistrict ? Number(selectedDistrict) : undefined,
      area_id: selectedArea ? Number(selectedArea) : undefined,
      description: formData.get("description")?.toString() || "",
      company_name: formData.get("company_name")?.toString() || "",
      min_starting_price: formData.get("min_starting_price") ? Number(formData.get("min_starting_price")) : 0,
      google_map_link: formData.get("google_map_link")?.toString() || "",
    };

    try {
      if (user.id || user._id) {
        // Update User
        await updateUserMut({ id: user.id || user._id, data: updatedUserData }).unwrap();
        
        // Update or Create Profile
        if (hasProfile) {
          await updateProfileMut({ id: profile.id, data: profileData }).unwrap();
        } else {
          await createProfileMut(profileData).unwrap();
        }
        
        toast.success("Profile saved successfully!");
        refetch();
      } else {
        toast.error("User ID not found! Cannot update.");
      }
    } catch (err) {
      toast.error("Failed to save profile");
      console.error(err);
    }
  };

  const isSaving = isCreatingProfile || isUpdatingProfile;

  if (isUserLoading && !reduxUser) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading profile...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F7] text-[#FF7C71] rounded-2xl">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">My Profile</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage personal contact card, addresses, and emergency backup details.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Premium ID Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 bg-[#FFEBE9] text-[#E5675D] rounded-full flex items-center justify-center font-black text-3xl shadow-inner relative">
            {name?.substring(0, 2).toUpperCase() || "UU"}
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-[10px] text-white">
              ✓
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{name}</h3>
            <span className="text-xs font-semibold text-[#FF7C71] bg-[#FFF8F7] px-2.5 py-0.5 rounded-lg mt-1 inline-block capitalize">
              {getRoleName(role)}
            </span>
          </div>

          <div className="w-full pt-4 border-t border-slate-50 space-y-2 text-xs font-medium text-slate-500 text-left">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-slate-400" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-slate-400" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-slate-400" />
              <span>{address}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Update Forms */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Edit Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={name !== "Unknown User" ? name : ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Contact Number</label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={phone !== "No Phone" ? phone : ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Primary Delivery Address</label>
                <input
                  name="address"
                  type="text"
                  defaultValue={address !== "No Address Provided" ? address : ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                  required
                />
              </div>

              <div className="sm:col-span-2 pt-6 pb-2">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Professional & Public Details</h4>
                <div className="flex flex-wrap gap-1 mt-4">
                  {profile?.categories?.length > 0 ? (
                    profile.categories.map((cat: any) => (
                      <span key={cat.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
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
                  label="Profile Type"
                  options={[
                    { value: "personal", label: "Personal / Freelancer" },
                    { value: "company", label: "Company / Agency" }
                  ]}
                  value={selectedType}
                  onChange={setSelectedType}
                  placeholder="Select Type"
                />
              </div>

              <div>
                <CustomSelect
                  label="Categories (Multiple)"
                  options={allCategories.map((c: any) => ({ value: c.id.toString(), label: c.name }))}
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder={isCategoriesLoading ? "Loading..." : "Select Categories"}
                  isMulti={true}
                  disabled={isCategoriesLoading}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Company / Business Name (Optional)</label>
                <input
                  name="company_name"
                  type="text"
                  defaultValue={profile?.company_name || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                  placeholder="Leave blank if personal"
                />
              </div>

              <div className="sm:col-span-2">
                <LocationCascader
                  selectedDevisionId={selectedDevision}
                  selectedDistrictId={selectedDistrict}
                  selectedAreaId={selectedArea}
                  onDevisionChange={setSelectedDevision}
                  onDistrictChange={setSelectedDistrict}
                  onAreaChange={setSelectedArea}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Specific Address / Building (Optional)</label>
                <input
                  name="location"
                  type="text"
                  defaultValue={profile?.location || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                  placeholder="e.g. Block C, House 12"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Professional Description</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={profile?.description || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all resize-none font-medium"
                  placeholder="Describe the services and expertise..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Min Starting Price</label>
                <input
                  name="min_starting_price"
                  type="number"
                  step="0.01"
                  defaultValue={profile?.min_starting_price || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Google Map Link</label>
                <input
                  name="google_map_link"
                  type="url"
                  defaultValue={profile?.google_map_link || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                  placeholder="https://maps.app.goo.gl/..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-50">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#FF7C71] hover:bg-[#E5675D] text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
