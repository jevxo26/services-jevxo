"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, Wallet, CheckCircle2, XCircle, Clock, RefreshCw, Send } from "lucide-react";
import { useState } from "react";
import { CustomTable } from "@/components/ui/table";
import {
  useGetWithdrawsByVendorIdQuery,
  useRequestWithdrawMutation,
  Withdraw,
} from "@/redux/features/shared/withdrawApi";
import { toast } from "sonner";
import { useGetAllUsersQuery } from "@/redux/features/admin/user"; // Need this to fetch own user data

export default function VendorWalletPage() {
  const { user, role, isAuthenticated } = useAppSelector((state) => state.auth);
  const vendorId = user?.id ? Number(user.id) : 1; // Fallback to 1 if not fully mocked in state

  const [bookingIdInput, setBookingIdInput] = useState("");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const {
    data: apiWithdrawsRes,
    isLoading: isWithdrawsLoading,
    refetch: refetchWithdraws,
  } = useGetWithdrawsByVendorIdQuery(vendorId);

  // Fetch users to get wallet balance and commission percentage of the logged-in vendor
  const { data: usersRes } = useGetAllUsersQuery();
  const allUsers = usersRes?.data || (Array.isArray(usersRes) ? usersRes : []);
  const currentUser = allUsers.find((u: any) => u.id === vendorId || u._id === vendorId) || user;

  const [requestWithdrawMut, { isLoading: isRequesting }] = useRequestWithdrawMutation();

  const withdraws: Withdraw[] =
    apiWithdrawsRes?.data || (Array.isArray(apiWithdrawsRes) ? apiWithdrawsRes : []);

  const handleRequestWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingIdInput) {
      toast.error("Please enter a Booking ID");
      return;
    }

    try {
      await requestWithdrawMut({ bookingId: Number(bookingIdInput), vendorId }).unwrap();
      toast.success("Withdrawal requested successfully!");
      setIsRequestModalOpen(false);
      setBookingIdInput("");
      refetchWithdraws();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to request withdrawal");
    }
  };

  const rawRole = useAppSelector((state) => state.auth.role);
  const normalizedRole = typeof rawRole === "string" ? rawRole.toLowerCase() : "";

  if (!isAuthenticated || (normalizedRole !== "vendor" && normalizedRole !== "agent")) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#FFF8F7] rounded-2xl text-[#FF7C71] mb-4"><ShieldAlert size={48} /></div>
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">This panel is restricted to Vendors only.</p>
      </div>
    );
  }

  // Summary stats
  const totalPending = withdraws.filter((w) => w.status === "pending").reduce((sum, w) => sum + (w.amount || 0), 0);
  const totalWithdrawn = withdraws.filter((w) => w.status === "approved").reduce((sum, w) => sum + (w.amount || 0), 0);
  const walletBalance = currentUser?.wallet_balance || 0;
  const commissionPct = currentUser?.commission_percentage || 0;

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-100",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
      rejected: "bg-[#FFF8F7] text-[#E5675D] border-[#FFEBE9]",
    };
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock size={11} />,
      approved: <CheckCircle2 size={11} />,
      rejected: <XCircle size={11} />,
    };
    const cls = map[status] || "bg-slate-100 text-slate-600 border-slate-200";
    return (
      <span className={`inline-flex items-center gap-1.5 font-bold text-xs px-2.5 py-1 rounded-xl border ${cls}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      key: "id",
      header: "Request ID",
      render: (item: Withdraw) => <span className="text-slate-600 font-medium">#{item.id}</span>,
    },
    {
      key: "booking",
      header: "Booking ID",
      render: (item: Withdraw) => (
        <span className="text-slate-800 font-bold">
          {item.booking?.id ? `#${item.booking.id}` : "—"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (item: Withdraw) => (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-emerald-100/50">
          ৳{(item.amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Withdraw) => statusBadge(item.status),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (item: Withdraw) => (
        <span className="text-slate-400 text-xs font-medium">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Wallet & Earnings</h1>
          <p className="text-slate-500 mt-1">Manage your commissions and withdrawal requests.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetchWithdraws()}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-sm transition-all border border-slate-200"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-brand-primary/10"
          >
            <Send size={16} /> Request Commission
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-2xl shadow-premium p-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet size={80} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">Current Wallet Balance</p>
          <p className="text-4xl font-black mt-2 relative z-10">৳{walletBalance.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Commission Rate</p>
          <p className="text-3xl font-bold text-[#FF7C71] mt-1">{commissionPct}%</p>
          <p className="text-xs text-slate-400 mt-1">Per completed booking</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Withdrawals</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">৳{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Approved (Lifetime)</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">৳{totalWithdrawn.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      {isWithdrawsLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-premium">
          <div className="w-8 h-8 border-4 border-[#FF7C71] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : withdraws.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100/50">
            <Wallet size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Withdraw Requests</h3>
          <p className="text-sm text-slate-400 mt-1">You haven't requested any commissions yet.</p>
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={withdraws}
          searchKey="status"
          filterKey="status"
          filterPlaceholder="All Statuses"
          filterOptions={[
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ]}
          pageSize={10}
        />
      )}

      {/* Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Request Commission</h2>
              <button onClick={() => setIsRequestModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleRequestWithdraw} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Booking ID</label>
                <input 
                  type="number" 
                  required 
                  value={bookingIdInput}
                  onChange={(e) => setBookingIdInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF7C71]/40 focus:ring-2 focus:ring-rose-100 transition-all" 
                  placeholder="Enter the completed booking ID" 
                />
                <p className="text-xs text-slate-500 mt-2">The admin will review your request. Upon approval, {commissionPct}% of the booking total will be added to your Wallet.</p>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRequesting}
                  className="bg-brand-primary hover:bg-brand-dark disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
                >
                  {isRequesting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
