"use client";

import React, { useState } from "react";
import {
  useGetContactsQuery,
  useGetContactByIdQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation
} from "@/redux/features/admin/contact";
import { format } from "date-fns";
import { Mail, CheckCircle, Trash2, Loader2, Clock, Check, ArrowLeft, User, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/context/ConfirmDialogContext";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ContactDetailsPage({ params }: PageProps) {
  const confirm = useConfirm();
  const router = useRouter();
  const resolvedParams = React.use(params);
  const contactId = resolvedParams.id;

  // Try direct single query first
  const { data: directRes, isLoading: isDirectLoading, error: directError } = useGetContactByIdQuery(contactId);
  // Fallback list query in case direct API is not implemented or fails
  const { data: listRes, isLoading: isListLoading } = useGetContactsQuery(undefined, {
    skip: !directError && !!directRes
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactStatusMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
  const [followedUp, setFollowedUp] = useState(false);

  // Determine the contact data
  const contact = directRes?.data || listRes?.data?.find((c: any) => String(c.id) === String(contactId));
  const isLoading = isDirectLoading || (!!directError && isListLoading);

  const handleToggleRead = async () => {
    if (!contact) return;
    try {
      await updateStatus({ id: contact.id, data: { isRead: !contact.isRead } }).unwrap();
      toast.success(contact.isRead ? "Marked as unread" : "Marked as read");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleFollowUp = async () => {
    if (!contact) return;
    setFollowedUp(true);
    toast.success("Follow-up response email initiated!");
    if (!contact.isRead) {
      try {
        await updateStatus({ id: contact.id, data: { isRead: true } }).unwrap();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDelete = async () => {
    if (!contact) return;
    const isConfirmed = await confirm({
      title: "Delete Inquiry?",
      message: `Are you sure you want to delete this inquiry from "${contact.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!isConfirmed) return;
    try {
      await deleteContact(contact.id).unwrap();
      toast.success("Inquiry deleted successfully");
      router.push("/dashbord/contacts");
    } catch (error) {
      toast.error("Failed to delete inquiry");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading inquiry details...</p>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center max-w-md mx-auto p-4">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 shadow-sm">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">Inquiry Not Found</h2>
        <p className="text-xs text-slate-400 font-semibold leading-relaxed">
          The inquiry you are looking for does not exist or may have been deleted.
        </p>
        <button
          onClick={() => router.push("/dashbord/contacts")}
          className="flex items-center gap-2 text-xs font-bold bg-[#FF6014] text-white px-5 py-2.5 rounded-xl hover:bg-[#E0530A] transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inquiries
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/dashbord/contacts")}
          className="group flex items-center gap-2 text-xs font-bold text-slate-650 hover:text-[#FF6014] transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Inquiries List
        </button>

        <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-xl">
          Inquiry ID: <span className="text-[#FF6014]">#{contact.id}</span>
        </span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Sender Card & Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 relative overflow-hidden">
            {/* Top border decoration */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF6014] to-[#FF8142]" />

            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6014] to-[#FF8142] rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-[#FF6014]/15">
                {contact.name?.charAt(0) || "U"}
              </div>

              <div className="space-y-1">
                <h3 className="font-black text-slate-900 text-lg leading-tight">{contact.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] uppercase font-black tracking-wider ${contact.isRead ? "bg-slate-550/10 text-slate-550 border border-slate-200/30" : "bg-[#FFF8F4] text-[#FF6014] border border-[#FF6014]/20"
                  }`}>
                  {contact.isRead ? "Read Inquiry" : "New / Unread"}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email:</span>
                <a href={`mailto:${contact.email}`} className="text-[#FF6014] hover:underline font-bold">
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Phone:</span>
                <a href={`tel:${contact.phone}`} className="text-slate-800 hover:text-[#FF6014] transition-colors">
                  {contact.phone || "Not Provided"}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Received:</span>
                <span className="text-slate-800">
                  {format(new Date(contact.createdAt), "MMM d, yyyy h:mm a")}
                </span>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-3 relative overflow-hidden">
            <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-2">Actions</h4>

            <a
              href={`mailto:${contact.email}`}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-3 px-4 rounded-xl text-center transition-all border border-slate-200/50 flex items-center justify-center gap-2 shadow-2xs"
            >
              Open Mail Client
            </a>

            <button
              onClick={handleFollowUp}
              disabled={followedUp}
              className={`w-full flex justify-center items-center gap-2 text-xs font-extrabold py-3 px-4 rounded-xl transition-all shadow-sm ${followedUp
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-250 cursor-default"
                  : "bg-[#FF6014] hover:bg-[#E0530A] text-white"
                }`}
            >
              {followedUp ? (
                <>
                  <Check className="w-4 h-4" />
                  Marked (Mail Sent)
                </>
              ) : (
                "Mark as Followed Up"
              )}
            </button>

            <button
              onClick={handleToggleRead}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-2xs"
            >
              {contact.isRead ? "Mark as Unread" : "Mark as Read"}
            </button>

            <button
              onClick={handleDelete}
              className="w-full bg-rose-550/10 hover:bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Inquiry
            </button>
          </div>
        </div>

        {/* Right Side: Message Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 md:p-8 relative overflow-hidden">
            {/* Top border decoration */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-[#FF6014]" />

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black text-[#FF6014] tracking-widest block">
                  Subject Line
                </span>
                <h2 className="text-xl font-black text-slate-900 leading-snug">
                  {contact.subject}
                </h2>
              </div>

              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 shadow-inner min-h-[220px] text-sm text-slate-750 leading-relaxed whitespace-pre-wrap font-medium">
                {contact.message}
              </div>
            </div>
          </div>

          {/* Premium Help Card */}
          <div className="bg-[#FFF8F4] rounded-3xl border border-[#FF6014]/15 p-6 flex items-start gap-4 shadow-sm">
            <div className="p-3 bg-white rounded-2xl shadow-xs text-[#FF6014] shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900">Inquiry Follow Up Guidelines</h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                When responding to inquiries, please use the registered client address to send a secure and brand-aligned email response. Ensure that the status is updated to "Read" or marked as "Followed Up" to keep tracking state sync'd.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

