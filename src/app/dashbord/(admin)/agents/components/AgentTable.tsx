"use client";

import React from "react";
import { MoreVertical } from "lucide-react";
import { CustomTable } from "@/components/ui/table";

interface AgentItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  rating?: string;
  categoryName?: string;
  companyName?: string;
  location?: string;
  description?: string;
  shop_image1?: string;
  shop_image2?: string;
  nid_number?: string;
  nid_front?: string;
  nid_back?: string;
  devision?: string;
  district?: string;
  area?: string;
}

interface AgentTableProps {
  agents: AgentItem[];
  openDropdownId: string | null;
  setOpenDropdownId: (val: string | null) => void;
  setSelectedUser: (val: AgentItem | null) => void;
  handleActivate: (id: string) => void;
  handleDeactivate: (id: string) => void;
  handleBlock: (id: string) => void;
  handleDelete: (id: string) => void;
}

export default function AgentTable({
  agents,
  openDropdownId,
  setOpenDropdownId,
  setSelectedUser,
  handleActivate,
  handleDeactivate,
  handleBlock,
  handleDelete,
}: AgentTableProps) {
  const columns = [
    {
      key: "name",
      header: "Agent Details",
      render: (user: AgentItem) => (
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
      key: "companyName",
      header: "Company Name",
      render: (user: AgentItem) => <span className="font-bold text-slate-700 text-xs">{user.companyName}</span>,
    },
    {
      key: "nid_number",
      header: "NID Number",
      render: (user: AgentItem) => <span className="font-bold text-slate-600 text-xs">{user.nid_number || "N/A"}</span>,
    },
    {
      key: "devision",
      header: "Territory Region",
      render: (user: AgentItem) => (
        <span className="font-bold text-slate-500 text-xs">
          {user.devision && user.devision !== "N/A" ? `${user.devision} / ${user.district} / ${user.area}` : "Not Set"}
        </span>
      ),
    },
    { key: "joined", header: "Joined Date" },
    {
      key: "status",
      header: "Status",
      render: (user: AgentItem) => (
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
      render: (user: AgentItem) => (
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
                    setSelectedUser(user);
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  View Details
                </button>
                {user.status !== "active" && (
                  <button
                    onClick={() => {
                      handleActivate(user.id);
                      setOpenDropdownId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 font-medium"
                  >
                    Activate
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
                    Deactivate
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
                    Block
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
                  Delete
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
      data={agents}
      searchKey="name"
      searchPlaceholder="Search agents by name..."
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
