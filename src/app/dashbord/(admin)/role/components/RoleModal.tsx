"use client";

import React from "react";
import { XCircle } from "lucide-react";

interface RoleModalProps {
  setIsAddModalOpen: (val: boolean) => void;
  selectedPermissions: string[];
  setSelectedPermissions: (val: string[]) => void;
  handleCreateRole: (e: React.FormEvent<HTMLFormElement>) => void;
  AVAILABLE_PERMISSIONS: string[];
}

export default function RoleModal({
  setIsAddModalOpen,
  selectedPermissions,
  setSelectedPermissions,
  handleCreateRole,
  AVAILABLE_PERMISSIONS,
}: RoleModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Add New Role</h2>
          <button
            onClick={() => {
              setIsAddModalOpen(false);
              setSelectedPermissions([]);
            }}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-all"
          >
            <XCircle size={24} />
          </button>
        </div>
        <form onSubmit={handleCreateRole} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Role Name</label>
            <select
              name="name"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#1E4E8C]/40 focus:ring-2 focus:ring-rose-100 transition-all"
            >
              <option value="" disabled selected>
                Select Role Name
              </option>
              <option value="Super Admin">Super Admin</option>
              <option value="Agent">Agent</option>
              <option value="Vendor">Vendor</option>
              <option value="Employee">Employee</option>
              <option value="Client">Client</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Permissions</label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <label key={permission} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/30 transition-all cursor-pointer"
                    checked={selectedPermissions.includes(permission)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([...selectedPermissions, permission]);
                      } else {
                        setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
                      }
                    }}
                  />
                  <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                    {permission.replace(/_/g, " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setSelectedPermissions([]);
              }}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-xl transition-all"
            >
              Save Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
