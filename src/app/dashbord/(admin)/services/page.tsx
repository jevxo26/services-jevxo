"use client";

import { useAppSelector } from "@/redux/hooks";
import {
  ShieldAlert,
  Trash2,
  PlusCircle,
  Edit2,
  X,
  Wrench,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Tag,
  Globe,
  Eye,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomTable } from "@/components/ui/table";
import type { TableAction } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import {
  useGetAllServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  Service,
} from "@/redux/features/admin/service";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { useGetAllUsersQuery } from "@/redux/features/admin/user";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";

export default function AdminServicesManagementPage() {
  const router = useRouter();
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role =
    typeof rawRole === "string"
      ? rawRole.toLowerCase().replace(/\s+/g, "")
      : "client";

  // APIs
  const {
    data: apiServicesRes,
    isLoading: isServicesLoading,
    refetch: refetchServices,
  } = useGetAllServicesQuery();
  const { data: apiCategoriesRes } = useGetAllCategoriesQuery();
  const { data: apiUsersRes } = useGetAllUsersQuery();

  const [createMut, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateMut, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteMut] = useDeleteServiceMutation();

  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Service | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("NONE");
  const [vendorId, setVendorId] = useState("NONE");
  const [employeeIds, setEmployeeIds] = useState<number[]>([]);

  const allCategories =
    apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);

  const categoryOptions = [
    { value: "NONE", label: "Select a Category" },
    ...allCategories.map((c: any) => ({
      value: String(c.id),
      label: c.name,
    })),
  ];

  const allUsers = apiUsersRes?.data || (Array.isArray(apiUsersRes) ? apiUsersRes : []);
  
  const vendorOptions = [
    { value: "NONE", label: "Select a Vendor" },
    ...allUsers.filter((u: any) => u.role?.name === "Vendor" || u.role === "Vendor").map((u: any) => ({
      value: String(u.id || u._id),
      label: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown',
    })),
  ];

  const employeeOptions = (categoryId === "NONE" || vendorId === "NONE") ? [] : allUsers
    .filter((u: any) => u.role?.name === "Employee" || u.role === "Employee")
    .filter((u: any) => String(u.profile?.category?.id) === categoryId)
    .filter((u: any) => String(u.vendor?.id || u.vendor) === vendorId)
    .map((u: any) => ({
      id: Number(u.id || u._id),
      name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown',
    }));

  useEffect(() => {
    const all: Service[] =
      apiServicesRes?.data || (Array.isArray(apiServicesRes) ? apiServicesRes : []);
    setServices(all);
  }, [apiServicesRes]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setImage(url);
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const resetForm = () => {
    setName(""); setSubtitle(""); setSlug(""); setDescription(""); setImage(""); setCategoryId("NONE"); setVendorId("NONE"); setEmployeeIds([]);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: Service) => {
    setEditingItem(item);
    setName(item.name);
    setSubtitle(item.subtitle || "");
    setSlug(item.slug);
    setDescription(item.description || "");
    setImage(item.image || "");
    setCategoryId(item.category_id ? String(item.category_id) : "NONE");
    setVendorId(item.vendor ? String(item.vendor.id) : "NONE");
    setEmployeeIds(item.employees ? item.employees.map((e: any) => Number(e.id)) : []);
    setIsModalOpen(true);
  };

  const openDeleteModal = (item: Service) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Service name is required"); return; }
    if (!slug.trim()) { toast.error("Slug is required"); return; }
    try {
      if (editingItem) {
        await updateMut({
          id: editingItem.id!,
          data: {
            name: name.trim(),
            subtitle: subtitle.trim() || undefined,
            slug: slug.trim(),
            description: description.trim() || undefined,
            image: image || undefined,
            category_id: categoryId !== "NONE" ? Number(categoryId) : undefined,
            vendor_id: vendorId !== "NONE" ? Number(vendorId) : undefined,
            employee_ids: employeeIds.length > 0 ? employeeIds : undefined,
          },
        }).unwrap();
        toast.success("Service updated successfully!");
      } else {
        await createMut({
          name: name.trim(),
          subtitle: subtitle.trim() || undefined,
          slug: slug.trim(),
          description: description.trim() || undefined,
          image: image || undefined,
          category_id: categoryId !== "NONE" ? Number(categoryId) : undefined,
          vendor_id: vendorId !== "NONE" ? Number(vendorId) : undefined,
          employee_ids: employeeIds.length > 0 ? employeeIds : undefined,
        }).unwrap();
        toast.success("Service created successfully!");
      }
      setIsModalOpen(false);
      refetchServices();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to save service");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMut(itemToDelete.id!).unwrap();
      toast.success("Service deleted successfully!");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      refetchServices();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to delete service");
    }
  };

  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 mb-4"><ShieldAlert size={48} /></div>
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">This panel is restricted to Administrators only.</p>
      </div>
    );
  }

  const columns = [
    {
      key: "name",
      header: "Service Details",
      render: (item: Service) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-rose-100/40">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Wrench size={20} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{item.name}</p>
            {item.subtitle && <p className="text-xs text-slate-400 mt-1">{item.subtitle}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (item: Service) => (
        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 font-mono font-bold text-xs px-2.5 py-1 rounded-xl">
          <Globe size={11} />{item.slug}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item: Service | any) => (
        <span className="inline-flex items-center gap-1.5 bg-indigo-50/70 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-indigo-100/50">
          <Tag size={11} />
          {item.category?.name || (item.category_id ? `Cat #${item.category_id}` : "—")}
        </span>
      ),
    },
    {
      key: "vendor",
      header: "Vendor",
      render: (item: Service | any) => (
        <span className="inline-flex items-center gap-1.5 bg-emerald-50/70 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-emerald-100/50">
          <User size={11} />
          {item.vendor?.name || (item.vendor_id ? `Vendor #${item.vendor_id}` : "—")}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (item: Service) => (
        <span className="text-slate-400 text-xs font-medium">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  const tableActions: TableAction<Service>[] = [
    { label: "View Details", icon: Eye, onClick: (item) => router.push(`/dashbord/services/${item.id || (item as any)._id}`), variant: "default" },
    { label: "Edit", icon: Edit2, onClick: openEditModal, variant: "secondary" },
    { label: "Delete", icon: Trash2, onClick: openDeleteModal, variant: "destructive" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Services</h1>
          <p className="text-slate-500 mt-1">Create and manage all services across the platform.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
        >
          <PlusCircle size={18} /> Add Service
        </button>
      </div>

      {/* Table */}
      {isServicesLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-premium">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100/50">
            <Wrench size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Services Found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">Start by creating your first service.</p>
          <button onClick={openCreateModal} className="mt-4 bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold px-4 py-2 rounded-xl text-xs transition-all">
            Add New Service
          </button>
        </div>
      ) : (
        <CustomTable columns={columns} data={services} actions={tableActions} searchKey="name" searchPlaceholder="Search services..." pageSize={10} />
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-rose-500" size={20} />
                {editingItem ? "Edit Service" : "Create New Service"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Service Name *</label>
                <Input 
                  placeholder="e.g. AC Repairing" 
                  value={name} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setName(val);
                    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                  }} 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Slug *</label>
                <Input placeholder="e.g. ac-repairing" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Subtitle</label>
                <Input placeholder="Short tagline" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                <CustomSelect options={categoryOptions} value={categoryId} onChange={setCategoryId} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Vendor</label>
                <CustomSelect options={vendorOptions} value={vendorId} onChange={setVendorId} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Employees</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                  {employeeOptions.length > 0 ? employeeOptions.map(emp => (
                    <label key={emp.id} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/30"
                        checked={employeeIds.includes(emp.id)}
                        onChange={(e) => {
                          if (e.target.checked) setEmployeeIds([...employeeIds, emp.id]);
                          else setEmployeeIds(employeeIds.filter(id => id !== emp.id));
                        }}
                      />
                      <span className="text-sm text-slate-700">{emp.name}</span>
                    </label>
                  )) : (
                    <span className="text-xs text-slate-400">No employees found.</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <Textarea
                  placeholder="Describe this service..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/10 focus-visible:border-rose-400/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all w-full"
                />
              </div>
              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Image</label>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-14 h-14 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
                    {image ? (
                      <>
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setImage("")} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-2xl">
                          <Trash2 size={14} />
                        </button>
                      </>
                    ) : (
                      <ImageIcon className="text-slate-400" size={20} />
                    )}
                  </div>
                  <label className="cursor-pointer bg-brand-primary hover:bg-brand-dark text-white text-[10px] font-bold px-3 py-2 rounded-lg inline-flex items-center gap-1.5 transition-all active:scale-[0.98]">
                    {isUploadingImage ? "Uploading..." : "Browse Photo"}
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                <button type="submit" disabled={isCreating || isUpdating || isUploadingImage} className="bg-brand-primary hover:bg-brand-dark disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10">
                  {editingItem ? "Update Service" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Delete Service</h2>
              <button onClick={() => { setIsDeleteModalOpen(false); setItemToDelete(null); }} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-6 text-center">
              <div className="flex flex-col items-center gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                  {itemToDelete.image ? <img src={itemToDelete.image} alt={itemToDelete.name} className="w-full h-full object-cover" /> : <Wrench className="text-slate-400" size={28} />}
                </div>
                <div>
                  <span className="font-mono text-slate-400 font-bold text-xs">ID: {itemToDelete.id}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{itemToDelete.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">/{itemToDelete.slug}</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">Are you sure you want to delete this service? All nested services and packages under it may also be affected.</p>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => { setIsDeleteModalOpen(false); setItemToDelete(null); }} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                <button onClick={handleDelete} className="bg-[#FF464C] hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-red-500/10">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
