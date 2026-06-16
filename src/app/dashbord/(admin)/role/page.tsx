"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, Trash2, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomTable } from "@/components/ui/table";
import { useGetAllRolesQuery, useCreateRoleMutation, useDeleteRoleMutation } from "@/redux/features/admin/role";
import { toast } from "sonner";

interface RoleItem {
  id: string;
  name: string;
  permissions: string[];
  createdAt: string;
}

export default function RoleManagementPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  const [roles, setRoles] = useState<RoleItem[]>([]);

  // Connect APIs
  const { data: apiRolesRes, isLoading: isRolesLoading } = useGetAllRolesQuery();
  const [createRoleMut] = useCreateRoleMutation();
  const [deleteRoleMut] = useDeleteRoleMutation();

  useEffect(() => {
    const apiRoles = apiRolesRes?.data || (Array.isArray(apiRolesRes) ? apiRolesRes : []);
    if (apiRoles && apiRoles.length > 0) {
      const mappedRoles = apiRoles.map((r: any) => ({
        id: r.id || r._id || `ROL-${Math.floor(Math.random() * 1000)}`,
        name: r.name || 'Unknown Role',
        permissions: r.permissions || [],
        createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Unknown',
      }));
      setRoles(mappedRoles);
    } else {
      setRoles([]);
    }
  }, [apiRolesRes]);

  const handleCreateRole = async () => {
    try {
      const newRole = {
        name: "Super Admin",
        permissions: [
          "MANAGE_USERS",
          "MANAGE_ROLES",
          "VIEW_AUDIT_LOGS"
        ]
      };
      await createRoleMut(newRole).unwrap();
      toast.success("Role created successfully!");
    } catch (e: any) {
      console.error("Failed to create role:", e);
      toast.error(e.data?.message || e.message || "Failed to create role");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRoleMut(id).unwrap();
      toast.success("Role deleted successfully!");
    } catch (e: any) {
      console.error("Failed to delete role:", e);
      toast.error(e.data?.message || e.message || "Failed to delete role");
    }
  };

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

  const columns = [
    {
      key: "name",
      header: "Role Name",
      render: (r: RoleItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-700 font-bold rounded-xl flex items-center justify-center">
            {r.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{r.name}</p>
          </div>
        </div>
      )
    },
    {
      key: "id",
      header: "ID",
      render: (r: RoleItem) => (
        <span className="font-mono text-slate-500 font-bold text-xs">{r.id}</span>
      )
    },
    {
      key: "permissions",
      header: "Permissions",
      render: (r: RoleItem) => (
        <div className="flex flex-wrap gap-1 max-w-[250px]">
          {r.permissions.length > 0 ? r.permissions.map((p, i) => (
            <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
              {p.replace(/_/g, " ")}
            </span>
          )) : (
            <span className="text-slate-400 text-xs">No permissions</span>
          )}
        </div>
      )
    },
    {
      key: "createdAt",
      header: "Created Date",
      render: (r: RoleItem) => (
        <span className="text-slate-500 font-medium text-xs">{r.createdAt}</span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (r: RoleItem) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleDelete(r.id)}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Role Management</h1>
          <p className="text-slate-500 mt-1">Manage admin roles and permissions for the platform.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCreateRole}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            <PlusCircle size={18} /> Create Sample Role
          </button>
        </div>
      </div>

      {/* Premium Paginated Table */}
      <CustomTable
        columns={columns}
        data={roles}
        searchKey="name"
        searchPlaceholder="Search roles by name..."
        pageSize={5}
      />
    </div>
  );
}
