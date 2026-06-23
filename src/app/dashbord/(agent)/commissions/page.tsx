"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, ArrowDownRight, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CustomTable } from "@/components/ui/table";
import { CustomSelect } from "@/components/ui/select";
import { useGetAllWithdrawsQuery, useRequestWithdrawMutation } from "@/redux/features/shared/withdrawApi";
import { useGetUserProfileQuery } from "@/redux/features/auth/authApi";

export default function CommissionPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const authUser = useAppSelector((state) => state.auth.user);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferMethod, setTransferMethod] = useState("bKash Mobile Wallet");

  // Get current user's wallet balance
  const { data: profileData } = useGetUserProfileQuery();
  const walletBalance = (profileData as any)?.data?.wallet_balance ?? (profileData as any)?.wallet_balance ?? 0;

  // Vendor withdrawals — agent uses wallet_balance, so use userId as vendorId
  const userId = authUser?.id || authUser?._id;
  const { data: withdrawsRes, isLoading: loadingWithdraws } = useGetAllWithdrawsQuery();
  const [requestWithdraw, { isLoading: requesting }] = useRequestWithdrawMutation();

  // Filter my withdrawals
  const allWithdraws = withdrawsRes?.data || [];
  const myWithdraws = allWithdraws.filter((w: any) =>
    w.vendor?.id === userId || w.vendor?.id === Number(userId)
  );

  const columns = [
    {
      key: "id",
      header: "Withdraw ID",
      render: (w: any) => (
        <span className="font-mono text-slate-500 font-bold text-xs">WD-{w.id}</span>
      )
    },
    {
      key: "amount",
      header: "Amount",
      render: (w: any) => (
        <span className="font-bold text-slate-800">৳{Number(w.amount).toLocaleString()}</span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (w: any) => (
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
          w.status === "approved"
            ? "bg-emerald-50 text-emerald-700"
            : w.status === "rejected"
              ? "bg-red-50 text-red-700"
              : "bg-amber-50 text-amber-700"
        }`}>
          {w.status}
        </span>
      )
    },
    {
      key: "createdAt",
      header: "Date Requested",
      render: (w: any) => <span>{new Date(w.createdAt).toLocaleDateString("en-BD")}</span>
    }
  ];

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0 || amount > Number(walletBalance)) {
      toast.error("Please enter a valid amount within your withdrawable balance.");
      return;
    }

    try {
      await requestWithdraw({ amount }).unwrap();
      toast.success("Withdrawal request submitted successfully!");
      setWithdrawAmount("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit withdrawal request.");
    }
  };

  if (role !== "agent") {
    return <AccessDenied roleRequired="Agent" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Commission Tracking</h1>
          <p className="text-slate-500 mt-1">Track your wallet balance and request direct payouts.</p>
        </div>
      </div>

      {/* Balance Panel & Quick Withdraw Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Withdrawable Balance card */}
        <div className="bg-gradient-to-br from-rose-500 to-[#FF464C] text-white p-6 rounded-2xl shadow-lg shadow-rose-500/10 flex flex-col justify-between relative overflow-hidden min-h-[200px]">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-bl-full flex items-center justify-center font-bold text-white/10 text-3xl">
            ৳
          </div>
          <div>
            <span className="text-xs font-bold text-rose-100 uppercase tracking-widest block">Withdrawable Balance</span>
            <h2 className="text-4xl font-black mt-2">৳{Number(walletBalance).toLocaleString()}</h2>
          </div>
          <p className="text-xs text-rose-100/80 font-medium">Automatic bi-monthly payouts on 1st and 15th.</p>
        </div>

        {/* Quick Withdraw Console */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ArrowDownRight className="text-[#FF5B60]" /> Request Immediate Payout
          </h3>
          <form onSubmit={handleWithdraw} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Amount (৳)</label>
              <input
                type="number"
                placeholder="e.g. 1500"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                required
              />
            </div>

            <div className="sm:col-span-1">
              <CustomSelect
                label="Transfer Method"
                options={[
                  { value: "bKash Mobile Wallet", label: "bKash Mobile Wallet" },
                  { value: "Nagad Wallet", label: "Nagad Wallet" },
                  { value: "Bank Wire", label: "Bank Wire Transfer" }
                ]}
                value={transferMethod}
                onChange={(val) => setTransferMethod(val)}
                placeholder="Select method"
              />
            </div>

            <button
              type="submit"
              disabled={requesting}
              className="bg-rose-500 hover:bg-rose-600 disabled:opacity-70 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md shadow-rose-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              {requesting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Request Out
            </button>
          </form>
        </div>

      </div>

      {/* Payout History Log */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Payout Logs</h3>
        {loadingWithdraws ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={28} className="animate-spin text-rose-500" />
          </div>
        ) : myWithdraws.length > 0 ? (
          <CustomTable
            columns={columns}
            data={myWithdraws}
            searchKey="id"
            searchPlaceholder="Search payout logs..."
            pageSize={5}
          />
        ) : (
          <div className="bg-white p-10 text-center border border-slate-100 rounded-2xl shadow-sm text-slate-400 text-sm">
            No withdrawal requests yet.
          </div>
        )}
      </div>

    </div>
  );
}

function AccessDenied({ roleRequired }: { roleRequired: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
      <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 mb-4">
        <ShieldAlert size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        This subpage is only accessible to users with the <strong className="text-slate-800">{roleRequired}</strong> role.
      </p>
    </div>
  );
}
