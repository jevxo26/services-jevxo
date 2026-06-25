"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, ShieldCheck, XCircle, Eye, MoreVertical, Trash2, Store, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomTable } from "@/components/ui/table";
import { CustomSelect } from "@/components/ui/select";
import { useGetAllUsersQuery, useUpdateUserMutation, useCreateUserMutation, useDeleteUserMutation } from "@/redux/features/admin/user";
import { useGetAllRolesQuery } from "@/redux/features/admin/role";
import { useCreateProfileMutation } from "@/redux/features/admin/profile";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { toast } from "sonner";
import { LocationCascader } from "@/components/ui/LocationCascader";

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

export default function VendorsManagementPage() {
  const router = useRouter();
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<VendorItem | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);

  const [selectedDevision, setSelectedDevision] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");

  const [profileType, setProfileType] = useState<string>("personal");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorItem | null>(null);

  // Connect APIs
  const { data: apiUsersRes, isLoading: isUsersLoading, refetch } = useGetAllUsersQuery();
  const { data: rolesRes } = useGetAllRolesQuery();
  const { data: apiCategoriesRes, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();

  const [updateUserMut] = useUpdateUserMutation();
  const [createUserMut, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [deleteUserMut] = useDeleteUserMutation();
  const [createProfileMut, { isLoading: isCreatingProfile }] = useCreateProfileMutation();

  const allCategories = apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);

  useEffect(() => {
    const apiUsers = apiUsersRes?.data || (Array.isArray(apiUsersRes) ? apiUsersRes : []);
    if (apiUsers && apiUsers.length > 0) {
      // Filter only vendors
      const vendorUsers = apiUsers.filter((u: any) =>
        u.role?.name === "Vendor" || u.role === "Vendor"
      );

      const mappedUsers = vendorUsers.map((u: any) => ({
        id: u.id || u._id || `VND-${Math.floor(Math.random() * 1000)}`,
        name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown Vendor',
        email: u.email || 'No Email',
        phone: u.phone || u.phoneNumber || 'No Phone',
        role: u.role?.name || (typeof u.role === 'string' ? u.role : 'Vendor'),
        status: u.status?.toLowerCase() || 'inactive',
        joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown',
        categoryName: u.profile?.category?.name || 'Unassigned',
        profile: u.profile,
        commission_percentage: u.commission_percentage || 0,
        wallet_balance: u.wallet_balance || 0,
      }));
      setVendors(mappedUsers);
    } else {
      setVendors([]);
    }
  }, [apiUsersRes]);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const roles = rolesRes?.data || (Array.isArray(rolesRes) ? rolesRes : []);
    const vendorRole = roles.find((r: any) => r.name === "Vendor");

    if (!vendorRole) {
      toast.error("Vendor role not found in the database!");
      return;
    }

    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      roleId: Number(vendorRole.id || vendorRole._id),
      commission_percentage: Number(formData.get("commission_percentage")) || 0,
    };

    try {
      const userRes = await createUserMut(userData).unwrap();
      const newUserId = userRes.data?.id || userRes.id;
      setCreatedUserId(newUserId);
      toast.success("Vendor user account created! Now complete the profile.");
      setStep(2); // Move to Step 2
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to create vendor user.");
    }
  };

  const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createdUserId) {
      toast.error("User ID missing. Start over.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const categoryIds = selectedCategoryIds;

    const profileData = {
      user_id: createdUserId,
      category_ids: categoryIds.length > 0 ? categoryIds : undefined,
      type: profileType,
      location: formData.get("location")?.toString() || "",
      devision_id: selectedDevision ? Number(selectedDevision) : undefined,
      district_id: selectedDistrict ? Number(selectedDistrict) : undefined,
      area_id: selectedArea ? Number(selectedArea) : undefined,
      description: formData.get("description")?.toString() || "",
      company_name: formData.get("company_name")?.toString() || "",
      min_starting_price: formData.get("min_starting_price") ? Number(formData.get("min_starting_price")) : 0,
      google_map_link: formData.get("google_map_link")?.toString() || "",
    };

    try {
      await createProfileMut(profileData).unwrap();
      toast.success("Vendor profile completed successfully!");
      closeModal();
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to create vendor profile.");
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setStep(1);
    setCreatedUserId(null);
    setSelectedDevision("");
    setSelectedDistrict("");
    setSelectedArea("");
    setProfileType("personal");
    setSelectedCategoryIds([]);
  };

  const handleEditVendor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingVendor) return;
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      commission_percentage: Number(formData.get("commission_percentage")) || 0,
    };
    try {
      await updateUserMut({ id: editingVendor.id, data }).unwrap();
      toast.success("Vendor updated successfully!");
      setIsEditModalOpen(false);
      setEditingVendor(null);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to update vendor.");
    }
  };

  // Actions
  const handleActivate = async (id: string) => {
    setVendors(prev => prev.map(u => u.id === id ? { ...u, status: "active" as const } : u));
    try { await updateUserMut({ id, data: { status: "active" } }).unwrap(); } catch (e) { console.error(e); }
  };

  const handleDeactivate = async (id: string) => {
    setVendors(prev => prev.map(u => u.id === id ? { ...u, status: "inactive" as const } : u));
    try { await updateUserMut({ id, data: { status: "inactive" } }).unwrap(); } catch (e) { console.error(e); }
  };

  const handleBlock = async (id: string) => {
    setVendors(prev => prev.map(u => u.id === id ? { ...u, status: "blocked" as const } : u));
    try { await updateUserMut({ id, data: { status: "blocked" } }).unwrap(); } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await deleteUserMut(id).unwrap();
      toast.success("Vendor deleted successfully!");
      refetch();
    } catch (e: any) {
      console.error(e);
      toast.error(e.data?.message || "Failed to delete vendor.");
    }
  };

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#FFF8F7] rounded-2xl text-[#FF7C71] mb-4"><ShieldAlert size={48} /></div>
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
      </div>
    );
  }

  const columns = [
    {
      key: "name",
      header: "Vendor Details",
      render: (user: VendorItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{user.name}</p>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
            {user.phone && user.phone !== 'No Phone' && (
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{user.phone}</p>
            )}
          </div>
        </div>
      )
    },
    {
      key: "categoryName",
      header: "Category",
      render: (vendor: VendorItem) => (
        <div className="flex flex-wrap gap-1">
          {vendor.profile?.categories?.length > 0 ? (
            vendor.profile.categories.map((cat: any) => (
              <span key={cat.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {cat.name}
              </span>
            ))
          ) : (
            <span className="text-slate-400 italic font-normal text-xs">{vendor.categoryName}</span>
          )}
        </div>
      )
    },
    {
      key: "wallet",
      header: "Wallet & Comm.",
      render: (vendor: VendorItem) => (
        <div>
          <p className="font-bold text-slate-900 text-sm">৳{(vendor.wallet_balance || 0).toLocaleString()}</p>
          <p className="text-xs text-slate-500 font-medium">{vendor.commission_percentage || 0}% Comm.</p>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (user: VendorItem) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${user.status === "active"
          ? "bg-emerald-50 text-emerald-700"
          : user.status === "blocked"
            ? "bg-[#FFF8F7] text-[#E5675D]"
            : "bg-slate-100 text-slate-600"
          }`}>
          {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : ''}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: VendorItem) => (
        <div className="relative flex justify-end">
          <button
            onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <MoreVertical size={16} />
          </button>

          {openDropdownId === user.id && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => { router.push(`/dashbord/vendors/${user.id}`); setOpenDropdownId(null); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Eye size={14} className="text-slate-400" /> View Details
                </button>

                <button
                  onClick={() => { 
                    setEditingVendor(user); 
                    setIsEditModalOpen(true); 
                    setOpenDropdownId(null); 
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Edit size={14} className="text-slate-400" /> Edit Vendor
                </button>

                {user.status !== "active" && (
                  <button
                    onClick={() => { handleActivate(user.id); setOpenDropdownId(null); }}
                    className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 font-medium"
                  >
                    <ShieldCheck size={14} /> Activate
                  </button>
                )}

                {user.status !== "inactive" && (
                  <button
                    onClick={() => { handleDeactivate(user.id); setOpenDropdownId(null); }}
                    className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2 font-medium"
                  >
                    <XCircle size={14} /> Deactivate
                  </button>
                )}

                {user.status !== "blocked" && (
                  <button
                    onClick={() => { handleBlock(user.id); setOpenDropdownId(null); }}
                    className="w-full text-left px-4 py-2 text-sm text-[#E5675D] hover:bg-[#FFF8F7] flex items-center gap-2 font-medium"
                  >
                    <XCircle size={14} /> Block
                  </button>
                )}

                <div className="h-px bg-slate-100 my-1 mx-2" />

                <button
                  onClick={() => { handleDelete(user.id); setOpenDropdownId(null); }}
                  className="w-full text-left px-4 py-2 text-sm text-[#E5675D] hover:bg-[#FFF8F7] flex items-center gap-2 font-medium"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F7] text-[#FF7C71] rounded-2xl">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Vendor Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage system vendors and their profiles.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            Add Vendor
          </button>
        </div>
      </div>

      {isUsersLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#FF7C71] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">Loading vendors...</p>
        </div>
      ) : vendors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <p className="text-sm text-slate-400 font-medium">No vendors found.</p>
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={vendors}
          searchKey="name"
          searchPlaceholder="Search vendors by name..."
          filterKey="status"
          filterPlaceholder="All Statuses"
          filterOptions={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Blocked", value: "blocked" }
          ]}
          pageSize={10}
        />
      )}

      {/* Add Vendor Modal (2 Steps) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {step === 1 ? "Step 1: Vendor Account" : "Step 2: Vendor Profile"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-all">
                <XCircle size={24} />
              </button>
            </div>

            {step === 1 ? (
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
                  <input name="name" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
                  <input name="email" type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="john@vendor.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
                  <input name="phone" type="tel" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="01XXXXXXXXX" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Commission Percentage (%)</label>
                  <input name="commission_percentage" type="number" min="0" max="100" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="e.g. 80" />
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={isCreatingUser} className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-all disabled:opacity-50">
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
                      { value: "company", label: "Company / Agency" }
                    ]}
                    value={profileType}
                    onChange={(val) => setProfileType(val)}
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
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Company / Business Name (Optional)</label>
                  <input name="company_name" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="Acme Services Ltd." />
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
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Specific Location (Optional)</label>
                  <input name="location" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="City, Region" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Description</label>
                  <textarea name="description" rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all resize-none" placeholder="Briefly describe the vendor's services..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Min Starting Price</label>
                    <input name="min_starting_price" type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Google Map Link</label>
                    <input name="google_map_link" type="url" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="https://maps.google.com/..." />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button type="submit" disabled={isCreatingProfile} className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-all disabled:opacity-50">
                    {isCreatingProfile ? "Saving..." : "Complete Profile"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Vendor Details</h2>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-all">
                <XCircle size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">Name</span>
                <span className="text-sm font-bold text-slate-900">{selectedUser.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">Email</span>
                <span className="text-sm font-bold text-slate-900">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">Phone</span>
                <span className="text-sm font-bold text-slate-900">{selectedUser.phone}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">Category</span>
                <span className="text-sm font-bold text-slate-900">{selectedUser.categoryName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">Commission</span>
                <span className="text-sm font-bold text-slate-900">{selectedUser.commission_percentage}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">Wallet Balance</span>
                <span className="text-sm font-bold text-emerald-600">৳{(selectedUser.wallet_balance || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">Status</span>
                <span className="text-sm font-bold text-slate-900">{selectedUser.status}</span>
              </div>
            </div>
            <div className="pt-6 flex justify-end">
              <button onClick={() => setSelectedUser(null)} className="px-5 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingVendor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-extrabold text-slate-800">Edit Vendor</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-all">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleEditVendor} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
                  <input name="name" type="text" defaultValue={editingVendor.name} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
                  <input name="email" type="email" defaultValue={editingVendor.email} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
                  <input name="phone" type="tel" defaultValue={editingVendor.phone || ""} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Commission Percentage (%)</label>
                  <input name="commission_percentage" type="number" min="0" max="100" defaultValue={editingVendor.commission_percentage || 0} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all" />
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-all">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
