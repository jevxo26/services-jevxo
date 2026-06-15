"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, ShieldCheck, XCircle, Check, Eye, MoreVertical, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomTable } from "@/components/ui/table";
import { useGetAllUsersQuery, useUpdateUserMutation, useCreateUserMutation, useDeleteUserMutation } from "@/redux/features/admin/user";
import { toast } from "sonner";

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
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  const [users, setUsers] = useState<UserItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Connect APIs
  const { data: apiUsersRes, isLoading: isUsersLoading, refetch } = useGetAllUsersQuery();
  const [updateUserMut] = useUpdateUserMutation();
  const [createUserMut, { isLoading: isCreating }] = useCreateUserMutation();
  const [deleteUserMut] = useDeleteUserMutation();

  useEffect(() => {
    const apiUsers = apiUsersRes?.data || (Array.isArray(apiUsersRes) ? apiUsersRes : []);
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
    }
  }, [apiUsersRes]);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };
    try {
      await createUserMut(data).unwrap();
      toast.success("User created successfully!");
      setIsAddModalOpen(false);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || "Failed to create user.");
    }
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
        <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 mb-4">
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
            ? "bg-rose-50 text-rose-700"
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
                <button
                  onClick={() => { setSelectedUser(user); setOpenDropdownId(null); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Eye size={14} className="text-slate-400" /> View Details
                </button>

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
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <XCircle size={14} /> Block User
                  </button>
                )}

                <div className="h-px bg-slate-100 my-1 mx-2" />

                <button
                  onClick={() => { handleDelete(user.id); setOpenDropdownId(null); }}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <Trash2 size={14} /> Delete User
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Verify service professionals and manage platform customers.</p>
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
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
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
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Add New User</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-all">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
                <input name="name" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
                <input name="email" type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
                <input name="phone" type="tel" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all" placeholder="01XXXXXXXXX" />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={isCreating} className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all disabled:opacity-50">
                  {isCreating ? "Saving..." : "Save User"}
                </button>
              </div>
            </form>
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
