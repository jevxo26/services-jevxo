"use client";

import { useAppSelector } from "@/redux/hooks";
import {
  ShieldAlert,
  Trash2,
  PlusCircle,
  Edit2,
  X,
  Component,
  Image as ImageIcon,
  Sparkles,
  DollarSign,
  Wrench,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { CustomTable } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import {
  useGetAllNestedServicesQuery,
  useGetAllSubServicesQuery,
  useCreateSubServiceMutation,
  useUpdateSubServiceMutation,
  useDeleteSubServiceMutation,
  NestedService,
  SubService,
} from "@/redux/features/admin/service";
import { toast } from "sonner";

export default function SubServicesManagementPage() {
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role =
    typeof rawRole === "string"
      ? rawRole.toLowerCase().replace(/\s+/g, "")
      : "client";
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || currentUser?._id || "";

  // APIs
  const {
    data: apiNestedRes,
    isLoading: isNestedLoading,
  } = useGetAllNestedServicesQuery();
  const {
    data: apiSubServicesRes,
    isLoading: isSubServicesLoading,
    refetch: refetchSubServices,
  } = useGetAllSubServicesQuery();

  const [createMut, { isLoading: isCreating }] = useCreateSubServiceMutation();
  const [updateMut, { isLoading: isUpdating }] = useUpdateSubServiceMutation();
  const [deleteMut] = useDeleteSubServiceMutation();

  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubService | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SubService | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [nestedServiceId, setNestedServiceId] = useState("NONE");

  // All nested services for the dropdown
  const allNestedServices: NestedService[] = useMemo(() => {
    return apiNestedRes?.data || (Array.isArray(apiNestedRes) ? apiNestedRes : []);
  }, [apiNestedRes]);

  // Filter nested services for vendor — only their own
  const nestedServiceOptions = (() => {
    const base =
      role === "vendor"
        ? allNestedServices.filter(
          (ns) => String(ns.service?.vendor?.id || ns.service?.vendor_id) === String(currentUserId)
        )
        : allNestedServices;
    return [
      { value: "NONE", label: "Select a Parent Nested Service" },
      ...base.map((ns) => ({
        value: String(ns.id),
        label: ns.name,
      })),
    ];
  })();

  // Filter sub services for vendor
  useEffect(() => {
    const all: SubService[] =
      apiSubServicesRes?.data || (Array.isArray(apiSubServicesRes) ? apiSubServicesRes : []);

    if (role === "vendor") {
      const vendorNestedIds = allNestedServices
        .filter((ns) => String(ns.service?.vendor?.id || ns.service?.vendor_id) === String(currentUserId))
        .map((ns) => ns.id);
      setSubServices(
        all.filter((ss) => ss.nestedService && vendorNestedIds.includes(ss.nestedService.id))
      );
    } else {
      setSubServices(all);
    }
  }, [apiSubServicesRes, allNestedServices, role, currentUserId]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setNestedServiceId("NONE");
  };

  const openCreateModal = () => {
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: SubService) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price != null ? String(item.price) : "");
    setNestedServiceId(item.nestedService ? String(item.nestedService.id) : "NONE");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Sub-service name is required");
      return;
    }
    if (price === "") {
      toast.error("Price is required");
      return;
    }

    const payload = {
      name: name.trim(),
      price: Number(price),
      ...(editingItem ? {} : { nested_service_id: nestedServiceId === "NONE" ? 0 : Number(nestedServiceId) }),
    };

    if (!editingItem && nestedServiceId === "NONE") {
      toast.error("Please select a parent nested service");
      return;
    }

    try {
      if (editingItem) {
        await updateMut({
          id: editingItem.id,
          data: {
            name: payload.name,
            price: payload.price,
            nested_service_id: nestedServiceId !== "NONE" ? Number(nestedServiceId) : undefined,
          },
        }).unwrap();
        toast.success("Sub-service updated successfully!");
      } else {
        await createMut({
          nested_service_id: Number(nestedServiceId),
          name: payload.name,
          price: payload.price,
        }).unwrap();
        toast.success("Sub-service created successfully!");
      }
      setIsModalOpen(false);
      refetchSubServices();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to save sub-service");
    }
  };

  const openDeleteModal = (item: SubService) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMut(itemToDelete.id).unwrap();
      toast.success("Sub-service deleted successfully!");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      refetchSubServices();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to delete sub-service");
    }
  };

  if (role !== "superadmin" && role !== "vendor") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          This panel is restricted to Administrators and Registered Vendors.
        </p>
      </div>
    );
  }

  const columns = [
    {
      key: "name",
      header: "Sub-Service Details",
      render: (item: SubService) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 font-bold rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-indigo-100/40">
            <Component size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{item.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "nestedService",
      header: "Parent Nested Service",
      render: (item: SubService) => (
        <span className="inline-flex items-center gap-1.5 bg-rose-50/70 text-rose-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-rose-100/50">
          <Wrench size={12} />
          {item.nestedService?.name || "—"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (item: SubService) => (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-emerald-100/50">
          <DollarSign size={12} />
          {item.price != null ? `৳${item.price.toLocaleString()}` : "Variable"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (item: SubService) => (
        <span className="text-slate-400 text-xs font-medium">
          {/* Note: createdAt might not be returned in API depending on DTO, safely ignoring if not present */}
          {item.id ? "—" : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: SubService) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEditModal(item)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={() => openDeleteModal(item)}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Trash2 size={14} /> Delete
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
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Component className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {role === "vendor" ? "My Sub-Services" : "Sub-Service Directory"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {role === "vendor"
                ? "Add and manage sub-services under your nested services."
                : "Manage sub-services linked to nested services across all vendors."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            <PlusCircle size={18} /> Add Sub-Service
          </button>
        </div>
      </div>

      {/* Table */}
      {isSubServicesLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-premium">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : subServices.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100/50">
            <Component size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Sub-Services Found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Start by adding a sub-service under one of your existing services.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold px-4 py-2 rounded-xl text-xs transition-all"
          >
            Add New Sub-Service
          </button>
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={subServices}
          searchKey="name"
          searchPlaceholder="Search sub-services by name..."
          pageSize={10}
        />
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                <Sparkles className="text-indigo-500" size={20} />
                {editingItem ? "Edit Sub-Service" : "Add New Sub-Service"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Parent Nested Service (create/edit) */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Parent Nested Service *
                </label>
                <CustomSelect
                  options={nestedServiceOptions}
                  value={nestedServiceId}
                  onChange={(val) => setNestedServiceId(val)}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Sub-Service Name *
                </label>
                <Input
                  placeholder="e.g. Filter Replacement"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Starting Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Price (৳) *
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={0}
                  required
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-brand-primary hover:bg-brand-dark disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
                >
                  {editingItem ? "Update Sub-Service" : "Create Sub-Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Delete Sub-Service</h2>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-center">
              <div className="flex flex-col items-center gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                  <Component className="text-slate-400" size={28} />
                </div>
                <div>
                  <span className="font-mono text-slate-400 font-bold text-xs">ID: {itemToDelete.id}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{itemToDelete.name}</h3>
                  {itemToDelete.nestedService && (
                    <p className="text-xs text-slate-400 mt-0.5">Under: {itemToDelete.nestedService.name}</p>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Are you sure you want to delete this sub-service? This action cannot be undone.
              </p>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-[#FF464C] hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
