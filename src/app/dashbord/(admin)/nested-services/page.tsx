"use client";

import { useAppSelector } from "@/redux/hooks";
import {
  ShieldAlert,
  Trash2,
  PlusCircle,
  Edit2,
  X,
  Layers,
  Image as ImageIcon,
  Sparkles,
  DollarSign,
  Wrench,
} from "lucide-react";
import { useState, useEffect } from "react";
import { CustomTable } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import {
  useGetAllNestedServicesQuery,
  useCreateNestedServiceMutation,
  useUpdateNestedServiceMutation,
  useDeleteNestedServiceMutation,
  NestedService,
} from "@/redux/features/admin/service";
import { useGetAllServicesQuery, Service } from "@/redux/features/admin/service";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";

export default function NestedServicesManagementPage() {
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
    refetch: refetchNested,
  } = useGetAllNestedServicesQuery();
  const { data: apiServicesRes } = useGetAllServicesQuery();

  const [createMut, { isLoading: isCreating }] = useCreateNestedServiceMutation();
  const [updateMut, { isLoading: isUpdating }] = useUpdateNestedServiceMutation();
  const [deleteMut] = useDeleteNestedServiceMutation();

  const [nestedServices, setNestedServices] = useState<NestedService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NestedService | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<NestedService | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [serviceId, setServiceId] = useState("NONE");

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // All services for the dropdown
  const allServices: Service[] =
    apiServicesRes?.data || (Array.isArray(apiServicesRes) ? apiServicesRes : []);

  // Filter services for vendor — only their own
  const serviceOptions = (() => {
    const base =
      role === "vendor"
        ? allServices.filter(
          (s) => String(s.vendor_id) === String(currentUserId)
        )
        : allServices;
    return [
      { value: "NONE", label: "Select a Parent Service" },
      ...base.map((s) => ({
        value: String(s.id),
        label: s.name,
        desc: s.subtitle || s.slug,
      })),
    ];
  })();

  // Filter nested services for vendor
  useEffect(() => {
    const all: NestedService[] =
      apiNestedRes?.data || (Array.isArray(apiNestedRes) ? apiNestedRes : []);

    if (role === "vendor") {
      const vendorServiceIds = allServices
        .filter((s) => String(s.vendor_id) === String(currentUserId))
        .map((s) => s.id);
      setNestedServices(
        all.filter((ns) => ns.service && vendorServiceIds.includes(ns.service.id))
      );
    } else {
      setNestedServices(all);
    }
  }, [apiNestedRes, allServices, role, currentUserId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setImage(url);
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setImage("");
    setPrice("");
    setServiceId("NONE");
  };

  const openCreateModal = () => {
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: NestedService) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || "");
    setImage(item.image || "");
    setPrice(item.price != null ? String(item.price) : "");
    setServiceId(item.service ? String(item.service.id) : "NONE");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nested service name is required");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      image: image.trim() || undefined,
      price: price !== "" ? Number(price) : undefined,
      ...(editingItem ? {} : { service_id: serviceId === "NONE" ? 0 : Number(serviceId) }),
    };

    if (!editingItem && serviceId === "NONE") {
      toast.error("Please select a parent service");
      return;
    }

    try {
      if (editingItem) {
        await updateMut({
          id: editingItem.id,
          data: {
            name: payload.name,
            description: payload.description,
            image: payload.image,
            price: payload.price,
          },
        }).unwrap();
        toast.success("Nested service updated successfully!");
      } else {
        await createMut({
          service_id: Number(serviceId),
          name: payload.name,
          description: payload.description,
          image: payload.image,
          price: payload.price,
        }).unwrap();
        toast.success("Nested service created successfully!");
      }
      setIsModalOpen(false);
      refetchNested();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to save nested service");
    }
  };

  const openDeleteModal = (item: NestedService) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMut(itemToDelete.id).unwrap();
      toast.success("Nested service deleted successfully!");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      refetchNested();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to delete nested service");
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
      render: (item: NestedService) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 font-bold rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-indigo-100/40">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Layers size={20} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{item.name}</p>
            {item.description && (
              <p className="text-xs text-slate-400 font-medium mt-1 max-w-[200px] truncate">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "service",
      header: "Parent Service",
      render: (item: NestedService) => (
        <span className="inline-flex items-center gap-1.5 bg-rose-50/70 text-rose-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-rose-100/50">
          <Wrench size={12} />
          {item.service?.name || "—"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (item: NestedService) => (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-emerald-100/50">
          <DollarSign size={12} />
          {item.price != null ? `৳${item.price.toLocaleString()}` : "Free"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (item: NestedService) => (
        <span className="text-slate-400 text-xs font-medium">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: NestedService) => (
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {role === "vendor" ? "My Sub-Services" : "Nested Service Directory"}
          </h1>
          <p className="text-slate-500 mt-1">
            {role === "vendor"
              ? "Add and manage sub-services under your main service offerings."
              : "Manage sub-services linked to parent services across all vendors."}
          </p>
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
      {isNestedLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-premium">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : nestedServices.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100/50">
            <Layers size={28} />
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
          data={nestedServices}
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
              {/* Parent Service (create only) */}
              {!editingItem && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Parent Service *
                  </label>
                  <CustomSelect
                    options={serviceOptions}
                    value={serviceId}
                    onChange={(val) => setServiceId(val)}
                  />
                </div>
              )}

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

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Price (৳)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={0}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Description
                </label>
                <Textarea
                  placeholder="Describe what this sub-service includes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/10 focus-visible:border-indigo-400/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all w-full"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Sub-Service Image
                </label>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-14 h-14 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
                    {image ? (
                      <>
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImage("")}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-2xl"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    ) : (
                      <ImageIcon className="text-slate-400" size={20} />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="cursor-pointer bg-brand-primary hover:bg-brand-dark text-white text-[10px] font-bold px-3 py-2 rounded-lg inline-flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10">
                      {isUploadingImage ? "Uploading..." : "Browse Photo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[9px] text-slate-400">Square size recommended.</p>
                  </div>
                </div>
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
                  disabled={isCreating || isUpdating || isUploadingImage}
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
                  {itemToDelete.image ? (
                    <img src={itemToDelete.image} alt={itemToDelete.name} className="w-full h-full object-cover" />
                  ) : (
                    <Layers className="text-slate-400" size={28} />
                  )}
                </div>
                <div>
                  <span className="font-mono text-slate-400 font-bold text-xs">ID: {itemToDelete.id}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{itemToDelete.name}</h3>
                  {itemToDelete.service && (
                    <p className="text-xs text-slate-400 mt-0.5">Under: {itemToDelete.service.name}</p>
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
