"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, Trash2, PlusCircle, Edit2, X, Wrench, Folder, User, Image as ImageIcon, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomTable } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import {
  useGetAllServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  Service
} from "@/redux/features/admin/service";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { useGetAllUsersQuery } from "@/redux/features/admin/user";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";

export default function ServicesManagementPage() {
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role = typeof rawRole === 'string' ? rawRole.toLowerCase().replace(/\s+/g, '') : "client";
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || currentUser?._id || "";

  // Connect APIs
  const { data: apiServicesRes, isLoading: isServicesLoading, refetch: refetchServices } = useGetAllServicesQuery();
  const { data: apiCategoriesRes } = useGetAllCategoriesQuery();
  const { data: apiUsersRes } = useGetAllUsersQuery(undefined, {
    skip: role !== "superadmin", // Only fetch users for admin
  });

  const [createServiceMut, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateServiceMut, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteServiceMut] = useDeleteServiceMutation();

  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [banner, setBanner] = useState("");
  const [categoryId, setCategoryId] = useState("NONE");
  const [vendorId, setVendorId] = useState("NONE");
  const [employeeIdsStr, setEmployeeIdsStr] = useState("");

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Auto-generate slug from name
  useEffect(() => {
    if (!editingService) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  }, [name, editingService]);

  // Extract lists from API responses
  const categories = apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);
  const allUsers = apiUsersRes?.data || (Array.isArray(apiUsersRes) ? apiUsersRes : []);

  // Filter vendors for admin selection
  const vendors = allUsers.filter((u: any) => {
    const userRole = u.role?.name || (typeof u.role === 'string' ? u.role : '');
    return userRole.toLowerCase() === 'vendor';
  });

  // Filter services based on role
  useEffect(() => {
    const allServices = apiServicesRes?.data || (Array.isArray(apiServicesRes) ? apiServicesRes : []);
    if (role === "vendor") {
      // Vendors only see their own services
      const filtered = allServices.filter(
        (s: Service) => String(s.vendor_id) === String(currentUserId)
      );
      setServices(filtered);
    } else {
      // Admins see all services
      setServices(allServices);
    }
  }, [apiServicesRes, role, currentUserId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image") setIsUploadingImage(true);
    else setIsUploadingBanner(true);

    try {
      const url = await uploadImage(file);
      if (type === "image") {
        setImage(url);
        toast.success("Service image uploaded successfully!");
      } else {
        setBanner(url);
        toast.success("Service banner uploaded successfully!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      if (type === "image") setIsUploadingImage(false);
      else setIsUploadingBanner(false);
    }
  };

  const openCreateModal = () => {
    setEditingService(null);
    setName("");
    setSubtitle("");
    setSlug("");
    setDescription("");
    setImage("");
    setBanner("");
    setCategoryId("NONE");
    setEmployeeIdsStr("");

    if (role === "vendor") {
      setVendorId(String(currentUserId));
    } else {
      setVendorId("NONE");
    }
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setSubtitle(service.subtitle || "");
    setSlug(service.slug);
    setDescription(service.description || "");
    setImage(service.image || "");
    setBanner(service.banner || "");
    setCategoryId(service.category_id ? String(service.category_id) : "NONE");
    setVendorId(service.vendor_id ? String(service.vendor_id) : "NONE");
    setEmployeeIdsStr(service.employee_ids ? service.employee_ids.join(", ") : "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Service name is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    const employeeIds = employeeIdsStr
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id) && id > 0);

    const payload = {
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      slug: slug.trim(),
      description: description.trim() || undefined,
      image: image.trim() || undefined,
      banner: banner.trim() || undefined,
      category_id: categoryId === "NONE" ? undefined : Number(categoryId),
      vendor_id: vendorId === "NONE" ? undefined : Number(vendorId),
      employee_ids: employeeIds.length > 0 ? employeeIds : undefined,
    };

    try {
      if (editingService) {
        await updateServiceMut({
          id: editingService.id,
          data: payload,
        }).unwrap();
        toast.success("Service updated successfully!");
      } else {
        await createServiceMut(payload).unwrap();
        toast.success("Service created successfully!");
      }
      setIsModalOpen(false);
      refetchServices();
    } catch (err: any) {
      console.error("Failed to save service:", err);
      toast.error(err.data?.message || err.message || "Failed to save service");
    }
  };

  const openDeleteModal = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      await deleteServiceMut(serviceToDelete.id).unwrap();
      toast.success("Service deleted successfully!");
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
      refetchServices();
    } catch (err: any) {
      console.error("Failed to delete service:", err);
      toast.error(err.data?.message || err.message || "Failed to delete service");
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
          This panel is restricted to Administrators and Registered Vendors. Please switch your role to test this view.
        </p>
      </div>
    );
  }

  // Column definitions for CustomTable
  const columns = [
    {
      key: "name",
      header: "Service Details",
      render: (service: Service) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 font-bold rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-rose-100/40">
            {service.image ? (
              <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
            ) : (
              <Wrench size={20} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{service.name}</p>
            {service.subtitle && (
              <p className="text-xs text-slate-400 font-medium mt-1">{service.subtitle}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug / URL Path",
      render: (service: Service) => (
        <span className="font-mono text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-lg border border-slate-100 font-medium">
          {service.slug}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (service: Service) => {
        const cat = categories.find((c: any) => c.id === service.category_id);
        return (
          <span className="inline-flex items-center gap-1 bg-indigo-50/70 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-indigo-100/50">
            <Folder size={12} /> {cat ? cat.name : "Uncategorized"}
          </span>
        );
      },
    },
    ...(role === "superadmin"
      ? [
        {
          key: "vendor",
          header: "Vendor",
          render: (service: Service) => {
            const vend = allUsers.find((u: any) => String(u.id || u._id) === String(service.vendor_id));
            return (
              <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-slate-100">
                <User size={12} className="text-slate-400" /> {vend ? vend.name : `Vendor ID: ${service.vendor_id ?? "None"}`}
              </span>
            );
          },
        },
      ]
      : []),
    {
      key: "actions",
      header: "Actions",
      render: (service: Service) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEditModal(service)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={() => openDeleteModal(service)}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  const categoryOptions = [
    { value: "NONE", label: "Select a Category" },
    ...categories.map((cat: any) => ({
      value: String(cat.id),
      label: cat.name,
      desc: cat.description,
    })),
  ];

  const vendorOptions = [
    { value: "NONE", label: "Select a Vendor" },
    ...vendors.map((vend: any) => ({
      value: String(vend.id),
      label: vend.name,
      desc: vend.email,
    })),
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {role === "vendor" ? "My Service Catalog" : "Service Directory"}
          </h1>
          <p className="text-slate-500 mt-1">
            {role === "vendor"
              ? "Create, edit, and update the service catalog you offer to clients."
              : "Review and update system-wide services and assign them to providers."}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            <PlusCircle size={18} /> Add Service
          </button>
        </div>
      </div>

      {/* Table */}
      {isServicesLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-premium">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100/50">
            <Wrench size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Services Found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Get started by adding your first service to show up in our catalog.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold px-4 py-2 rounded-xl text-xs transition-all"
          >
            Add New Service
          </button>
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={services}
          searchKey="name"
          searchPlaceholder="Search services by name..."
          pageSize={10}
        />
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                <Sparkles className="text-rose-500" size={20} />
                {editingService ? "Modify Service Profile" : "List New Service"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Service Name *
                  </label>
                  <Input
                    placeholder="e.g. Premium Home Paint"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Service Subtitle
                  </label>
                  <Input
                    placeholder="e.g. Expert painting for bedrooms & living rooms"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Slug / URL Name *
                  </label>
                  <Input
                    placeholder="e.g. premium-home-paint"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <CustomSelect
                    options={categoryOptions}
                    value={categoryId}
                    onChange={(val) => setCategoryId(val)}
                  />
                </div>
              </div>

              {role === "superadmin" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Assigned Vendor *
                  </label>
                  <CustomSelect
                    options={vendorOptions}
                    value={vendorId}
                    onChange={(val) => setVendorId(val)}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Description
                </label>
                <Textarea
                  placeholder="Provide comprehensive details about the service inclusions, materials, and guidelines..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/10 focus-visible:border-rose-400/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Service Image */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Service Thumbnail
                  </label>
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="w-14 h-14 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
                      {image ? (
                        <>
                          <img src={image} alt="Thumbnail Preview" className="w-full h-full object-cover" />
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
                          onChange={(e) => handleImageUpload(e, "image")}
                          disabled={isUploadingImage}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[9px] text-slate-400">Square size recommended.</p>
                    </div>
                  </div>
                </div>

                {/* Service Banner */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Service Banner
                  </label>
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="w-14 h-14 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
                      {banner ? (
                        <>
                          <img src={banner} alt="Banner Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setBanner("")}
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
                        {isUploadingBanner ? "Uploading..." : "Browse Banner"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "banner")}
                          disabled={isUploadingBanner}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[9px] text-slate-400">Horizontal banner aspect ratio.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Associate Employee IDs (Comma Separated)
                </label>
                <Input
                  placeholder="e.g. 1, 2, 5"
                  value={employeeIdsStr}
                  onChange={(e) => setEmployeeIdsStr(e.target.value)}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Enter numeric employee IDs associated with this service, separated by commas.
                </p>
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
                  disabled={isCreating || isUpdating || isUploadingImage || isUploadingBanner}
                  className="bg-brand-primary hover:bg-brand-dark disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
                >
                  {editingService ? "Update Service" : "Register Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Delete Service</h2>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setServiceToDelete(null);
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
                  {serviceToDelete.image ? (
                    <img src={serviceToDelete.image} alt={serviceToDelete.name} className="w-full h-full object-cover" />
                  ) : (
                    <Wrench className="text-slate-400" size={28} />
                  )}
                </div>

                <div>
                  <span className="font-mono text-slate-400 font-bold text-xs">ID: {serviceToDelete.id}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{serviceToDelete.name}</h3>
                </div>
              </div>

              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Are you sure you want to permanently delete this service? This action is irreversible and will remove it from search results and catalogs.
              </p>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setServiceToDelete(null);
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
