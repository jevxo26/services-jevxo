"use client";

import { ShieldAlert, Wallet, RefreshCw, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import WithdrawDetailModal from "./components/WithdrawDetailModal";
import WithdrawActionModal from "./components/WithdrawActionModal";
import WithdrawTable from "./components/WithdrawTable";
import { useWithdrawState } from "./hooks/useWithdrawState";

const staggerContainer: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardFadeUp: any = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function AdminWithdrawPage() {
  const {
    role,
    isLoading,
    refetch,
    withdraws,
    selectedItem,
    setSelectedItem,
    actionModal,
    setActionModal,
    handleUpdateStatus,
    handleDelete,
    totalPending,
    totalApproved,
    totalAmount,
    isUpdating,
  } = useWithdrawState();

  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#EEF2FF] rounded-2xl text-[#1E4E8C] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">This panel is restricted to Administrators only.</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Pending",
      value: totalPending,
      icon: Clock,
      gradient: "from-amber-500/10 to-transparent",
      bgLight: "bg-amber-50 border-amber-100/80 text-amber-600",
      borderColor: "hover:border-amber-200/70",
      shadow: "hover:shadow-amber-500/5 hover:shadow-xl",
      textClass: "text-amber-600",
    },
    {
      label: "Approved",
      value: totalApproved,
      icon: CheckCircle2,
      gradient: "from-emerald-500/10 to-transparent",
      bgLight: "bg-emerald-50 border-emerald-100/80 text-emerald-600",
      borderColor: "hover:border-emerald-200/70",
      shadow: "hover:shadow-emerald-500/5 hover:shadow-xl",
      textClass: "text-emerald-600",
    },
    {
      label: "Total Paid Out",
      value: `৳${totalAmount.toLocaleString()}`,
      icon: TrendingUp,
      gradient: "from-indigo-500/10 to-transparent",
      bgLight: "bg-indigo-50 border-indigo-100/80 text-indigo-600",
      borderColor: "hover:border-indigo-200/70",
      shadow: "hover:shadow-indigo-500/5 hover:shadow-xl",
      textClass: "text-slate-900",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EEF2FF] text-[#1E4E8C] rounded-2xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Withdraw Requests</h1>
            <p className="text-xs text-slate-400 mt-0.5">Review and manage vendor payout requests.</p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-sm transition-all border border-slate-200"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={cardFadeUp}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`group bg-white p-6 rounded-3xl border border-slate-100 transition-all duration-300 relative overflow-hidden flex items-center justify-between ${stat.borderColor} ${stat.shadow}`}
            >
              {/* Background gradient bubble on hover */}
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
              
              <div className="space-y-1.5 z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
                <h4 className={`text-3xl font-black ${stat.textClass} tracking-tight`}>
                  {stat.value}
                </h4>
              </div>
              
              <div className={`p-4 rounded-2xl border ${stat.bgLight} shrink-0 transition-all duration-300 group-hover:scale-110 shadow-xs z-10`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-8 h-8 border-4 border-[#1E4E8C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : withdraws.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100/50">
            <Wallet size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Withdraw Requests</h3>
          <p className="text-sm text-slate-400 mt-1">No vendors have made withdrawal requests yet.</p>
        </div>
      ) : (
        <WithdrawTable
          withdraws={withdraws}
          setSelectedItem={setSelectedItem}
          setActionModal={setActionModal}
        />
      )}

      {/* Detail Modal */}
      <WithdrawDetailModal
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isUpdating={isUpdating}
        handleUpdateStatus={handleUpdateStatus}
        handleDelete={handleDelete}
      />

      {/* Action Modal (Approve/Reject from Table) */}
      <WithdrawActionModal
        actionModal={actionModal}
        setActionModal={setActionModal}
        isUpdating={isUpdating}
        handleUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
