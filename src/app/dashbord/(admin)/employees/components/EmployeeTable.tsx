"use client";

import React from "react";
import { Eye, Edit2, ShieldCheck, XCircle, Trash2 } from "lucide-react";
import { CustomTable } from "@/components/ui/table";

interface EmployeeItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  rating?: string;
  categoryName?: string;
  profileId?: number;
  categoryIds?: number[];
  location?: string;
  description?: string;
  min_starting_price?: number;
  google_map_link?: string;
}

interface EmployeeTableProps {
  employees: EmployeeItem[];
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  setSelectedUser: (user: EmployeeItem) => void;
  setEditingEmployee: (user: EmployeeItem) => void;
  setIsEditModalOpen: (val: boolean) => void;
  handleActivate: (id: string) => void;
  handleDeactivate: (id: string) => void;
  handleBlock: (id: string) => void;
  handleDelete: (id: string) => void;
}

export default function EmployeeTable({
  employees,
  openDropdownId,
  setOpenDropdownId,
  setSelectedUser,
  setEditingEmployee,
  setIsEditModalOpen,
  handleActivate,
  handleDeactivate,
  handleBlock,
  handleDelete,
}: EmployeeTableProps) {
  const columns = [
    {
      key: "name",
      header: "এমপ্লয়ি বিবরণ",
      render: (user: EmployeeItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center">
            {user.name.split(" ").map((n) => n[0]).join("")}
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
      header: "ক্যাটাগরি",
      render: (user: EmployeeItem) => <span className="font-bold text-slate-600 text-xs">{user.categoryName}</span>,
    },
    { key: "joined", header: "যোগদানের তারিখ" },
    {
      key: "status",
      header: "স্ট্যাটাস",
      render: (user: EmployeeItem) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            user.status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : user.status === "blocked"
              ? "bg-[#EEF2FF] text-[#4338CA]"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : ""}
        </span>
      ),
    },
    {
      key: "actions",
      header: "অ্যাকশন",
      render: (user: EmployeeItem) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => setSelectedUser(user)}
            title="বিবরণ দেখুন"
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={() => {
              setEditingEmployee(user);
              setIsEditModalOpen(true);
            }}
            title="এডিট করুন"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 size={16} />
          </button>

          {user.status !== "active" && (
            <button
              onClick={() => handleActivate(user.id)}
              title="সক্রিয় করুন"
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
            >
              <ShieldCheck size={16} />
            </button>
          )}

          {user.status !== "inactive" && (
            <button
              onClick={() => handleDeactivate(user.id)}
              title="নিষ্ক্রিয় করুন"
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            >
              <XCircle size={16} />
            </button>
          )}

          {user.status !== "blocked" && (
            <button
              onClick={() => handleBlock(user.id)}
              title="ব্লক করুন"
              className="p-1.5 text-slate-400 hover:text-[#4338CA] hover:bg-[#EEF2FF] rounded-lg transition-colors cursor-pointer"
            >
              <XCircle size={16} />
            </button>
          )}

          <button
            onClick={() => handleDelete(user.id)}
            title="ডিলিট করুন"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={employees}
      searchKey="name"
      searchPlaceholder="নাম দিয়ে এমপ্লয়ি খুঁজুন..."
      filterKey="status"
      filterPlaceholder="সকল স্ট্যাটাস"
      filterOptions={[
        { label: "সক্রিয়", value: "active" },
        { label: "নিষ্ক্রিয়", value: "inactive" },
        { label: "ব্লকড", value: "blocked" },
      ]}
      pageSize={10}
    />
  );
}
