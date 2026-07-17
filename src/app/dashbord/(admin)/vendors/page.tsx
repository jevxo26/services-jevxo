"use client";

import { ShieldAlert, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import AddVendorModal from "./components/AddVendorModal";
import ViewVendorModal from "./components/ViewVendorModal";
import EditVendorModal from "./components/EditVendorModal";
import VendorTable from "./components/VendorTable";
import { useVendorState } from "./hooks/useVendorState";

export default function VendorsManagementPage() {
  const router = useRouter();
  const {
    role,
    vendors,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedUser,
    setSelectedUser,
    openDropdownId,
    setOpenDropdownId,
    step,
    isUsersLoading,
    isCategoriesLoading,
    allCategories,
    selectedDevision,
    setSelectedDevision,
    selectedDistrict,
    setSelectedDistrict,
    selectedArea,
    setSelectedArea,
    profileType,
    setProfileType,
    selectedCategoryIds,
    setSelectedCategoryIds,
    isEditModalOpen,
    setIsEditModalOpen,
    editingVendor,
    setEditingVendor,
    handleCreateUser,
    handleCreateProfile,
    closeModal,
    handleEditVendor,
    handleActivate,
    handleDeactivate,
    handleBlock,
    handleDelete,
    isAuthenticated,
    isCreatingUser,
    isCreatingProfile,
  } = useVendorState();

  const lang = useAppSelector((state) => state.lang.value);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#EEF2FF] rounded-2xl text-[#4F46E5] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{lang === "bn" ? "অ্যাক্সেস অস্বীকৃত" : "Access Denied"}</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EEF2FF] text-[#4F46E5] rounded-2xl">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{lang === "bn" ? "ভেন্ডর ম্যানেজমেন্ট" : "Vendor Management"}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "bn" ? "সিস্টেমের সব ভেন্ডর দেখুন এবং ম্যানেজ করুন।" : "Manage system vendors and their profiles."}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            {lang === "bn" ? "ভেন্ডর যোগ করুন" : "Add Vendor"}
          </button>
        </div>
      </div>

      {isUsersLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">{lang === "bn" ? "ভেন্ডর লোড হচ্ছে..." : "Loading vendors..."}</p>
        </div>
      ) : vendors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <p className="text-sm text-slate-400 font-medium">{lang === "bn" ? "কোনো ভেন্ডর পাওয়া যায়নি।" : "No vendors found."}</p>
        </div>
      ) : (
        <VendorTable
          vendors={vendors}
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
          onViewDetails={(id) => router.push(`/dashbord/vendors/${id}`)}
          onEditVendor={(vendor) => {
            setEditingVendor(vendor);
            setIsEditModalOpen(true);
          }}
          handleActivate={handleActivate}
          handleDeactivate={handleDeactivate}
          handleBlock={handleBlock}
          handleDelete={handleDelete}
        />
      )}

      {/* Add Vendor Modal (2 Steps) */}
      <AddVendorModal
        isAddModalOpen={isAddModalOpen}
        closeModal={closeModal}
        step={step}
        handleCreateUser={handleCreateUser}
        isCreatingUser={isCreatingUser}
        handleCreateProfile={handleCreateProfile}
        isCreatingProfile={isCreatingProfile}
        profileType={profileType}
        setProfileType={setProfileType}
        allCategories={allCategories}
        isCategoriesLoading={isCategoriesLoading}
        selectedCategoryIds={selectedCategoryIds}
        setSelectedCategoryIds={setSelectedCategoryIds}
        selectedDevision={selectedDevision}
        setSelectedDevision={setSelectedDevision}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
      />

      {/* View Details Modal */}
      <ViewVendorModal selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

      {/* Edit Modal */}
      <EditVendorModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editingVendor={editingVendor}
        handleEditVendor={handleEditVendor}
      />
    </div>
  );
}
