"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import AgentModal from "./components/AgentModal";
import AgentViewModal from "./components/AgentViewModal";
import AgentTable from "./components/AgentTable";
import { useAgentState } from "./hooks/useAgentState";

export default function AgentsPage() {
  const {
    agents,
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
    selectedCategoryIds,
    setSelectedCategoryIds,
    pictureFile,
    setPictureFile,
    shopImage1File,
    setShopImage1File,
    shopImage2File,
    setShopImage2File,
    nidFrontFile,
    setNidFrontFile,
    nidBackFile,
    setNidBackFile,
    isCreatingUser,
    isCreatingProfile,
    handleCreateUser,
    handleCreateProfile,
    closeModal,
    handleActivate,
    handleDeactivate,
    handleBlock,
    handleDelete,
    isAuthenticated,
  } = useAgentState();

  const lang = useAppSelector((state) => state.lang.value);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#EEF2FF] rounded-2xl text-[#1E4E8C] mb-4">
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
          <div className="p-2.5 bg-[#EEF2FF] text-[#1E4E8C] rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{lang === "bn" ? "এজেন্ট ম্যানেজমেন্ট" : "Agent Management"}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "bn" ? "সিস্টেমের সব এজেন্ট দেখুন এবং ম্যানেজ করুন।" : "Manage system agents and their accounts."}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            {lang === "bn" ? "এজেন্ট যোগ করুন" : "Add Agent"}
          </button>
        </div>
      </div>

      {isUsersLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#1E4E8C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">{lang === "bn" ? "এজেন্ট লোড হচ্ছে..." : "Loading agents..."}</p>
        </div>
      ) : agents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <p className="text-sm text-slate-400 font-medium">{lang === "bn" ? "কোনো এজেন্ট পাওয়া যায়নি।" : "No agents found."}</p>
        </div>
      ) : (
        <AgentTable
          agents={agents}
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
          setSelectedUser={setSelectedUser}
          handleActivate={handleActivate}
          handleDeactivate={handleDeactivate}
          handleBlock={handleBlock}
          handleDelete={handleDelete}
        />
      )}

      {isAddModalOpen && (
        <AgentModal
          step={step}
          closeModal={closeModal}
          handleCreateUser={handleCreateUser}
          isCreatingUser={isCreatingUser}
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
          selectedCategoryIds={selectedCategoryIds}
          setSelectedCategoryIds={setSelectedCategoryIds}
          pictureFile={pictureFile}
          setPictureFile={setPictureFile}
          shopImage1File={shopImage1File}
          setShopImage1File={setShopImage1File}
          shopImage2File={shopImage2File}
          setShopImage2File={setShopImage2File}
          nidFrontFile={nidFrontFile}
          setNidFrontFile={setNidFrontFile}
          nidBackFile={nidBackFile}
          setNidBackFile={setNidBackFile}
        />
      )}

      <AgentViewModal selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
    </div>
  );
}
