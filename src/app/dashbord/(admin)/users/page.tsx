"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, ShieldCheck, XCircle, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomTable } from "@/components/ui/table";
import { useGetAllUsersQuery, useUpdateUserMutation } from "@/redux/features/admin/user";
import { useGetAllRolesQuery } from "@/redux/features/admin/role";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "Professional";
  status: "Active" | "Suspended" | "Pending Approval";
  joined: string;
  rating?: string;
}

export default function UsersPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  const [users, setUsers] = useState<UserItem[]>([]);

  // Connect APIs
  const { data: apiUsersRes, isLoading: isUsersLoading } = useGetAllUsersQuery();
  const { data: rolesRes, isLoading: isRolesLoading } = useGetAllRolesQuery();
  const [updateUserMut] = useUpdateUserMutation();

  useEffect(() => {
    const apiUsers = apiUsersRes?.data || (Array.isArray(apiUsersRes) ? apiUsersRes : []);
    if (apiUsers && apiUsers.length > 0) {
      const mappedUsers = apiUsers.map((u: any) => ({
        id: u.id || u._id || `USR-${Math.floor(Math.random() * 1000)}`,
        name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown User',
        email: u.email || 'No Email',
        role: u.role === 'Professional' || u.role?.name === 'Professional' ? 'Professional' : 'Customer',
        status: u.status || 'Active',
        joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown',
        rating: u.rating || 'New',
      }));
      setUsers(mappedUsers);
    }
  }, [apiUsersRes]);

  // Verification and Status update actions
  const handleVerify = async (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "Active" as const } : u));
    try {
      await updateUserMut({ id, data: { status: "Active" } }).unwrap();
    } catch (e) { console.error(e); }
  };

  const handleSuspend = async (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "Suspended" as const } : u));
    try {
      await updateUserMut({ id, data: { status: "Suspended" } }).unwrap();
    } catch (e) { console.error(e); }
  };

  const handleActivate = async (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "Active" as const } : u));
    try {
      await updateUserMut({ id, data: { status: "Active" } }).unwrap();
    } catch (e) { console.error(e); }
  };

  // Access check
  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          This panel is restricted to Administrators. Please switch your role using the selector in the navbar to test this view.
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
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
          user.role === "Customer" ? "bg-indigo-50 text-indigo-700" : "bg-teal-50 text-teal-700"
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
      key: "rating",
      header: "Rating",
      render: (user: UserItem) => user.role === "Professional" ? (
        <span className="text-slate-800 font-bold text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">
          ⭐ {user.rating}
        </span>
      ) : (
        <span className="text-slate-300 font-medium">-</span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (user: UserItem) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
          user.status === "Active"
            ? "bg-emerald-50 text-emerald-700"
            : user.status === "Suspended"
            ? "bg-rose-50 text-rose-700"
            : "bg-amber-50 text-amber-700"
        }`}>
          {user.status}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: UserItem) => (
        <div className="flex items-center justify-end gap-2">
          {user.status === "Pending Approval" && (
            <button
              onClick={() => handleVerify(user.id)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
            >
              <ShieldCheck size={14} /> Approve
            </button>
          )}
          {user.status === "Active" && (
            <button
              onClick={() => handleSuspend(user.id)}
              className="bg-rose-50 hover:bg-rose-100 text-brand-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
            >
              <XCircle size={14} /> Suspend
            </button>
          )}
          {user.status === "Suspended" && (
            <button
              onClick={() => handleActivate(user.id)}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
            >
              <Check size={14} /> Activate
            </button>
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
          <button className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10">
            Add Professional
          </button>
        </div>
      </div>

      {/* Premium Paginated Table */}
      <CustomTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search users by name..."
        filterKey="status"
        filterPlaceholder="All Statuses"
        filterOptions={[
          { label: "Active", value: "Active" },
          { label: "Suspended", value: "Suspended" },
          { label: "Pending Approval", value: "Pending Approval" }
        ]}
        pageSize={5}
      />
    </div>
  );
}
