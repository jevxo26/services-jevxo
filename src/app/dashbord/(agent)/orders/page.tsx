"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldAlert, Loader2 } from "lucide-react";
import { CustomTable } from "@/components/ui/table";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";

export default function AgentOrdersPage() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  const { data: bookingsRes, isLoading } = useGetAllBookingsQuery();
  const allBookings = (bookingsRes?.data || []) as any[];

  const columns = [
    {
      key: "id",
      header: "Order ID",
      render: (o: any) => (
        <span className="font-bold text-brand-primary">#{o.id}</span>
      )
    },
    {
      key: "user",
      header: "Client",
      render: (o: any) => (
        <div>
          <p className="font-bold text-slate-900 leading-none">{o.user?.name || "—"}</p>
          <p className="text-xs text-slate-400 mt-1">{o.user?.phone || ""}</p>
        </div>
      )
    },
    {
      key: "nestedService",
      header: "Service Info",
      render: (o: any) => <span>{o.nestedService?.name || o.pkg?.name || "—"}</span>
    },
    {
      key: "vendor",
      header: "Assigned Provider",
      render: (o: any) => <span>{o.vendor?.name || "—"}</span>
    },
    {
      key: "location",
      header: "Location",
      render: (o: any) => <span className="text-xs">{o.location || "—"}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (o: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
          o.status === "completed"
            ? "bg-emerald-50 text-emerald-700"
            : o.status === "assigned" || o.status === "on_the_way"
              ? "bg-indigo-50 text-indigo-700"
              : o.status === "cancelled"
                ? "bg-red-50 text-red-700"
                : "bg-amber-50 text-amber-700"
        }`}>
          {o.status}
        </span>
      )
    },
    {
      key: "createdAt",
      header: "Date",
      render: (o: any) => <span>{new Date(o.createdAt).toLocaleDateString("en-BD")}</span>
    }
  ];

  if (role !== "agent") {
    return <AccessDenied roleRequired="Agent" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Recent Orders</h1>
        <p className="text-slate-500 mt-1">Full transaction ledger of all bookings managed by your agent profile.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-rose-500" />
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={allBookings}
          searchKey="id"
          searchPlaceholder="Search orders by ID..."
          filterKey="status"
          filterPlaceholder="All Statuses"
          filterOptions={[
            { label: "Completed", value: "completed" },
            { label: "Assigned", value: "assigned" },
            { label: "Pending", value: "pending" },
            { label: "On the Way", value: "on_the_way" },
            { label: "Cancelled", value: "cancelled" },
          ]}
          pageSize={10}
        />
      )}
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
