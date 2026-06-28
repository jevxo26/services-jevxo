"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, Wallet, CheckCircle2, XCircle, Clock, RefreshCw, Send, Plus, CreditCard, Trash2, Building } from "lucide-react";
import { useState } from "react";
import { CustomTable } from "@/components/ui/table";
import {
  useGetWithdrawsByVendorIdQuery,
  useRequestWithdrawMutation,
  Withdraw,
} from "@/redux/features/shared/withdrawApi";
import {
  useGetGetwaysByUserIdQuery,
  useCreateGetwayMutation,
  useDeleteGetwayMutation,
  Getway,
} from "@/redux/features/shared/getwayApi";
import { toast } from "sonner";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";
import { useGetAllUsersQuery } from "@/redux/features/admin/user"; // Need this to fetch own user data

export default function VendorWalletPage() {
  const { user, role, isAuthenticated } = useAppSelector((state) => state.auth);
  const vendorId = user?.id ? Number(user.id) : 1; // Fallback to 1 if not fully mocked in state
  const normalizedRole = typeof role === "string" ? role.toLowerCase() : "";

  const {
    data: apiWithdrawsRes,
    isLoading: isWithdrawsLoading,
    refetch: refetchWithdraws,
  } = useGetWithdrawsByVendorIdQuery(vendorId);

  const {
    data: apiBookingsRes,
    isLoading: isBookingsLoading,
  } = useGetAllBookingsQuery(undefined);

  const { data: usersRes } = useGetAllUsersQuery();
  const allUsers = usersRes?.data || (Array.isArray(usersRes) ? usersRes : []);
  const currentUser = allUsers.find((u: any) => u.id === vendorId || u._id === vendorId) || user;

  const [requestWithdrawMut, { isLoading: isRequesting }] = useRequestWithdrawMutation();
  
  const { data: gatewaysRes, isLoading: isGatewaysLoading, refetch: refetchGateways } = useGetGetwaysByUserIdQuery(vendorId);
  const [createGatewayMut, { isLoading: isCreatingGateway }] = useCreateGetwayMutation();
  const [deleteGatewayMut] = useDeleteGetwayMutation();
  const gateways: Getway[] = gatewaysRes || [];

  // State for Withdraw Modal
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedGatewayId, setSelectedGatewayId] = useState<number | null>(null);

  // State for Add Gateway Modal
  const [isAddGatewayModalOpen, setIsAddGatewayModalOpen] = useState(false);
  const [newGatewayType, setNewGatewayType] = useState("bkash");
  const [newGatewayInfo, setNewGatewayInfo] = useState("");

  const withdraws: Withdraw[] =
    apiWithdrawsRes?.data || (Array.isArray(apiWithdrawsRes) ? apiWithdrawsRes : []);

  const bookings = apiBookingsRes?.data || (Array.isArray(apiBookingsRes) ? apiBookingsRes : []);

  const withdrawableBookings = bookings.filter((b: any) => {
    const isVendor = b.vendor?.id?.toString() === vendorId.toString() || b.vendor_id?.toString() === vendorId.toString();
    const isAgent = b.agent?.id?.toString() === vendorId.toString();
    
    if (normalizedRole === 'agent') {
      if (!isAgent) return false;
    } else {
      if (!isVendor) return false;
    }
    
    if (b.status !== "completed") return false;
    const isAlreadyRequested = withdraws.some((w: Withdraw) => w.booking?.id?.toString() === b.id?.toString());
    return !isAlreadyRequested;
  });

  const handleRequestWithdrawClick = (bookingId: number) => {
    if (gateways.length === 0) {
      toast.error("Please add a payment method first.");
      return;
    }
    setSelectedBookingId(bookingId);
    setSelectedGatewayId(gateways[0].id); // default to first gateway
    setIsWithdrawModalOpen(true);
  };

  const handleRequestWithdrawConfirm = async () => {
    if (!selectedBookingId || !selectedGatewayId) return;
    try {
      await requestWithdrawMut({ 
        bookingId: selectedBookingId, 
        vendorId, 
        gatewayId: selectedGatewayId 
      }).unwrap();
      toast.success("Withdrawal requested successfully!");
      setIsWithdrawModalOpen(false);
      refetchWithdraws();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to request withdrawal");
    }
  };

  const handleAddGateway = async () => {
    try {
      let parsedInfo = {};
      try {
        parsedInfo = JSON.parse(newGatewayInfo || "{}");
      } catch (e) {
        parsedInfo = { details: newGatewayInfo };
      }
      
      await createGatewayMut({
        userId: vendorId,
        getway_type: newGatewayType,
        info: parsedInfo
      }).unwrap();
      toast.success("Payment method added!");
      setNewGatewayInfo("");
      setIsAddGatewayModalOpen(false);
      refetchGateways();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to add payment method");
    }
  };

  const handleDeleteGateway = async (id: number) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;
    try {
      await deleteGatewayMut(id).unwrap();
      toast.success("Payment method deleted");
      refetchGateways();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "Failed to delete");
    }
  };

  if (!isAuthenticated || (normalizedRole !== "vendor" && normalizedRole !== "agent")) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#FFF8F4] rounded-2xl text-[#FF6014] mb-4"><ShieldAlert size={48} /></div>
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">This panel is restricted to Vendors only.</p>
      </div>
    );
  }

  // Summary stats
  const totalPending = withdraws.filter((w) => w.status === "pending").reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const totalWithdrawn = withdraws.filter((w) => w.status === "approved").reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const walletBalance = currentUser?.wallet_balance || 0;
  const commissionPct = currentUser?.commission_percentage || 0;

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-100",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
      rejected: "bg-[#FFF8F4] text-[#E0530A] border-[#FFF0EB]",
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
      key: "service",
      header: "Service & Client",
      render: (item: Withdraw) => (
        <div className="flex flex-col">
          <span className="text-slate-800 font-bold text-sm">{item.booking?.service?.name || item.booking?.pkg?.name || "—"}</span>
          <span className="text-xs text-slate-500">{item.booking?.user?.name || "—"}</span>
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
      key: "admin_note",
      header: "Admin Note",
      render: (item: Withdraw) => (
        <span className="text-slate-500 text-xs truncate max-w-[150px] inline-block" title={item.admin_note}>
          {item.admin_note || "—"}
        </span>
      ),
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

  const withdrawableColumns = [
    {
      key: "id",
      header: "Booking ID",
      render: (item: any) => <span className="text-slate-600 font-bold">#{item.id}</span>,
    },
    {
      key: "service",
      header: "Service & Client",
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="text-slate-800 font-bold text-sm">{item.service?.name || item.pkg?.name || "Service"}</span>
          <span className="text-xs text-slate-500">{item.user?.name || "Client"}</span>
        </div>
      ),
    },
    {
      key: "total_price",
      header: "Total Price",
      render: (item: any) => <span className="text-slate-600">৳{Number(item.total_price || 0).toLocaleString()}</span>,
    },
    {
      key: "earnings",
      header: "Your Earnings",
      render: (item: any) => {
        let amount = 0;
        if (normalizedRole === 'agent') {
          const agentCommission = Number(item.service?.agent_commission_percentage || 0);
          amount = Number(item.total_price || 0) * (agentCommission / 100);
        } else {
          const platformCut = commissionPct;
          const vendorSharePct = 100 - Number(platformCut);
          amount = Number(item.total_price || 0) * (vendorSharePct / 100);
        }
        return <span className="text-emerald-600 font-bold">৳{amount.toLocaleString()}</span>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: any) => (
        <button
          onClick={() => handleRequestWithdrawClick(item.id)}
          disabled={isRequesting}
          className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm shadow-[#FF6014]/20 disabled:opacity-50"
        >
          {isRequesting ? "Wait..." : "Request Commission"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Wallet & Earnings</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage your commissions and withdrawal requests.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetchWithdraws()}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-sm transition-all border border-slate-200"
          >
            <RefreshCw size={16} />
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
          <p className="text-3xl font-bold text-[#FF6014] mt-1">{commissionPct}%</p>
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

      {/* Payment Methods Section */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Payment Methods</h2>
          <button
            onClick={() => setIsAddGatewayModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-primary text-white font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-brand-dark transition-all shadow-sm"
          >
            <Plus size={14} /> Add Method
          </button>
        </div>
        
        {isGatewaysLoading ? (
          <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : gateways.length === 0 ? (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
            <CreditCard size={24} className="mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-500">No payment methods added. Please add one to withdraw commissions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gateways.map((g) => (
              <div key={g.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    {g.getway_type === 'bank' ? <Building size={18} className="text-slate-600" /> : <CreditCard size={18} className="text-slate-600" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm uppercase">{g.getway_type}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-[120px]">
                      {g.info?.details || g.info?.accountNumber || JSON.stringify(g.info)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteGateway(g.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawable Bookings Table */}
      <div className="pt-4">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Earnings Ready to Withdraw</h2>
        {isBookingsLoading ? (
          <div className="flex items-center justify-center py-10 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : withdrawableBookings.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center shadow-sm">
            <h3 className="text-base font-bold text-slate-800">No Earnings Available</h3>
            <p className="text-sm text-slate-400 mt-1">Complete more bookings to earn commissions.</p>
          </div>
        ) : (
          <CustomTable
            columns={withdrawableColumns}
            data={withdrawableBookings}
            searchKey="id"
            filterKey=""
            filterOptions={[]}
            pageSize={5}
          />
        )}
      </div>

      {/* Withdrawal Requests Table */}
      <div className="pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Withdrawal History</h2>
        {isWithdrawsLoading ? (
          <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
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
      </div>

      {/* Add Gateway Modal */}
      {isAddGatewayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Add Payment Method</h3>
              <button onClick={() => setIsAddGatewayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Gateway Type</label>
                <select
                  value={newGatewayType}
                  onChange={(e) => setNewGatewayType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-[#FF6014] focus:border-[#FF6014] block p-3 outline-none"
                >
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="binance">Binance</option>
                  <option value="bank">Bank</option>
                  <option value="visa_card">Visa Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Account Details</label>
                <input
                  type="text"
                  placeholder="e.g. +88017XXXXXXXX or Account No."
                  value={newGatewayInfo}
                  onChange={(e) => setNewGatewayInfo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-[#FF6014] focus:border-[#FF6014] block p-3 outline-none"
                />
                <p className="text-xs text-slate-500 mt-2">Enter the phone number, email, or account details for this method.</p>
              </div>
              <button
                onClick={handleAddGateway}
                disabled={isCreatingGateway || !newGatewayInfo}
                className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold px-4 py-3 rounded-xl transition-all disabled:opacity-50 mt-2"
              >
                {isCreatingGateway ? "Saving..." : "Save Payment Method"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Request Withdrawal</h3>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 mb-4">Select where you want to receive your commission for this booking.</p>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Payment Method</label>
                <div className="space-y-2">
                  {gateways.map((g) => (
                    <label key={g.id} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${selectedGatewayId === g.id ? 'border-brand-primary bg-[#FFF8F4]' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                      <input
                        type="radio"
                        name="gateway"
                        value={g.id}
                        checked={selectedGatewayId === g.id}
                        onChange={() => setSelectedGatewayId(g.id)}
                        className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-slate-300"
                      />
                      <span className="ml-3 font-medium text-slate-800 uppercase text-sm">
                        {g.getway_type} - <span className="text-slate-500 font-normal ml-1">{g.info?.details || JSON.stringify(g.info)}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleRequestWithdrawConfirm}
                disabled={isRequesting || !selectedGatewayId}
                className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold px-4 py-3 rounded-xl transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
              >
                {isRequesting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Confirm Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
