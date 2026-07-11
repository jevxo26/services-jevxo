"use client";

import React from "react";
import Link from "next/link";
import { MoreVertical, Eye, ShieldCheck, XCircle, Trash2 } from "lucide-react";
import { CustomTable } from "@/components/ui/table";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  rating?: string;
}

interface UserTableProps {
  users: UserItem[];
  role: string;
  openDropdownId: string | null;
  setOpenDropdownId: (val: string | null) => void;
  handleActivate: (id: string) => void;
  handleDeactivate: (id: string) => void;
  handleBlock: (id: string) => void;
  handleDelete: (id: string) => void;
}

export default function UserTable({
  users,
  role,
  openDropdownId,
  setOpenDropdownId,
  handleActivate,
  handleDeactivate,
  handleBlock,
  handleDelete,
}: UserTableProps) {
  const columns = [
    {
      key: "name",
      header: "ইউজারের বিবরণ",
      render: (user: UserItem) => (
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
      key: "id",
      header: "আইডি",
      render: (user: UserItem) => <span className="font-mono text-slate-500 font-bold text-xs">{user.id}</span>,
    },
    {
      key: "role",
      header: "রোল",
      render: (user: UserItem) => (
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            user.role === "Customer" ? "bg-indigo-50 text-indigo-700" : "bg-teal-50 text-teal-700"
          }`}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: "joined",
      header: "যোগদানের তারিখ",
    },
    {
      key: "status",
      header: "স্ট্যাটাস",
      render: (user: UserItem) => (
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
      header: "অ্যাকশন",
      render: (user: UserItem) => (
        <div className="flex justify-end gap-1">
          <Link
            href={`/dashbord/users/${user.id}`}
            title="বিবরণ দেখুন"
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye size={16} />
          </Link>

          {user.status !== "active" && (
            <button
              onClick={() => handleActivate(user.id)}
              title="সক্রিয় করুন"
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <ShieldCheck size={16} />
            </button>
          )}

          {user.status !== "inactive" && (
            <button
              onClick={() => handleDeactivate(user.id)}
              title="নিষ্ক্রিয় করুন"
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <XCircle size={16} />
            </button>
          )}

          {user.status !== "blocked" && (
            <button
              onClick={() => handleBlock(user.id)}
              title="ব্লক করুন"
              className="p-1.5 text-slate-400 hover:text-[#E0530A] hover:bg-[#FFF8F4] rounded-lg transition-colors"
            >
              <XCircle size={16} />
            </button>
          )}

          {role !== "agent" && (
            <button
              onClick={() => handleDelete(user.id)}
              title="ডিলিট করুন"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={users}
      searchKey="name"
      searchPlaceholder="নাম দিয়ে ইউজার খুঁজুন..."
      filterKey="status"
      filterPlaceholder="সকল স্ট্যাটাস"
      filterOptions={[
        { label: "সক্রিয়", value: "active" },
        { label: "নিষ্ক্রিয়", value: "inactive" },
        { label: "ব্লকড", value: "blocked" },
      ]}
      pageSize={5}
    />
  );
}
