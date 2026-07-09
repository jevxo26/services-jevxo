"use client";

import { ShieldAlert, PlusCircle, Tag, Percent } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import CouponModal from "./components/CouponModal";
import DeleteCouponModal from "./components/DeleteCouponModal";
import CouponTable from "./components/CouponTable";
import { useCouponState } from "./hooks/useCouponState";

export default function CouponsManagementPage() {
  const {
    role,
    isLoading,
    coupons,
    services,
    isModalOpen,
    setIsModalOpen,
    editingCoupon,
    deleteTarget,
    setDeleteTarget,
    form,
    setForm,
    packageOptions,
    isCreating,
    isUpdating,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
  } = useCouponState();

  const lang = useAppSelector((state) => state.lang.value);

  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
        <ShieldAlert size={48} className="text-[#FF6014] mb-4" />
        <h3 className="text-xl font-bold text-slate-800">{lang === "bn" ? "অ্যাক্সেস অস্বীকৃত" : "Access Denied"}</h3>
        <p className="text-sm text-slate-500 mt-2">{lang === "bn" ? "শুধুমাত্র সুপার অ্যাডমিন কুপন ম্যানেজ করতে পারেন।" : "Only superadmin can manage coupons."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{lang === "bn" ? "কুপন ম্যানেজমেন্ট" : "Manage Coupons"}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "bn" ? "বুকিংয়ের জন্য প্রমো কোড এবং ডিসকাউন্ট কুপন তৈরি করুন।" : "Create promo codes and discount coupons for bookings."}</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#FF6014] hover:bg-[#E0530A] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
        >
          <PlusCircle size={18} />
          {lang === "bn" ? "কুপন তৈরি করুন" : "Create Coupon"}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm">{lang === "bn" ? "কুপন লোড হচ্ছে..." : "Loading coupons..."}</div>
        ) : coupons.length === 0 ? (
          <div className="py-20 text-center">
            <Percent size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-500 text-sm">{lang === "bn" ? "এখনো কোনো কুপন তৈরি হয়নি।" : "No coupons created yet."}</p>
          </div>
        ) : (
          <CouponTable coupons={coupons} openEdit={openEdit} setDeleteTarget={setDeleteTarget} />
        )}
      </div>

      {isModalOpen && (
        <CouponModal
          editingCoupon={editingCoupon}
          setIsModalOpen={setIsOpen => setIsModalOpen(setIsOpen)}
          handleSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          services={services}
          packageOptions={packageOptions}
          isCreating={isCreating}
          isUpdating={isUpdating}
        />
      )}

      <DeleteCouponModal
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        handleDelete={handleDelete}
      />
    </div>
  );
}
