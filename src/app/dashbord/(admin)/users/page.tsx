"use client";

import Link from "next/link";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, ShieldCheck, XCircle, Check, Eye, MoreVertical, Trash2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomTable } from "@/components/ui/table";
import { useGetAllUsersQuery, useUpdateUserMutation, useCreateUserMutation, useDeleteUserMutation } from "@/redux/features/admin/user";
import { useGetAllRolesQuery } from "@/redux/features/admin/role";
import { useCreateProfileMutation } from "@/redux/features/admin/profile";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { toast } from "sonner";
import { LocationCascader } from "@/components/ui/LocationCascader";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  rating?: string;
}

export default function UsersPage() {
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const currentUser = useAppSelector((state) => state.auth.user);
  const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : (rawRole as any)?.name?.toLowerCase() || "superadmin";

  const [users, setUsers] = useState<UserItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);

  const [selectedDevision, setSelectedDevision] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");

  // Connect APIs
  const { data: apiUsersRes, isLoading: isUsersLoading, refetch } = useGetAllUsersQuery();
  const { data: rolesRes, isLoading: isRolesLoading } = useGetAllRolesQuery();
  const { data: apiCategoriesRes, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();

  const [updateUserMut] = useUpdateUserMutation();
  const [createUserMut, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [deleteUserMut] = useDeleteUserMutation();
  const [createProfileMut, { isLoading: isCreatingProfile }] = useCreateProfileMutation();

  const allCategories = apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);

  useEffect(() => {
    let apiUsers = apiUsersRes?.data || (Array.isArray(apiUsersRes) ? apiUsersRes : []);

    // Filter to ONLY show Clients
    apiUsers = apiUsers.filter((u: any) => {
      const uRole = (u.role?.name || u.role || "").toLowerCase();
      return uRole === "client" || uRole === "customer" || uRole === "user";
    });

    // Vendor/Agent only sees their own clients
    if (role === "vendor" || role === "agent") {
      apiUsers = apiUsers.filter((u: any) =>
        u.vendor?.id?.toString() === currentUser?.id?.toString() || u.vendor_id?.toString() === currentUser?.id?.toString() ||
        u.agent?.id?.toString() === currentUser?.id?.toString() || u.agent_id?.toString() === currentUser?.id?.toString()
      );
    }

    if (apiUsers && apiUsers.length > 0) {
      const mappedUsers = apiUsers.map((u: any) => ({
        id: u.id || u._id || `USR-${Math.floor(Math.random() * 1000)}`,
        name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown User',
        email: u.email || 'No Email',
        phone: u.phone || u.phoneNumber || 'No Phone',
        role: u.role?.name || (typeof u.role === 'string' ? u.role : 'Customer'),
        status: u.status?.toLowerCase() || 'inactive',
        joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown',
        rating: u.rating || 'New',
      }));
      setUsers(mappedUsers);
    } else {
      setUsers([]);
    }
  }, [apiUsersRes, role, currentUser?.id]);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      roleId: Number(formData.get("role")),
    };
    if (role === "vendor") {
      data.vendor_id = Number(currentUser?.id);
    } else if (role === "agent") {
      data.agent_id = Number(currentUser?.id);
    }
    try {
      const userRes = await createUserMut(data).unwrap();
      const newUserId = userRes.data?.id || userRes.id;

      setCreatedUserId(newUserId);
      toast.success("User created successfully! Now complete the profile.");
      setStep(2);
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || "Failed to create user.");
    }
  };

  const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createdUserId) {
      toast.error("User ID missing. Start over.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const categoryIds = formData.getAll("category_ids").map(id => Number(id));

    const profileData = {
      user_id: createdUserId,
      category_ids: categoryIds.length > 0 ? categoryIds : undefined,
      type: formData.get("type")?.toString() || "personal",
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
      toast.success("Profile created successfully!");
      closeModal();
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to create profile.");
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setStep(1);
    setCreatedUserId(null);
    setSelectedDevision("");
    setSelectedDistrict("");
    setSelectedArea("");
  };

  // Verification and Status update actions
  const handleActivate = async (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "active" as const } : u));
    try {
      await updateUserMut({ id, data: { status: "active" } }).unwrap();
    } catch (e) { console.error(e); }
  };

  const handleDeactivate = async (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "inactive" as const } : u));
    try {
      await updateUserMut({ id, data: { status: "inactive" } }).unwrap();
    } catch (e) { console.error(e); }
  };

  const handleBlock = async (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "blocked" as const } : u));
    try {
      await updateUserMut({ id, data: { status: "blocked" } }).unwrap();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserMut(id).unwrap();
      toast.success("User deleted successfully!");
      refetch();
    } catch (e: any) {
      console.error(e);
      toast.error(e.data?.message || "Failed to delete user.");
    }
  };

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Access check — restrict to superadmin when backend role system is finalized
  // Currently relaxed because backend returns role: null for admin users
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#FFF8F4] rounded-2xl text-[#FF6014] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          Please log in to access this panel.
        </p>
      </div>
    );
  }

  // Column definitions for CustomTable
  const columns = [
    {
      key: "name",
      header: "User Details",
      render: (user: UserItem) => (
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
      key: "id",
      header: "ID",
      render: (user: UserItem) => (
        <span className="font-mono text-slate-500 font-bold text-xs">{user.id}</span>
      )
    },
    {
      key: "role",
      header: "Role",
      render: (user: UserItem) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${user.role === "Customer" ? "bg-indigo-50 text-indigo-700" : "bg-teal-50 text-teal-700"
          }`}>
          {user.role}
        </span>
      )
    },
    {
      key: "joined",
      header: "Joined Date"
    },
    {
      key: "status",
      header: "Status",
      render: (user: UserItem) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${user.status === "active"
          ? "bg-emerald-50 text-emerald-700"
          : user.status === "blocked"
            ? "bg-[#FFF8F4] text-[#E0530A]"
            : "bg-slate-100 text-slate-600"
          }`}>
          {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : ''}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: UserItem) => (
        <div className="relative flex justify-end">
          <button
            onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <MoreVertical size={16} />
          </button>

          {openDropdownId === user.id && (
            <>
              {/* Click outside overlay */}
              <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link
                  href={`/dashbord/users/${user.id}`}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Eye size={14} className="text-slate-400" /> View Details
                </Link>

                {user.status !== "active" && (
                  <button
                    onClick={() => { handleActivate(user.id); setOpenDropdownId(null); }}
                    className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 font-medium"
                  >
                    <ShieldCheck size={14} /> Activate User
                  </button>
                )}

                {user.status !== "inactive" && (
                  <button
                    onClick={() => { handleDeactivate(user.id); setOpenDropdownId(null); }}
                    className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2 font-medium"
                  >
                    <XCircle size={14} /> Deactivate User
                  </button>
                )}

                {user.status !== "blocked" && (
                  <button
                    onClick={() => { handleBlock(user.id); setOpenDropdownId(null); }}
                    className="w-full text-left px-4 py-2 text-sm text-[#E0530A] hover:bg-[#FFF8F4] flex items-center gap-2 font-medium"
                  >
                    <XCircle size={14} /> Block User
                  </button>
                )}

                {role !== "agent" && (
                  <>
                    <div className="h-px bg-slate-100 my-1 mx-2" />
                    <button
                      onClick={() => { handleDelete(user.id); setOpenDropdownId(null); }}
                      className="w-full text-left px-4 py-2 text-sm text-[#E0530A] hover:bg-[#FFF8F4] flex items-center gap-2 font-medium"
                    >
                      <Trash2 size={14} /> Delete User
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">User Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">Verify service professionals and manage platform customers.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isUsersLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#FF6014] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <p className="text-sm text-slate-400 font-medium">No users found. The backend may be unavailable.</p>
        </div>
      ) : (
        /* Premium Paginated Table */
        <CustomTable
          columns={columns}
          data={users}
          searchKey="name"
          searchPlaceholder="Search users by name..."
          filterKey="status"
          filterPlaceholder="All Statuses"
          filterOptions={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Blocked", value: "blocked" }
          ]}
          pageSize={5}
        />
      )}      {/* Add User Modal (2 Steps) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {step === 1 ? "Step 1: User Account" : "Step 2: User Profile"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-all">
                <XCircle size={24} />
              </button>
            </div>

            {step === 1 ? (
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
                  <input name="name" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
                  <input name="email" type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
                  <input name="phone" type="tel" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="01XXXXXXXXX" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Role</label>
                  <select name="role" required defaultValue="" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all">
                    <option value="" disabled>Select a role</option>
                    {isRolesLoading ? (
                      <option value="" disabled>Loading roles...</option>
                    ) : (
                      (rolesRes?.data || (Array.isArray(rolesRes) ? rolesRes : []))
                        .filter((r: any) => (role !== "vendor" && role !== "agent") || r.name === "Client")
                        .map((r: any) => (
                          <option key={r.id || r._id} value={r.id || r._id}>{r.name}</option>
                        ))
                    )}
                  </select>
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
                  <select name="type" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all">
                    <option value="personal">Personal / Freelancer</option>
                    <option value="company">Company / Agency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Categories (Hold Ctrl/Cmd to select multiple)</label>
                  <select multiple name="category_ids" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all h-24">
                    {isCategoriesLoading ? (
                      <option value="" disabled>Loading categories...</option>
                    ) : (
                      allCategories.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Company / Business Name (Optional)</label>
                  <input name="company_name" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="Acme Services Ltd." />
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
                  <input name="location" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="House 12, Road 4" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Description</label>
                  <textarea name="description" rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all resize-none" placeholder="Briefly describe the user's services..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Min Starting Price</label>
                    <input name="min_starting_price" type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Google Map Link</label>
                    <input name="google_map_link" type="url" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="https://maps.google.com/..." />
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

      {/* View User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">User Details</h2>
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
                <span className="text-sm text-slate-500 font-medium">Role</span>
                <span className="text-sm font-bold text-slate-900">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">Status</span>
                <span className="text-sm font-bold text-slate-900">{selectedUser.status}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">Joined Date</span>
                <span className="text-sm font-bold text-slate-900">{selectedUser.joined}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-500 font-medium">Rating</span>
                <span className="text-sm font-bold text-slate-900">{selectedUser.rating}</span>
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
    </div>
  );
}
