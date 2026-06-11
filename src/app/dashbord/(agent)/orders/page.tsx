"use client";

import { useRole } from "@/context/RoleContext";
import { ShieldAlert, Search, Calendar, User, Phone, MapPin } from "lucide-react";
import { useState } from "react";

interface AgentOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  provider: string;
  price: string;
  commission: string;
  status: "Completed" | "Assigned" | "Pending Assign" | "Cancelled";
  date: string;
}

import { CustomTable } from "@/components/ui/table";

export default function AgentOrdersPage() {
  const { role } = useRole();

  const initialOrders: AgentOrder[] = [
    { id: "RS-9310", customerName: "Sayed Karim", customerPhone: "+880 1711 223344", service: "AC Leak Repair", provider: "Kabir AC Repair", price: "৳1,800", commission: "৳270", status: "Assigned", date: "Today, June 12" },
    { id: "RS-9302", customerName: "Salma Khatun", customerPhone: "+880 1819 554433", service: "Deep Sofa Clean", provider: "Clean & Bright", price: "৳2,500", commission: "৳375", status: "Completed", date: "June 11, 2026" },
    { id: "RS-9290", customerName: "Rafiqul Islam", customerPhone: "+880 1912 667788", service: "Appliance Repair", provider: "Mamun Electricians", price: "৳1,200", commission: "৳180", status: "Completed", date: "June 08, 2026" },
    { id: "RS-9240", customerName: "Kazi Nabil", customerPhone: "+880 1713 009988", service: "Wall Painting & Decor", provider: "Dhaka Decorators", price: "৳10,000", commission: "৳1,500", status: "Completed", date: "May 28, 2026" },
  ];

  const columns = [
    {
      key: "id",
      header: "Order ID",
      render: (o: AgentOrder) => (
        <span className="font-bold text-brand-primary">{o.id}</span>
      )
    },
    {
      key: "customerName",
      header: "Client",
      render: (o: AgentOrder) => (
        <div>
          <p className="font-bold text-slate-900 leading-none">{o.customerName}</p>
          <p className="text-xs text-slate-400 mt-1">{o.customerPhone}</p>
        </div>
      )
    },
    {
      key: "service",
      header: "Service Info"
    },
    {
      key: "provider",
      header: "Assigned Provider"
    },
    {
      key: "price",
      header: "Price"
    },
    {
      key: "commission",
      header: "Commission",
      render: (o: AgentOrder) => (
        <span className="font-bold text-emerald-600">+{o.commission}</span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (o: AgentOrder) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${o.status === "Completed"
            ? "bg-emerald-50 text-emerald-700"
            : o.status === "Assigned"
              ? "bg-indigo-50 text-indigo-700"
              : "bg-amber-50 text-amber-700"
          }`}>
          {o.status}
        </span>
      )
    },
    {
      key: "date",
      header: "Date"
    }
  ];

  if (role !== "agent") {
    return <AccessDenied roleRequired="Agent" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Recent Orders</h1>
        <p className="text-slate-500 mt-1">Full transaction ledger of bookings placed by your agent profile.</p>
      </div>

      <CustomTable
        columns={columns}
        data={initialOrders}
        searchKey="customerName"
        searchPlaceholder="Search orders by customer name..."
        filterKey="status"
        filterPlaceholder="All Statuses"
        filterOptions={[
          { label: "Completed", value: "Completed" },
          { label: "Assigned", value: "Assigned" },
          { label: "Pending Assign", value: "Pending Assign" }
        ]}
        pageSize={5}
      />
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
