"use client";

import { ShieldAlert, PlusCircle, Grid } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import CategoryModal from "./components/CategoryModal";
import DeleteCategoryModal from "./components/DeleteCategoryModal";
import CategoryTable from "./components/CategoryTable";
import { useCategoryState } from "./hooks/useCategoryState";

export default function CategoryManagementPage() {
  const {
    role,
    isCategoriesLoading,
    categories,
    isModalOpen,
    setIsModalOpen,
    editingCategory,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    categoryToDelete,
    setCategoryToDelete,
    name,
    setName,
    description,
    setDescription,
    order,
    setOrder,
    icon,
    setIcon,
    parentId,
    setParentId,
    isUploadingImage,
    handleImageChange,
    openCreateModal,
    openEditModal,
    handleSubmit,
    openDeleteModal,
    handleDelete,
    parentOptions,
    isCreating,
    isUpdating,
  } = useCategoryState();

  const lang = useAppSelector((state) => state.lang.value);

  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#EEF2FF] rounded-2xl text-[#4F46E5] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{lang === "bn" ? "অ্যাক্সেস অস্বীকৃত" : "Access Denied"}</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">{lang === "bn" ? "এই প্যানেলটি শুধুমাত্র অ্যাডমিনদের জন্য।" : "This panel is restricted to Administrators. Please switch your role using the selector in the navbar to test this view."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EEF2FF] text-[#4F46E5] rounded-2xl">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{lang === "bn" ? "ক্যাটাগরি ম্যানেজমেন্ট" : "Category Management"}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "bn" ? "সার্ভিস ক্যাটাগরি দেখুন এবং ম্যানেজ করুন।" : "Manage system-wide service categories and nesting structure."}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            <PlusCircle size={18} /> {lang === "bn" ? "ক্যাটাগরি যোগ করুন" : "Add Category"}
          </button>
        </div>
      </div>

      {/* Table */}
      {isCategoriesLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-premium">
          <div className="w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      )}

      {isModalOpen && (
        <CategoryModal
          editingCategory={editingCategory}
          setIsModalOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          order={order}
          setOrder={setOrder}
          icon={icon}
          setIcon={setIcon}
          isUploadingImage={isUploadingImage}
          handleImageChange={handleImageChange}
          parentId={parentId}
          setParentId={setParentId}
          parentOptions={parentOptions}
          isCreating={isCreating}
          isUpdating={isUpdating}
        />
      )}

      <DeleteCategoryModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        categoryToDelete={categoryToDelete}
        setCategoryToDelete={setCategoryToDelete}
        handleDelete={handleDelete}
      />
    </div>
  );
}
