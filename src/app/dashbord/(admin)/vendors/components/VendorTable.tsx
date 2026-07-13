"use client";

import React from "react";
import { MoreVertical, Eye, Edit, ShieldCheck, XCircle, Trash2 } from "lucide-react";
import { CustomTable } from "@/components/ui/table";

interface VendorItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  categoryName?: string;
  profile?: any;
  commission_percentage: number;
  wallet_balance: number;
}

interface VendorTableProps {
  vendors: VendorItem[];
  openDropdownId: string | null;
  setOpenDropdownId: (val: string | null) => void;
  onViewDetails: (id: string) => void;
  onEditVendor: (vendor: VendorItem) => void;
  handleActivate: (id: string) => void;
  handleDeactivate: (id: string) => void;
  handleBlock: (id: string) => void;
  handleDelete: (id: string) => void;
}

export default function VendorTable({
  vendors,
  openDropdownId,
  setOpenDropdownId,
  onViewDetails,
  onEditVendor,
  handleActivate,
  handleDeactivate,
  handleBlock,
  handleDelete,
}: VendorTableProps) {
  const columns = [
    {
      key: "name",
      header: "Vendor Details",
      render: (user: VendorItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">{user.name}</p>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
            {user.phone && user.phone !== "No Phone" && (
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{user.phone}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "categoryName",
      header: "Category",
      render: (vendor: VendorItem) => (
        <div className="flex flex-wrap gap-1">
          {vendor.profile?.categories?.length > 0 ? (
            vendor.profile.categories.map((cat: any) => (
              <span
                key={cat.id}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                {cat.name}
              </span>
            ))
          ) : (
            <span className="text-slate-400 italic font-normal text-xs">{vendor.categoryName}</span>
          )}
        </div>
      ),
    },
    {
      key: "wallet",
      header: "Wallet & Comm.",
      render: (vendor: VendorItem) => (
        <div>
          <p className="font-bold text-slate-900 text-sm">৳{(vendor.wallet_balance || 0).toLocaleString()}</p>
          <p className="text-xs text-slate-500 font-medium">{vendor.commission_percentage || 0}% Comm.</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user: VendorItem) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            user.status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : user.status === "blocked"
              ? "bg-[#FFF8F4] text-[#E0530A]"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : ""}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: VendorItem) => (
        <div className="relative flex justify-end">
          <button
            onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <MoreVertical size={16} />
          </button>

          {openDropdownId === user.id && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    onViewDetails(user.id);
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Eye size={14} className="text-slate-400" /> View Details
                </button>

                <button
                  onClick={() => {
                    onEditVendor(user);
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Edit size={14} className="text-slate-400" /> Edit Vendor
                </button>

                {user.status !== "active" && (
                  <button
                    onClick={() => {
                      handleActivate(user.id);
                      setOpenDropdownId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 font-medium"
                  >
                    <ShieldCheck size={14} /> Activate
                  </button>
                )}

                {user.status !== "inactive" && (
                  <button
                    onClick={() => {
                      handleDeactivate(user.id);
                      setOpenDropdownId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2 font-medium"
                  >
                    <XCircle size={14} /> Deactivate
                  </button>
                )}

                {user.status !== "blocked" && (
                  <button
                    onClick={() => {
                      handleBlock(user.id);
                      setOpenDropdownId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#E0530A] hover:bg-[#FFF8F4] flex items-center gap-2 font-medium"
                  >
                    <XCircle size={14} /> Block
                  </button>
                )}

                <div className="h-px bg-slate-100 my-1 mx-2" />

                <button
                  onClick={() => {
                    handleDelete(user.id);
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#E0530A] hover:bg-[#FFF8F4] flex items-center gap-2 font-medium"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={vendors}
      rowClassName={(row) => row.id === openDropdownId ? "relative z-30" : ""}
      searchKey="name"
      searchPlaceholder="Search vendors by name..."
      filterKey="status"
      filterPlaceholder="All Statuses"
      filterOptions={[
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Blocked", value: "blocked" },
      ]}
      pageSize={10}
    />
  );
}
