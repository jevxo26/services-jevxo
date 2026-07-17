"use client";

import { ShieldAlert, PlusCircle, Layers } from "lucide-react";
import DeleteNestedServiceModal from "./components/DeleteNestedServiceModal";
import NestedServiceTable from "./components/NestedServiceTable";
import { useNestedServiceState } from "./hooks/useNestedServiceState";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function NestedServicesManagementPage() {
  const router = useRouter();
  const {
    role,
    isNestedLoading,
    nestedServices,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToDelete,
    setItemToDelete,
    openDeleteModal,
    handleDelete,
  } = useNestedServiceState();

  const lang = useAppSelector((state) => state.lang.value);

  if (role !== "superadmin" && role !== "vendor") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#EEF2FF] rounded-2xl text-[#4F46E5] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{lang === "bn" ? "প্রবেশাধিকার নেই" : "Access Denied"}</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">{lang === "bn" ? "এই প্যানেলটি শুধুমাত্র অ্যাডমিনিস্ট্রেটর এবং নিবন্ধিত ভেন্ডরদের জন্য সংরক্ষিত।" : "This panel is restricted to Administrators and registered Vendors."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EEF2FF] text-[#4F46E5] rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 font-display">
              {lang === "bn"
                ? (role === "vendor" ? "আমার সাব-সার্ভিসেস" : "নেস্টেড সার্ভিস ডিরেক্টরি")
                : (role === "vendor" ? "My Sub-Services" : "Nested Service Directory")}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === "bn"
                ? (role === "vendor" ? "আপনার মূল সার্ভিসের অধীনে সাব-সার্ভিসগুলো যোগ করুন এবং পরিচালনা করুন।" : "সমস্ত ভেন্ডরদের মূল সার্ভিসের সাথে লিঙ্ক করা সাব-সার্ভিস পরিচালনা করুন।")
                : (role === "vendor" ? "Add and manage sub-services under your main service." : "Manage sub-services linked to services across all vendors.")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashbord/nested-services/create"
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#4F46E5]/10"
          >
            <PlusCircle size={18} /> {lang === "bn" ? "সাব-সার্ভিস যোগ করুন" : "Add Sub-Service"}
          </Link>
        </div>
      </div>

      {/* Table */}
      {isNestedLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : nestedServices.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100/50">
            <Layers size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">{lang === "bn" ? "কোনো সাব-সার্ভিস পাওয়া যায়নি" : "No Sub-Services Found"}</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">{lang === "bn" ? "একটি বিদ্যমান সার্ভিসের অধীনে সাব-সার্ভিস যোগ করুন।" : "Add a sub-service under an existing service to get started."}</p>
          <Link
            href="/dashbord/nested-services/create"
            className="mt-4 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F46E5] font-bold px-4 py-2 rounded-xl text-xs transition-all inline-block"
          >
            {lang === "bn" ? "নতুন সাব-সার্ভিস যোগ করুন" : "Add New Sub-Service"}
          </Link>
        </div>
      ) : (
        <NestedServiceTable
          nestedServices={nestedServices}
          openEditModal={(item: any) => router.push(`/dashbord/nested-services/edit/${item.id}`)}
          openDeleteModal={openDeleteModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteNestedServiceModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        handleDelete={handleDelete}
      />
    </div>
  );
}
