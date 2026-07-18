"use client";

import React from "react";
import { Eye, Edit2, ShieldCheck, XCircle, Trash2 } from "lucide-react";

interface EmployeeActionMenuProps {
  user: any;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  setSelectedUser: (user: any) => void;
  setEditingEmployee: (user: any) => void;
  setIsEditModalOpen: (val: boolean) => void;
  handleActivate: (id: string) => void;
  handleDeactivate: (id: string) => void;
  handleBlock: (id: string) => void;
  handleDelete: (id: string) => void;
}

export default function EmployeeActionMenu({
  user,
  openDropdownId,
  setOpenDropdownId,
  setSelectedUser,
  setEditingEmployee,
  setIsEditModalOpen,
  handleActivate,
  handleDeactivate,
  handleBlock,
  handleDelete,
}: EmployeeActionMenuProps) {
  if (openDropdownId !== user.id) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 animate-in fade-in duration-200"
        onClick={() => setOpenDropdownId(null)}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 p-5 animate-in fade-in zoom-in-95 duration-200 text-left">
        <div className="pb-3 border-b border-slate-100 mb-3">
          <h3 className="text-sm font-extrabold text-slate-900">Employee Actions</h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{user.name}</p>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => {
              setSelectedUser(user);
              setOpenDropdownId(null);
            }}
            className="w-full text-left px-3 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Eye size={15} className="text-slate-400" /> View Details
          </button>

          <button
            onClick={() => {
              setEditingEmployee(user);
              setIsEditModalOpen(true);
              setOpenDropdownId(null);
            }}
            className="w-full text-left px-3 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Edit2 size={15} className="text-slate-400" /> Edit Details
          </button>

          {user.status !== "active" && (
            <button
              onClick={() => {
                handleActivate(user.id);
                setOpenDropdownId(null);
              }}
              className="w-full text-left px-3 py-2.5 text-xs text-emerald-600 hover:bg-emerald-50 flex items-center gap-2.5 font-semibold rounded-xl transition-all cursor-pointer"
            >
              <ShieldCheck size={15} /> Activate
            </button>
          )}

          {user.status !== "inactive" && (
            <button
              onClick={() => {
                handleDeactivate(user.id);
                setOpenDropdownId(null);
              }}
              className="w-full text-left px-3 py-2.5 text-xs text-amber-600 hover:bg-amber-50 flex items-center gap-2.5 font-semibold rounded-xl transition-all cursor-pointer"
            >
              <XCircle size={15} /> Deactivate
            </button>
          )}

          {user.status !== "blocked" && (
            <button
              onClick={() => {
                handleBlock(user.id);
                setOpenDropdownId(null);
              }}
              className="w-full text-left px-3 py-2.5 text-xs text-[#123C73] hover:bg-[#EEF2FF] flex items-center gap-2.5 font-semibold rounded-xl transition-all cursor-pointer"
            >
              <XCircle size={15} /> Block
            </button>
          )}

          <div className="h-px bg-slate-100 my-2" />

          <button
            onClick={() => {
              handleDelete(user.id);
              setOpenDropdownId(null);
            }}
            className="w-full text-left px-3 py-2.5 text-xs text-[#123C73] hover:bg-[#EEF2FF] flex items-center gap-2.5 font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>

        <button
          onClick={() => setOpenDropdownId(null)}
          className="w-full mt-4 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-2.5 rounded-xl transition-all text-center cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </>
  );
}
