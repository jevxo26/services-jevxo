"use client";

import React, { useState } from "react";
import { 
  useGetContactsQuery, 
  useUpdateContactStatusMutation, 
  useDeleteContactMutation 
} from "@/redux/features/admin/contact";
import { format } from "date-fns";
import { Mail, CheckCircle, Trash2, Loader2, Eye, Clock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ContactsAdminPage() {
  const { data: response, isLoading } = useGetContactsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactStatusMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [followedUpIds, setFollowedUpIds] = useState<number[]>([]);

  const handleFollowUp = (contact: any) => {
    if (!followedUpIds.includes(contact.id)) {
      setFollowedUpIds(prev => [...prev, contact.id]);
      toast.success("Mail has been sent!");
      if (!contact.isRead) {
        handleToggleRead(contact);
      }
    }
  };

  const contacts = response?.data || [];

  const handleToggleRead = async (contact: any) => {
    try {
      await updateStatus({ id: contact.id, data: { isRead: !contact.isRead } }).unwrap();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteContact(id).unwrap();
        if (selectedContact?.id === id) setSelectedContact(null);
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#FF6014]" />
            Contact Inquiries
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage and respond to customer inquiries from the public website.
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-xs flex gap-6">
          <div className="text-center">
            <div className="text-xl font-black text-slate-900">{contacts.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</div>
          </div>
          <div className="w-px bg-slate-100" />
          <div className="text-center">
            <div className="text-xl font-black text-[#FF6014]">
              {contacts.filter((c: any) => !c.isRead).length}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Unread</div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* List Section */}
        <div className={`lg:col-span-${selectedContact ? '7' : '12'} transition-all duration-300`}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-bold">No Inquiries Found</h3>
                <p className="text-slate-500 text-sm mt-1">You are all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {contacts.map((contact: any) => (
                  <div
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact);
                      if (!contact.isRead) handleToggleRead(contact);
                    }}
                    className={`
                      p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors
                      ${selectedContact?.id === contact.id ? 'bg-[#FF6014]/5 border-l-4 border-l-[#FF6014]' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}
                      ${!contact.isRead ? 'bg-slate-50/50' : 'opacity-70'}
                    `}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between md:justify-start gap-3 mb-1">
                        <h4 className={`text-sm truncate ${!contact.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                          {contact.name}
                        </h4>
                        {!contact.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#FF6014] shrink-0" />
                        )}
                      </div>
                      <p className={`text-xs truncate ${!contact.isRead ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
                        {contact.subject}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-1">
                        {contact.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
                      <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                        {format(new Date(contact.createdAt), "MMM d, h:mm a")}
                      </span>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleRead(contact)}
                          disabled={isUpdating}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title={contact.isRead ? "Mark as unread" : "Mark as read"}
                        >
                          {contact.isRead ? <Eye className="w-4 h-4" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          disabled={isDeleting}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail Section */}
        <AnimatePresence>
          {selectedContact && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-5"
            >
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 sticky top-24">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{selectedContact.name}</h3>
                    <div className="flex flex-col gap-1 mt-1">
                      <a href={`mailto:${selectedContact.email}`} className="text-sm font-semibold text-[#FF6014] hover:underline">
                        {selectedContact.email}
                      </a>
                      {selectedContact.phone && (
                        <a href={`tel:${selectedContact.phone}`} className="text-sm text-slate-500 hover:text-slate-700">
                          {selectedContact.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-[10px] uppercase font-bold text-slate-400 hover:text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg"
                  >
                    Close
                  </button>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100/50">
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 text-sm">{selectedContact.subject}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 bg-white px-2.5 py-1 rounded-md border border-slate-100 shadow-xs">
                      <Clock className="w-3 h-3" />
                      {format(new Date(selectedContact.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="flex-1 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 px-4 rounded-xl text-center transition-colors shadow-sm"
                  >
                    Open Mail App
                  </a>
                  
                  <button
                    onClick={() => handleFollowUp(selectedContact)}
                    disabled={followedUpIds.includes(selectedContact.id)}
                    className={`flex-1 w-full flex justify-center items-center gap-2 text-xs font-bold py-3 px-4 rounded-xl transition-colors shadow-sm ${
                      followedUpIds.includes(selectedContact.id)
                        ? "bg-emerald-50 text-emerald-600 cursor-default"
                        : "bg-[#FF6014] hover:bg-[#e84e53] text-white"
                    }`}
                  >
                    {followedUpIds.includes(selectedContact.id) ? (
                      <>
                        <Check className="w-4 h-4" />
                        Mail Sent (Followed Up)
                      </>
                    ) : (
                      "Mark as Followed Up"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
