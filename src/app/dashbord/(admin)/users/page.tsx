"use client";

import { ShieldAlert, Users } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import UserModal from "./components/UserModal";
import ViewUserModal from "./components/ViewUserModal";
import UserTable from "./components/UserTable";
import { useUserState } from "./hooks/useUserState";

export default function UsersPage() {
  const {
    role,
    users,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedUser,
    setSelectedUser,
    openDropdownId,
    setOpenDropdownId,
    step,
    isUsersLoading,
    isRolesLoading,
    rolesRes,
    isCreatingUser,
    isCreatingProfile,
    isCategoriesLoading,
    allCategories,
    selectedDevision,
    setSelectedDevision,
    selectedDistrict,
    setSelectedDistrict,
    selectedArea,
    setSelectedArea,
    handleCreateUser,
    handleCreateProfile,
    closeModal,
    handleActivate,
    handleDeactivate,
    handleBlock,
    handleDelete,
    isAuthenticated,
  } = useUserState();

  const lang = useAppSelector((state) => state.lang.value);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#FFF8F4] rounded-2xl text-[#FF6014] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{lang === "bn" ? "অ্যাক্সেস অস্বীকৃত" : "Access Denied"}</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">{lang === "bn" ? "লগইন করুন।" : "Please log in to access this panel."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{lang === "bn" ? "ইউজার ম্যানেজমেন্ট" : "User Management"}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "bn" ? "প্ল্যাটফর্মের সব ইউজার দেখুন এবং ম্যানেজ করুন।" : "Verify service professionals and manage platform customers."}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            {lang === "bn" ? "ইউজার যোগ করুন" : "Add User"}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isUsersLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#FF6014] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">{lang === "bn" ? "ইউজার লোড হচ্ছে..." : "Loading users..."}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <p className="text-sm text-slate-400 font-medium">{lang === "bn" ? "কোনো ইউজার পাওয়া যায়নি।" : "No users found. The backend may be unavailable."}</p>
        </div>
      ) : (
        <UserTable
          users={users}
          role={role}
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
          handleActivate={handleActivate}
          handleDeactivate={handleDeactivate}
          handleBlock={handleBlock}
          handleDelete={handleDelete}
        />
      )}

      {/* Add User Modal (2 Steps) */}
      <UserModal
        isAddModalOpen={isAddModalOpen}
        closeModal={closeModal}
        step={step}
        handleCreateUser={handleCreateUser}
        isCreatingUser={isCreatingUser}
        isRolesLoading={isRolesLoading}
        rolesRes={rolesRes}
        role={role}
        handleCreateProfile={handleCreateProfile}
        isCreatingProfile={isCreatingProfile}
        isCategoriesLoading={isCategoriesLoading}
        allCategories={allCategories}
        selectedDevision={selectedDevision}
        setSelectedDevision={setSelectedDevision}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
      />

      {/* View User Modal */}
      <ViewUserModal selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
    </div>
  );
}
