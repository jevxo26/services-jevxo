"use client";

import { ShieldAlert, PlusCircle, Component } from "lucide-react";
import SubServiceModal from "./components/SubServiceModal";
import DeleteSubServiceModal from "./components/DeleteSubServiceModal";
import SubServiceTable from "./components/SubServiceTable";
import { useSubServiceState } from "./hooks/useSubServiceState";

export default function SubServicesManagementPage() {
  const {
    role,
    isSubServicesLoading,
    subServices,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToDelete,
    setItemToDelete,
    name,
    setName,
    price,
    setPrice,
    nestedServiceId,
    setNestedServiceId,
    nestedServiceOptions,
    openCreateModal,
    openEditModal,
    handleSubmit,
    openDeleteModal,
    handleDelete,
    isCreating,
    isUpdating,
    description,
    setDescription,
    image1,
    setImage1,
    image2,
    setImage2,
    faq,
    setFaq,
    isUploadingImage1,
    isUploadingImage2,
    handleImage1Upload,
    handleImage2Upload,
  } = useSubServiceState();

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EEF2FF] text-[#1E4E8C] rounded-2xl">
            <Component className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 font-display">
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
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
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
        <SubServiceTable
          subServices={subServices}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <SubServiceModal
          editingItem={editingItem}
          setIsModalOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
          nestedServiceOptions={nestedServiceOptions}
          nestedServiceId={nestedServiceId}
          setNestedServiceId={setNestedServiceId}
          name={name}
          setName={setName}
          price={price}
          setPrice={setPrice}
          isCreating={isCreating}
          isUpdating={isUpdating}
          description={description}
          setDescription={setDescription}
          image1={image1}
          setImage1={setImage1}
          image2={image2}
          setImage2={setImage2}
          faq={faq}
          setFaq={setFaq}
          isUploadingImage1={isUploadingImage1}
          isUploadingImage2={isUploadingImage2}
          handleImage1Upload={handleImage1Upload}
          handleImage2Upload={handleImage2Upload}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteSubServiceModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        handleDelete={handleDelete}
      />
    </div>
  );
}
