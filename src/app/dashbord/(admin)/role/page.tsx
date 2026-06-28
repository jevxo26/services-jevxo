"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, Trash2, PlusCircle, XCircle, KeyRound } from "lucide-react";
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const AVAILABLE_PERMISSIONS = [
    "VIEW_DASHBOARD",
    "MANAGE_USERS",
    "MANAGE_ROLES",
    "MANAGE_SERVICES",
    "MANAGE_BOOKINGS",
    "VIEW_AUDIT_LOGS"
  ];


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

  const handleCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const newRole = {
        name: formData.get("name"),
        permissions: selectedPermissions
      };
      await createRoleMut(newRole).unwrap();
      toast.success("Role created successfully!");
      setIsAddModalOpen(false);
      setSelectedPermissions([]);

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
        <div className="p-4 bg-[#FFF8F4] rounded-2xl text-[#FF6014] mb-4">
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
            className="bg-[#FFF8F4] hover:bg-[#FFF0EB] text-[#E0530A] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Role Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage admin roles and permissions for the platform.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            <PlusCircle size={18} /> Add Role
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

      {/* Add Role Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Add New Role</h2>
              <button onClick={() => { setIsAddModalOpen(false); setSelectedPermissions([]); }} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-all">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Role Name</label>
                <select name="name" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF6014]/40 focus:ring-2 focus:ring-rose-100 transition-all">
                  <option value="" disabled selected>Select Role Name</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Agent">Agent</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Employee">Employee</option>
                  <option value="Client">Client</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Permissions</label>
                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
                  {AVAILABLE_PERMISSIONS.map(permission => (
                    <label key={permission} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/30 transition-all cursor-pointer"
                        checked={selectedPermissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPermissions([...selectedPermissions, permission]);
                          } else {
                            setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
                          }
                        }}
                      />
                      <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                        {permission.replace(/_/g, " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setSelectedPermissions([]); }} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-all">
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
