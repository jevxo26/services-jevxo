"use client";

import { useAppSelector } from "@/redux/hooks";
import { getRoleName } from "@/redux/features/auth/authSlice";
import { ShieldAlert, DollarSign, Wallet, ArrowDownRight, Check, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CustomTable } from "@/components/ui/table";
import { CustomSelect } from "@/components/ui/select";

interface PayoutLog {
  id: string;
  amount: string;
  method: string;
  account: string;
  status: "Completed" | "Pending";
  date: string;
}

export default function CommissionPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";
  const [payoutBalance, setPayoutBalance] = useState(3200);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferMethod, setTransferMethod] = useState("bKash Mobile Wallet");

  const logs: PayoutLog[] = [
    { id: "PAY-104", amount: "৳5,400", method: "bKash Transfer", account: "01712 ****78", status: "Completed", date: "June 01, 2026" },
    { id: "PAY-084", amount: "৳3,000", method: "bKash Transfer", account: "01712 ****78", status: "Completed", date: "May 15, 2026" },
  ];

  const columns = [
    {
      key: "id",
      header: "Payout ID",
      render: (log: PayoutLog) => (
        <span className="font-mono text-slate-500 font-bold text-xs">{log.id}</span>
      )
    },
    {
      key: "amount",
      header: "Amount",
      render: (log: PayoutLog) => (
        <span className="font-bold text-slate-800">{log.amount}</span>
      )
    },
    {
      key: "method",
      header: "Method"
    },
    {
      key: "account",
      header: "Account Detail"
    },
    {
      key: "status",
      header: "Status",
      render: (log: PayoutLog) => (
        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
          {log.status}
        </span>
      )
    },
    {
      key: "date",
      header: "Date Transferred"
    }
  ];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0 || amount > payoutBalance) {
      toast.error("Please enter a valid amount within your withdrawable balance.");
      return;
    }

    setPayoutBalance(prev => prev - amount);
    toast.success("Withdrawal request submitted successfully!");
    setWithdrawAmount("");
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
          <p className="text-slate-500 mt-1">Track booking commissions, monitor balances, and request direct payouts.</p>
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
            <h2 className="text-4xl font-black mt-2">৳{payoutBalance.toLocaleString()}</h2>
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
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md shadow-rose-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <Send size={16} /> Request Out
            </button>
          </form>
        </div>

      </div>

      {/* Payout History Log */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Payout Logs</h3>
        <CustomTable
          columns={columns}
          data={logs}
          searchKey="id"
          searchPlaceholder="Search payout logs by Payout ID..."
          pageSize={5}
        />
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
        Please toggle your preview role using the selector at the top.
      </p>
    </div>
  );
}
