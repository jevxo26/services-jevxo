"use client";

import { useAppSelector } from "@/redux/hooks";
import {
  ShieldAlert,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { CustomTable } from "@/components/ui/table";
import type { TableAction } from "@/components/ui/table";
import {
  useGetAllWithdrawsQuery,
  useUpdateWithdrawStatusMutation,
  useDeleteWithdrawMutation,
  Withdraw,
} from "@/redux/features/shared/withdrawApi";
import { toast } from "sonner";

export default function AdminWithdrawPage() {
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role =
    typeof rawRole === "string"
      ? rawRole.toLowerCase().replace(/\s+/g, "")
      : "client";

  const {
    data: apiWithdrawsRes,
    isLoading,
    refetch,
  } = useGetAllWithdrawsQuery();
  const [updateStatusMut, { isLoading: isUpdating }] = useUpdateWithdrawStatusMutation();
  const [deleteMut] = useDeleteWithdrawMutation();

  const [selectedItem, setSelectedItem] = useState<Withdraw | null>(null);

  const withdraws: Withdraw[] =
    apiWithdrawsRes?.data || (Array.isArray(apiWithdrawsRes) ? apiWithdrawsRes : []);

  const handleUpdateStatus = async (id: number | string, status: "approved" | "rejected" | "pending") => {
    try {
      await updateStatusMut({ id, data: { status } }).unwrap();
      toast.success(`Request ${status} successfully!`);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to update status");
    }
  };

  const handleDelete = async (item: Withdraw) => {
    try {
      await deleteMut(item.id).unwrap();
      toast.success("Withdraw request deleted!");
      setSelectedItem(null);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to delete");
    }
  };

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

  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#FFF8F7] rounded-2xl text-[#FF7C71] mb-4"><ShieldAlert size={48} /></div>
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">This panel is restricted to Administrators only.</p>
      </div>
    );
  }

  // Summary stats
  const totalPending = withdraws.filter((w) => w.status === "pending").length;
  const totalApproved = withdraws.filter((w) => w.status === "approved").length;
  const totalAmount = withdraws
    .filter((w) => w.status === "approved")
    .reduce((sum, w) => sum + (w.amount || 0), 0);

  const columns = [
    {
      key: "vendor",
      header: "Vendor",
      render: (item: Withdraw) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center text-sm">
            {item.vendor?.name?.charAt(0)?.toUpperCase() || "V"}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{item.vendor?.name || "—"}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.vendor?.email || "—"}</p>
          </div>
        </div>
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
      header: "Requested",
      render: (item: Withdraw) => (
        <span className="text-slate-400 text-xs font-medium">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  const tableActions: TableAction<Withdraw>[] = [
    {
      label: "Approve",
      icon: CheckCircle2,
      onClick: (item) => handleUpdateStatus(item.id, "approved"),
      variant: "default",
    },
    {
      label: "Reject",
      icon: XCircle,
      onClick: (item) => handleUpdateStatus(item.id, "rejected"),
      variant: "destructive",
    },
    {
      label: "View Details",
      onClick: (item) => setSelectedItem(item),
      variant: "secondary",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Withdraw Requests</h1>
          <p className="text-slate-500 mt-1">Review and manage vendor payout requests.</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-sm transition-all border border-slate-200"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{totalPending}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{totalApproved}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Paid Out</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">৳{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-premium">
          <div className="w-8 h-8 border-4 border-[#FF7C71] border-t-transparent rounded-full animate-spin" />
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
        <CustomTable
          columns={columns}
          data={withdraws}
          actions={tableActions}
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

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Withdraw Details</h2>
              <button onClick={() => setSelectedItem(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Request ID", value: `#${selectedItem.id}` },
                { label: "Vendor", value: selectedItem.vendor?.name || "—" },
                { label: "Email", value: selectedItem.vendor?.email || "—" },
                { label: "Amount", value: `৳${(selectedItem.amount || 0).toLocaleString()}` },
                { label: "Status", value: selectedItem.status },
                { label: "Requested At", value: selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 font-medium">{label}</span>
                  <span className="text-sm font-bold text-slate-900">{value}</span>
                </div>
              ))}
              <div className="pt-4 flex gap-3 justify-end">
                {selectedItem.status === "pending" && (
                  <>
                    <button
                      disabled={isUpdating}
                      onClick={() => { handleUpdateStatus(selectedItem.id, "approved"); setSelectedItem(null); }}
                      className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
                    >
                      Approve
                    </button>
                    <button
                      disabled={isUpdating}
                      onClick={() => { handleUpdateStatus(selectedItem.id, "rejected"); setSelectedItem(null); }}
                      className="bg-[#FF7C71] hover:bg-[#E5675D] disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(selectedItem)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
