"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

interface ConfirmContextType {
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolveRef = useRef<(value: boolean) => void>(null);

  const confirm = (opts?: ConfirmOptions) => {
    setOptions(opts || {});
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolveRef.current?.(false);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolveRef.current?.(true);
  };

  const {
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    variant = "danger",
  } = options;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-[24px] w-full max-w-md shadow-2xl border border-slate-100/80 overflow-hidden relative z-10 p-6 flex flex-col gap-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl flex items-center justify-center ${
                    variant === "danger" 
                      ? "bg-rose-50 text-rose-500" 
                      : variant === "warning" 
                        ? "bg-amber-50 text-amber-500" 
                        : "bg-blue-50 text-blue-500"
                  }`}>
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-950 tracking-tight">
                    {title}
                  </h3>
                </div>
                <button
                  onClick={handleCancel}
                  className="p-1.5 hover:bg-slate-50 active:scale-95 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Message */}
              <div className="text-slate-500 text-xs font-semibold leading-relaxed">
                {message}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all cursor-pointer active:scale-98"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all active:scale-[0.97] shadow-lg cursor-pointer ${
                    variant === "danger"
                      ? "bg-red-500 hover:bg-red-600 shadow-red-500/10"
                      : variant === "warning"
                        ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/10"
                        : "bg-[#FF6014] hover:bg-[#E0530A] shadow-orange-500/10"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context.confirm;
}
