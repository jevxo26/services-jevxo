"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useCreateProfileMutation } from "@/redux/features/admin/profile";
import { useGetPublicRolesQuery, useGetPublicCategoriesQuery } from "@/redux/features/landing/landingApi";
import { uploadImage } from "@/lib/upload";
import { CheckCircle2, MapPin } from "lucide-react";

export const vendorBenefits = [
  { val: "90%", title: "Keep 90% of Your Earnings", desc: "We only charge a flat 10% platform commission on completed jobs. You keep the remaining 90% of the revenue." },
  { val: "৳0", title: "Free Setup & Zero Monthly Fees", desc: "Registration is completely free. We do not charge subscription fees for listing services or accepting leads." },
  { icon: CheckCircle2, title: "Weekly Verified Payouts", desc: "Earnings are settled directly into your bank account or Mobile Wallet (bKash/Nagad) securely every week." },
];

export const agentBenefits = [
  { val: "10%", title: "10% Recurring Commission", desc: "Earn a solid 10% commission share on every single service job processed by vendors inside your territory." },
  { icon: MapPin, title: "Exclusive Area Ownership", desc: "Obtain exclusive agent rights to coordinate, dispatch, and manage client requests in your selected division/district." },
  { icon: CheckCircle2, title: "Onboard & Approve Local Vendors", desc: "Scale up your territory's total booking volume by verifying and approving qualified service providers." },
];

export function useOpportunityState() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [shopImage1File, setShopImage1File] = useState<File | null>(null);
  const [shopImage2File, setShopImage2File] = useState<File | null>(null);
  const [nidFrontFile, setNidFrontFile] = useState<File | null>(null);
  const [nidBackFile, setNidBackFile] = useState<File | null>(null);

  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [createProfile, { isLoading: isCreatingProfile }] = useCreateProfileMutation();
  const { data: rolesRes } = useGetPublicRolesQuery();
  const { data: categoriesRes } = useGetPublicCategoriesQuery();

  const roles = rolesRes?.data || (Array.isArray(rolesRes) ? rolesRes : []);
  const categories = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", company_name: "", location: "",
    description: "", min_starting_price: "", google_map_link: "",
    devision_id: "", district_id: "", area_id: "", nid_number: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectRole = (role: "Vendor" | "Agent") => {
    router.push(`/opportunity?role=${role}`);
  };

  const handleBack = (selectedRole: string | null) => {
    if (step === 2) { setStep(1); }
    else { router.push("/opportunity"); }
  };

  const handleRegister = async (e: React.FormEvent, selectedRole: string | null) => {
    e.preventDefault();
    const roleObj = roles.find((r: any) => r.name === selectedRole);
    if (!roleObj) { toast.error("Role not found in the system. Please try again later."); return; }
    try {
      const response = await register({
        name: formData.name, phone: formData.phone, email: formData.email,
        roleId: roleObj.id, status: "inactive",
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

  const handleProfileSubmit = async (e: React.FormEvent, selectedRole: string | null) => {
    e.preventDefault();
    if (!createdUserId) return;
    if (!formData.devision_id || !formData.district_id || !formData.area_id) {
      toast.error("Please complete the location details (Division, District, Area)."); return;
    }
    
    // Conditionally validate categories
    if (selectedRole === "Vendor" && selectedCategoryIds.length === 0) {
      toast.error("Please select at least one category."); return;
    }
    
    if (!pictureFile) {
      toast.error("Please upload a picture."); return;
    }
    
    // Validate NID for Agent role
    if (selectedRole === "Agent") {
      if (!formData.nid_number.trim()) {
        toast.error("Please provide your NID number."); return;
      }
      if (!nidFrontFile || !nidBackFile) {
        toast.error("Please upload both NID front and back images."); return;
      }
      if (!shopImage1File || !shopImage2File) {
        toast.error("Please upload both Shop Image 1 and Shop Image 2."); return;
      }
    }

    try {
      setIsUploading(true);
      
      const pictureUrl = await uploadImage(pictureFile);
      
      let shopImageUrl1 = "";
      if (shopImage1File) {
        shopImageUrl1 = await uploadImage(shopImage1File);
      }
      
      let shopImageUrl2 = "";
      if (shopImage2File) {
        shopImageUrl2 = await uploadImage(shopImage2File);
      }
      
      let nidFrontUrl = "";
      if (nidFrontFile) {
        nidFrontUrl = await uploadImage(nidFrontFile);
      }
      
      let nidBackUrl = "";
      if (nidBackFile) {
        nidBackUrl = await uploadImage(nidBackFile);
      }
      
      setIsUploading(false);
      
      await createProfile({
        user_id: createdUserId, type: "business",
        company_name: formData.company_name,
        category_ids: selectedRole === "Agent" ? [] : selectedCategoryIds,
        location: formData.location, description: formData.description,
        picture: pictureUrl,
        min_starting_price: selectedRole === "Agent" ? 0 : (Number(formData.min_starting_price) || 0),
        google_map_link: selectedRole === "Agent" ? "" : formData.google_map_link,
        devision_id: Number(formData.devision_id),
        district_id: Number(formData.district_id),
        area_id: Number(formData.area_id),
        
        shop_image1: shopImageUrl1 || undefined,
        shop_image2: shopImageUrl2 || undefined,
        nid_number: selectedRole === "Agent" ? formData.nid_number : undefined,
        nid_front: nidFrontUrl || undefined,
        nid_back: nidBackUrl || undefined,
      }).unwrap();
      
      toast.success("Application submitted successfully! Please wait for admin approval.");
      router.push("/");
    } catch (err: any) {
      setIsUploading(false);
      toast.error(err.data?.message || err.message || "Failed to save profile. Please try again.");
    }
  };

  return {
    step, formData, setFormData, handleChange,
    selectedCategoryIds, setSelectedCategoryIds,
    pictureFile, setPictureFile,
    shopImage1File, setShopImage1File,
    shopImage2File, setShopImage2File,
    nidFrontFile, setNidFrontFile,
    nidBackFile, setNidBackFile,
    isRegistering, isCreatingProfile, isUploading,
    categories, handleSelectRole, handleBack,
    handleRegister, handleProfileSubmit,
  };
}
