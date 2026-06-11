"use client";

import { useRole } from "@/context/RoleContext";
import { ShieldAlert, Plus, CreditCard, Gift, TrendingDown, ArrowUpRight, ArrowDownLeft, Check } from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: string;
  type: "load" | "payment";
  amount: string;
  method: string;
  date: string;
  status: "Completed" | "Pending";
}

import { CustomTable } from "@/components/ui/table";

export default function WalletPage() {
  const { role } = useRole();
  const [balance, setBalance] = useState(24500);
  const [loadAmount, setLoadAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const transactions: Transaction[] = [
    { id: "TXN-901", type: "load", amount: "৳5,000", method: "bKash Cash-In", date: "June 10, 2026", status: "Completed" },
    { id: "TXN-892", type: "payment", amount: "৳1,400", method: "Booking RS-9284", date: "June 09, 2026", status: "Completed" },
    { id: "TXN-874", type: "payment", amount: "৳2,500", method: "Booking RS-9128", date: "May 20, 2026", status: "Completed" },
  ];

  const columns = [
    {
      key: "id",
      header: "Transaction ID",
      render: (t: Transaction) => (
        <span className="font-mono text-slate-500 font-bold text-xs">{t.id}</span>
      )
    },
    {
      key: "type",
      header: "Activity",
      render: (t: Transaction) => (
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-lg ${t.type === "load" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
            {t.type === "load" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
          </div>
          <span className="font-bold text-slate-800">{t.type === "load" ? "Loaded Balance" : "Service Payment"}</span>
        </div>
      )
    },
    {
      key: "method",
      header: "Method"
    },
    {
      key: "date",
      header: "Date"
    },
    {
      key: "status",
      header: "Status",
      render: (t: Transaction) => (
        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
          {t.status}
        </span>
      )
    },
    {
      key: "amount",
      header: "Amount",
      render: (t: Transaction) => (
        <span className={`font-bold ${t.type === "load" ? "text-emerald-600" : "text-brand-primary"}`}>
          {t.type === "load" ? "+" : "-"}{t.amount}
        </span>
      )
    }
  ];

  const handleLoadBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadAmount || isNaN(Number(loadAmount))) return;
    setBalance(balance + Number(loadAmount));
    setSuccess(true);
    setLoadAmount("");
    setTimeout(() => setSuccess(false), 3000);
  };

  if (role !== "customer") {
    return <AccessDenied roleRequired="Customer" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Wallet &amp; Payments</h1>
          <p className="text-slate-500 mt-1">Manage your platform credits, check payment history, and add balance.</p>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Check size={16} /> Balance loaded successfully!
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Columns: Balance Card & Load Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Display Card */}
          <div className="bg-gradient-to-br from-rose-500 to-[#FF5A5F] p-8 rounded-3xl text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full" />
            <div className="absolute right-10 top-10 text-white/20">
              <CreditCard size={64} />
            </div>

            <span className="text-sm font-semibold tracking-wider text-rose-100 uppercase">Available Balance</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-2">৳{balance.toLocaleString()}</h2>

            <div className="flex gap-8 mt-8 text-xs font-semibold text-rose-100">
              <div>
                <span className="block opacity-75">Customer Account ID</span>
                <span className="text-sm text-white mt-1 block">ACC-9828472</span>
              </div>
              <div>
                <span className="block opacity-75">Verification Badge</span>
                <span className="text-sm text-white mt-1 block bg-white/20 px-2 py-0.5 rounded-lg w-max">Verified Client</span>
              </div>
            </div>
          </div>

          {/* Quick Cash-In Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Load Balance</h3>

            <form onSubmit={handleLoadBalance} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">৳</span>
                <input
                  type="number"
                  placeholder="Enter amount to load"
                  value={loadAmount}
                  onChange={(e) => setLoadAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-semibold"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Plus size={16} /> Cash-In (bKash)
              </button>
            </form>
          </div>
        </div>

        {/* Right 1 Column: Active Coupons */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Active Coupons</h3>

          <div className="space-y-4">
            {[
              { code: "ACCOOL20", discount: "20% OFF", desc: "Valid on AC Repairs" },
              { code: "CLEANHOMY", discount: "৳500 OFF", desc: "Valid on Sofa Clean" },
            ].map((coupon, i) => (
              <div key={i} className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg">{coupon.code}</span>
                  <p className="text-sm font-bold text-slate-800 mt-2">{coupon.discount}</p>
                  <span className="text-xs text-slate-400 font-medium block mt-0.5">{coupon.desc}</span>
                </div>
                <div className="text-slate-300">
                  <Gift size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
        <CustomTable
          columns={columns}
          data={transactions}
          searchKey="id"
          searchPlaceholder="Search by transaction ID..."
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
