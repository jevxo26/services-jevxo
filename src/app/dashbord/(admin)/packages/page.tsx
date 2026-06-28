"use client";

import { useAppSelector } from "@/redux/hooks";
import {
  ShieldAlert,
  Trash2,
  PlusCircle,
  Edit2,
  X,
  Package as PackageIcon,
  Sparkles,
  DollarSign,
  Wrench,
  Layers,
  Check,
} from "lucide-react";
import type { TableAction } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { CustomTable } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import {
  useGetAllPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  Package,
} from "@/redux/features/vendor/packageApi";
import {
  useGetAllServicesQuery,
  useGetAllNestedServicesQuery,
  Service,
  NestedService,
} from "@/redux/features/admin/service";
import { toast } from "sonner";

export default function AdminPackagesManagementPage() {
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role =
    typeof rawRole === "string"
      ? rawRole.toLowerCase().replace(/\s+/g, "")
      : "client";

  // APIs
  const {
    data: apiPackagesRes,
    isLoading: isPackagesLoading,
    refetch: refetchPackages,
  } = useGetAllPackagesQuery();
  const { data: apiServicesRes } = useGetAllServicesQuery();
  const { data: apiNestedRes } = useGetAllNestedServicesQuery();

  const [createMut, { isLoading: isCreating }] = useCreatePackageMutation();
  const [updateMut, { isLoading: isUpdating }] = useUpdatePackageMutation();
  const [deleteMut] = useDeletePackageMutation();

  const [packages, setPackages] = useState<Package[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Package | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Package | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [featuresStr, setFeaturesStr] = useState("");
  const [serviceId, setServiceId] = useState("NONE");
  const [selectedNestedIds, setSelectedNestedIds] = useState<number[]>([]);

  // All services
  const allServices: Service[] =
    apiServicesRes?.data || (Array.isArray(apiServicesRes) ? apiServicesRes : []);

  // All nested services
  const allNestedServices: NestedService[] =
    apiNestedRes?.data || (Array.isArray(apiNestedRes) ? apiNestedRes : []);

  // Admin sees ALL services
  const serviceOptions = [
    { value: "NONE", label: "Select a Parent Service" },
    ...allServices.map((s) => ({
      value: String(s.id),
      label: s.name,
      desc: s.subtitle || s.slug,
    })),
  ];

  // Filter nested services based on selected parent service
  const availableNestedServices =
    serviceId !== "NONE"
      ? allNestedServices.filter(
          (ns) => ns.service && String(ns.service.id) === serviceId
        )
      : [];

  // Load all packages (no vendor filter for admin)
  useEffect(() => {
    const all: Package[] =
      apiPackagesRes?.data || (Array.isArray(apiPackagesRes) ? apiPackagesRes : []);
    setPackages(all);
  }, [apiPackagesRes]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setFeaturesStr("");
    setServiceId("NONE");
    setSelectedNestedIds([]);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: Package) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || "");
    setPrice(item.price != null ? String(item.price) : "");
    setFeaturesStr(item.features ? item.features.join(", ") : "");
    setServiceId(item.service ? String(item.service.id) : "NONE");
    setSelectedNestedIds(
      item.items?.map((i) => i.nestedService?.id).filter(Boolean) as number[] || []
    );
    setIsModalOpen(true);
  };

  const toggleNestedService = (id: number) => {
    setSelectedNestedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Package name is required");
      return;
    }

    if (!editingItem && serviceId === "NONE") {
      toast.error("Please select a parent service");
      return;
    }

    try {
      if (editingItem) {
        await updateMut({
          id: editingItem.id,
          data: {
            name: name.trim(),
            description: description.trim() || undefined,
            price: price !== "" ? Number(price) : undefined,
            features: featuresStr.split(',').map(f => f.trim()).filter(Boolean),
            nested_service_ids:
              selectedNestedIds.length > 0 ? selectedNestedIds : undefined,
          },
        }).unwrap();
        toast.success("Package updated successfully!");
      } else {
        await createMut({
          service_id: Number(serviceId),
          name: name.trim(),
          description: description.trim() || undefined,
          price: price !== "" ? Number(price) : undefined,
          features: featuresStr.split(',').map(f => f.trim()).filter(Boolean),
          nested_service_ids:
            selectedNestedIds.length > 0 ? selectedNestedIds : undefined,
        }).unwrap();
        toast.success("Package created successfully!");
      }
      setIsModalOpen(false);
      refetchPackages();
    } catch (err: any) {
      toast.error(
        err.data?.message || err.message || "Failed to save package"
      );
    }
  };

  const openDeleteModal = (item: Package) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMut(itemToDelete.id).unwrap();
      toast.success("Package deleted successfully!");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      refetchPackages();
    } catch (err: any) {
      toast.error(
        err.data?.message || err.message || "Failed to delete package"
      );
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
          This panel is restricted to Administrators only.
        </p>
      </div>
    );
  }

  const columns = [
    {
      key: "name",
      header: "Package Details",
      render: (item: Package) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-violet-50 text-violet-500 font-bold rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-violet-100/40">
            <PackageIcon size={20} />
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
      render: (item: Package) => (
        <span className="inline-flex items-center gap-1.5 bg-[#FFF8F4]/70 text-[#E0530A] font-bold text-xs px-2.5 py-1 rounded-xl border border-[#FFF0EB]/50">
          <Wrench size={12} />
          {item.service?.name || "—"}
        </span>
      ),
    },
    {
      key: "items",
      header: "Included Items",
      render: (item: Package) => {
        const count = item.items?.length || 0;
        return (
          <span className="inline-flex items-center gap-1.5 bg-indigo-50/70 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-indigo-100/50">
            <Layers size={12} />
            {count} nested service{count !== 1 ? "s" : ""}
          </span>
        );
      },
    },
    {
      key: "price",
      header: "Price",
      render: (item: Package) => (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-emerald-100/50">
          <DollarSign size={12} />
          {item.price != null ? `৳${item.price.toLocaleString()}` : "Free"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (item: Package) => (
        <span className="text-slate-400 text-xs font-medium">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "—"}
        </span>
      ),
    },
  ];

  const tableActions: TableAction<Package>[] = [
    {
      label: "Edit",
      icon: Edit2,
      onClick: openEditModal,
      variant: "secondary",
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: openDeleteModal,
      variant: "destructive",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <PackageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Package Directory</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage service packages across all vendors.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            <PlusCircle size={18} /> Add Package
          </button>
        </div>
      </div>

      {/* Table */}
      {isPackagesLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-premium">
          <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100/50">
            <PackageIcon size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No Packages Found
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            No packages have been created yet across any vendor.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 bg-[#FFF8F4] hover:bg-[#FFF0EB] text-[#FF6014] font-bold px-4 py-2 rounded-xl text-xs transition-all"
          >
            Create New Package
          </button>
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={packages}
          actions={tableActions}
          searchKey="name"
          searchPlaceholder="Search packages by name..."
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
                <Sparkles className="text-violet-500" size={20} />
                {editingItem ? "Edit Package" : "Create New Package"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {/* Parent Service (create only) */}
              {!editingItem && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Parent Service *
                  </label>
                  <CustomSelect
                    options={serviceOptions}
                    value={serviceId}
                    onChange={(val) => {
                      setServiceId(val);
                      setSelectedNestedIds([]);
                    }}
                  />
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Package Name *
                </label>
                <Input
                  placeholder="e.g. Standard AC Servicing Package"
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
                  placeholder="e.g. 800"
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
                  placeholder="Describe what this package includes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/10 focus-visible:border-violet-400/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all w-full"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Features (Comma Separated)
                </label>
                <Textarea
                  placeholder="e.g. Free Checkup, 24/7 Support, Premium Parts"
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  rows={2}
                  className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/10 focus-visible:border-violet-400/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all w-full"
                />
              </div>

              {/* Nested Service Multi-Select */}
              {(serviceId !== "NONE" || editingItem) && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Include Nested Services ({selectedNestedIds.length} selected)
                  </label>
                  {availableNestedServices.length === 0 && !editingItem ? (
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 text-center">
                      <Layers
                        className="text-slate-300 mx-auto mb-1"
                        size={24}
                      />
                      <p className="text-xs text-slate-400 font-medium">
                        No nested services found for this service.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/50 p-2">
                      {(editingItem && availableNestedServices.length === 0
                        ? editingItem.items?.map((i) => i.nestedService) || []
                        : availableNestedServices
                      ).map((ns) => {
                        if (!ns) return null;
                        const isSelected = selectedNestedIds.includes(ns.id);
                        return (
                          <button
                            key={ns.id}
                            type="button"
                            onClick={() => toggleNestedService(ns.id)}
                            className={`flex items-center gap-3 w-full p-2.5 rounded-xl text-left transition-all text-sm ${
                              isSelected
                                ? "bg-violet-50 border border-violet-200/80 text-violet-700 font-bold"
                                : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 font-medium"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                                isSelected
                                  ? "bg-violet-500 text-white"
                                  : "border-2 border-slate-200 bg-white"
                              }`}
                            >
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                            <span className="truncate">{ns.name}</span>
                            {ns.starting_price != null && (
                              <span className="ml-auto text-xs text-slate-400 font-medium shrink-0">
                                ৳{ns.starting_price.toLocaleString()}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

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
                  {editingItem ? "Update Package" : "Create Package"}
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
              <h2 className="text-xl font-bold text-slate-900">
                Delete Package
              </h2>
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
                  <PackageIcon className="text-slate-400" size={28} />
                </div>
                <div>
                  <span className="font-mono text-slate-400 font-bold text-xs">
                    ID: {itemToDelete.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {itemToDelete.name}
                  </h3>
                  {itemToDelete.service && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Under: {itemToDelete.service.name}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Are you sure you want to delete this package? This action cannot
                be undone.
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
                  className="bg-[#FF6014] hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-red-500/10"
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
