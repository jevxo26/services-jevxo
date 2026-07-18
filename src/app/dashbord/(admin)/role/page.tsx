"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, Trash2, PlusCircle, KeyRound } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomTable } from "@/components/ui/table";
import { useGetAllRolesQuery, useCreateRoleMutation, useDeleteRoleMutation } from "@/redux/features/admin/role";
import { toast } from "sonner";
import RoleModal from "./components/RoleModal";
import { useConfirm } from "@/context/ConfirmDialogContext";

interface RoleItem {
  id: string;
  name: string;
  permissions: string[];
  createdAt: string;
}

export default function RoleManagementPage() {
  const confirm = useConfirm();
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const lang = useAppSelector((state) => state.lang.value);

  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const AVAILABLE_PERMISSIONS = [
    "VIEW_DASHBOARD",
    "MANAGE_USERS",
    "MANAGE_ROLES",
    "MANAGE_SERVICES",
    "MANAGE_BOOKINGS",
    "VIEW_AUDIT_LOGS",
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
        name: r.name || "Unknown Role",
        permissions: r.permissions || [],
        createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Unknown",
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
        permissions: selectedPermissions,
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
    const isConfirmed = await confirm({
      title: "Delete Role?",
      message: lang === "bn" ? "এই রোলটি মুছে ফেলবেন? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।" : "Are you sure you want to delete this role? This action cannot be undone.",
      confirmText: lang === "bn" ? "মুছুন" : "Delete",
      cancelText: lang === "bn" ? "বাতিল" : "Cancel",
    });
    if (!isConfirmed) return;
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
        <div className="p-4 bg-[#EEF2FF] rounded-2xl text-[#1E4E8C] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{lang === "bn" ? "অ্যাক্সেস অস্বীকৃত" : "Access Denied"}</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          {lang === "bn" ? "এই প্যানেলটি শুধুমাত্র অ্যাডমিনদের জন্য সীমাবদ্ধ।" : "This panel is restricted to Administrators. Please switch your role using the selector in the navbar to test this view."}
        </p>
      </div>
    );
  }

  const columns = [
    {
      key: "name",
      header: lang === "bn" ? "রোলের নাম" : "Role Name",
      render: (r: RoleItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-700 font-bold rounded-xl flex items-center justify-center">
            {r.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{r.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "id",
      header: "ID",
      render: (r: RoleItem) => <span className="font-mono text-slate-500 font-bold text-xs">{r.id}</span>,
    },
    {
      key: "permissions",
      header: lang === "bn" ? "অনুমতিসমূহ" : "Permissions",
      render: (r: RoleItem) => (
        <div className="flex flex-wrap gap-1 max-w-[250px]">
          {r.permissions.length > 0 ? (
            r.permissions.map((p, i) => (
              <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                {p.replace(/_/g, " ")}
              </span>
            ))
          ) : (
            <span className="text-slate-400 text-xs">{lang === "bn" ? "কোনো অনুমতি নেই" : "No permissions"}</span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: lang === "bn" ? "তৈরির তারিখ" : "Created Date",
      render: (r: RoleItem) => <span className="text-slate-500 font-medium text-xs">{r.createdAt}</span>,
    },
    {
      key: "actions",
      header: lang === "bn" ? "অ্যাকশন" : "Actions",
      render: (r: RoleItem) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleDelete(r.id)}
            className="bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#123C73] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Trash2 size={14} /> {lang === "bn" ? "মুছুন" : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EEF2FF] text-[#1E4E8C] rounded-2xl">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{lang === "bn" ? "রোল ম্যানেজমেন্ট" : "Role Management"}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "bn" ? "প্ল্যাটফর্মের অ্যাডমিন রোল এবং অনুমতি ম্যানেজ করুন।" : "Manage admin roles and permissions for the platform."}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            <PlusCircle size={18} /> {lang === "bn" ? "রোল যোগ করুন" : "Add Role"}
          </button>
        </div>
      </div>

      {/* Premium Paginated Table */}
      <CustomTable columns={columns} data={roles} searchKey="name" searchPlaceholder={lang === "bn" ? "রোলের নাম দিয়ে খুঁজুন..." : "Search roles by name..."} pageSize={5} />

      {/* Add Role Modal */}
      {isAddModalOpen && (
        <RoleModal
          setIsAddModalOpen={setIsAddModalOpen}
          selectedPermissions={selectedPermissions}
          setSelectedPermissions={setSelectedPermissions}
          handleCreateRole={handleCreateRole}
          AVAILABLE_PERMISSIONS={AVAILABLE_PERMISSIONS}
        />
      )}
    </div>
  );
}
