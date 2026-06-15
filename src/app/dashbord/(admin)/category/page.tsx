"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, Trash2, PlusCircle, Edit2, X, Folder, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomTable } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  Category
} from "@/redux/features/admin/category";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";

export default function CategoryManagementPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  const { data: apiCategoriesRes, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();
  const [createCategoryMut, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategoryMut, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategoryMut] = useDeleteCategoryMutation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [icon, setIcon] = useState("");
  const [parentId, setParentId] = useState<string>("NONE");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setIcon(url);
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  useEffect(() => {
    const apiCategories = apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);
    setCategories(apiCategories);
  }, [apiCategoriesRes]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setOrder(0);
    setIcon("");
    setParentId("NONE");
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setOrder(category.order || 0);
    setIcon(category.icon || "");
    setParentId(category.parent ? String(category.parent.id) : "NONE");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      order: Number(order) || 0,
      icon: icon.trim() || undefined,
      parentId: parentId === "NONE" ? undefined : Number(parentId),
    };

    try {
      if (editingCategory) {
        if (parentId !== "NONE" && Number(parentId) === editingCategory.id) {
          toast.error("A category cannot be its own parent");
          return;
        }

        await updateCategoryMut({
          id: editingCategory.id,
          data: {
            ...payload,
            parentId: parentId === "NONE" ? null : Number(parentId),
          },
        }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await createCategoryMut(payload).unwrap();
        toast.success("Category created successfully!");
      }
      setIsModalOpen(false);
    } catch (e: any) {
      console.error("Failed to save category:", e);
      toast.error(e.data?.message || e.message || "Failed to save category");
    }
  };

  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategoryMut(categoryToDelete.id).unwrap();
      toast.success("Category deleted successfully!");
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (e: any) {
      console.error("Failed to delete category:", e);
      toast.error(e.data?.message || e.message || "Failed to delete category");
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
      header: "Category Name",
      render: (cat: Category) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-50 text-rose-500 font-bold rounded-xl flex items-center justify-center overflow-hidden shrink-0">
            {cat.icon ? (
              cat.icon.startsWith("http") || cat.icon.startsWith("/") ? (
                <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-base">{cat.icon}</span>
              )
            ) : (
              <Folder size={18} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{cat.name}</p>
            {cat.parent && (
              <span className="inline-block bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold mt-1">
                Parent: {cat.parent.name}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (cat: Category) => (
        <span className="text-slate-500 text-xs font-medium max-w-[200px] block truncate">
          {cat.description || "—"}
        </span>
      ),
    },
    {
      key: "order",
      header: "Display Order",
      render: (cat: Category) => (
        <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2 py-0.5 rounded-lg">
          {cat.order ?? 0}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      render: (cat: Category) => (
        <span className="text-slate-500 font-medium text-xs">
          {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (cat: Category) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEditModal(cat)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={() => openDeleteModal(cat)}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.97]"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  const parentOptions = [
    { value: "NONE", label: "None (Root Category)" },
    ...categories
      .filter((cat) => !editingCategory || cat.id !== editingCategory.id)
      .map((cat) => ({
        value: String(cat.id),
        label: cat.name,
        desc: cat.description,
      })),
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Category Management</h1>
          <p className="text-slate-500 mt-1">Manage system-wide service categories and nesting structure.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            <PlusCircle size={18} /> Add Category
          </button>
        </div>
      </div>

      {/* Table */}
      {isCategoriesLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-premium">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={categories}
          searchKey="name"
          searchPlaceholder="Search categories by name..."
          pageSize={10}
        />
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <Input
                  placeholder="e.g. Home Cleaning"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Description
                </label>
                <Textarea
                  placeholder="Provide a brief description of the category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/10 focus-visible:border-rose-400/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Display Order
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Category Image / Icon
                </label>
                <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {/* Image Preview Box */}
                  <div className="w-16 h-16 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
                    {icon ? (
                      <>
                        <img src={icon} alt="Category Icon" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setIcon("")}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-2xl"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <Folder className="text-slate-400" size={24} />
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <label className="cursor-pointer bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10">
                        {isUploadingImage ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <PlusCircle size={14} /> Upload Image
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={isUploadingImage}
                          className="hidden"
                        />
                      </label>
                      {icon && (
                        <button
                          type="button"
                          onClick={() => setIcon("")}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all active:scale-[0.98]"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Supports JPG, PNG, GIF. Max file size 5MB.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <CustomSelect
                  label="Parent Category"
                  options={parentOptions}
                  value={parentId}
                  onChange={(val) => setParentId(val)}
                  placeholder="Select a parent category"
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
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Delete Category</h2>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCategoryToDelete(null);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-center">
              <div className="flex flex-col items-center gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                {/* Category Image */}
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                  {categoryToDelete.icon ? (
                    categoryToDelete.icon.startsWith("http") || categoryToDelete.icon.startsWith("/") ? (
                      <img src={categoryToDelete.icon} alt={categoryToDelete.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{categoryToDelete.icon}</span>
                    )
                  ) : (
                    <Folder className="text-slate-400" size={28} />
                  )}
                </div>

                <div>
                  <span className="font-mono text-slate-400 font-bold text-xs">ID: {categoryToDelete.id}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{categoryToDelete.name}</h3>
                </div>
              </div>

              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Are you sure you want to delete this category? This action cannot be undone and will remove the category from the system.
              </p>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setCategoryToDelete(null);
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
