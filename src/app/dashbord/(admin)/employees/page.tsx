"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, Contact } from "lucide-react";
import EmployeeModal from "./components/EmployeeModal";
import EmployeeViewModal from "./components/EmployeeViewModal";
import EmployeeTable from "./components/EmployeeTable";
import { useEmployeeState } from "./hooks/useEmployeeState";

export default function EmployeesPage() {
  const {
    role,
    employees,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedUser,
    setSelectedUser,
    openDropdownId,
    setOpenDropdownId,
    step,
    selectedDevision,
    setSelectedDevision,
    selectedDistrict,
    setSelectedDistrict,
    selectedArea,
    setSelectedArea,
    isEditModalOpen,
    setIsEditModalOpen,
    editingEmployee,
    setEditingEmployee,
    isUsersLoading,
    isCategoriesLoading,
    allCategories,
    vendorOptions,
    isCreating,
    isCreatingProfile,
    isUpdatingProfile,
    handleCreateUser,
    handleCreateProfile,
    handleEditEmployee,
    closeCreateModal,
    handleActivate,
    handleDeactivate,
    handleBlock,
    handleDelete,
  } = useEmployeeState();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
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
            <Contact className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{lang === "bn" ? "কর্মচারী ম্যানেজমেন্ট" : "Employee Management"}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "bn" ? "সিস্টেমের সব কর্মচারী দেখুন এবং ম্যানেজ করুন।" : "Manage company employees, their profiles, and categories."}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            {lang === "bn" ? "কর্মচারী যোগ করুন" : "Add Employee"}
          </button>
        </div>
      </div>

      {isUsersLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#FF6014] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">{lang === "bn" ? "কর্মচারী লোড হচ্ছে..." : "Loading employees..."}</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <p className="text-sm text-slate-400 font-medium">{lang === "bn" ? "কোনো কর্মচারী পাওয়া যায়নি।" : "No employees found."}</p>
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
          setSelectedUser={setSelectedUser}
          setEditingEmployee={setEditingEmployee}
          setIsEditModalOpen={setIsEditModalOpen}
          handleActivate={handleActivate}
          handleDeactivate={handleDeactivate}
          handleBlock={handleBlock}
          handleDelete={handleDelete}
        />
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <EmployeeModal
          mode="create"
          step={step}
          closeCreateModal={closeCreateModal}
          handleCreateUser={handleCreateUser}
          isCreating={isCreating}
          handleCreateProfile={handleCreateProfile}
          isCreatingProfile={isCreatingProfile}
          role={role}
          vendorOptions={vendorOptions}
          isUsersLoading={isUsersLoading}
          isCategoriesLoading={isCategoriesLoading}
          allCategories={allCategories}
          selectedDevision={selectedDevision}
          setSelectedDevision={setSelectedDevision}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
        />
      )}

      {/* Edit Employee Modal */}
      {isEditModalOpen && editingEmployee && (
        <EmployeeModal
          mode="edit"
          editingEmployee={editingEmployee}
          handleEditEmployee={handleEditEmployee}
          isUpdatingProfile={isUpdatingProfile}
          role={role}
          vendorOptions={vendorOptions}
          isUsersLoading={isUsersLoading}
          isCategoriesLoading={isCategoriesLoading}
          allCategories={allCategories}
          selectedDevision={selectedDevision}
          setSelectedDevision={setSelectedDevision}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          setIsEditModalOpen={setIsEditModalOpen}
          setEditingEmployee={setEditingEmployee}
        />
      )}

      <EmployeeViewModal selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
    </div>
  );
}
