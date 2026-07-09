"use client";

import React, { useState } from "react";
import { 
  useGetContactsQuery, 
  useUpdateContactStatusMutation, 
  useDeleteContactMutation 
} from "@/redux/features/admin/contact";
import { format } from "date-fns";
import { Mail, CheckCircle, Trash2, Loader2, Eye, Clock, Check } from "lucide-react";
import { toast } from "sonner";
import { CustomTable, TableColumn } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function ContactsAdminPage() {
  const router = useRouter();
  const { data: response, isLoading } = useGetContactsQuery();
  const lang = useAppSelector((state) => state.lang.value);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactStatusMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  const contacts = response?.data || [];

  const handleToggleRead = async (contact: any) => {
    try {
      await updateStatus({ id: contact.id, data: { isRead: !contact.isRead } }).unwrap();
      toast.success(contact.isRead ? "Marked as unread" : "Marked as read");
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteContact(id).unwrap();
        toast.success("Inquiry deleted successfully");
      } catch (error) {
        toast.error("Failed to delete inquiry");
        console.error("Failed to delete", error);
      }
    }
  };

  const columns: TableColumn<any>[] = [
    {
      key: "name",
      header: lang === "bn" ? "নাম" : "Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.isRead && <span className="w-2 h-2 rounded-full bg-[#FF6014] shrink-0" />}
          <span className={`text-xs ${!row.isRead ? "font-black text-slate-900" : "font-bold text-slate-650"}`}>
            {row.name}
          </span>
        </div>
      )
    },
    {
      key: "email",
      header: lang === "bn" ? "ইমেইল" : "Email",
      render: (row) => (
        <a href={`mailto:${row.email}`} className="text-xs font-bold text-slate-650 hover:text-[#FF6014] transition-colors">
          {row.email}
        </a>
      )
    },
    {
      key: "phone",
      header: lang === "bn" ? "ফোন" : "Phone",
      render: (row) => (
        <span className="text-xs font-semibold text-slate-500">{row.phone || "N/A"}</span>
      )
    },
    {
      key: "subject",
      header: lang === "bn" ? "বিষয়" : "Subject",
      render: (row) => (
        <span className="text-xs font-bold text-slate-700 truncate max-w-[180px] block">
          {row.subject}
        </span>
      )
    },
    {
      key: "createdAt",
      header: lang === "bn" ? "জমার সময়" : "Submitted At",
      render: (row) => (
        <span className="text-xs font-semibold text-slate-400">
          {format(new Date(row.createdAt), "MMM d, yyyy")}
        </span>
      )
    },
    {
      key: "isRead",
      header: "Status",
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold tracking-wider ${
          row.isRead ? "bg-slate-100 text-slate-550 border border-slate-200/50" : "bg-[#FFF8F4] text-[#FF6014] border border-[#FF6014]/20"
        }`}>
          {row.isRead ? (lang === "bn" ? "পড়া হয়েছে" : "Read") : (lang === "bn" ? "অপঠিত" : "Unread")}
        </span>
      )
    }
  ];

  const actions = [
    {
      label: lang === "bn" ? "বিস্তারিত দেখুন" : "View Details",
      icon: Eye,
      onClick: (row: any) => {
        router.push(`/dashbord/contacts/${row.id}`);
      }
    },
    {
      label: lang === "bn" ? "পঠিত/অপঠিত" : "Toggle Read",
      icon: CheckCircle,
      onClick: (row: any) => {
        handleToggleRead(row);
      }
    },
    {
      label: lang === "bn" ? "মুছুন" : "Delete",
      icon: Trash2,
      variant: "destructive" as const,
      onClick: (row: any) => {
        handleDelete(row.id);
      }
    }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FFF8F4] border border-[#FF6014]/20 rounded-2xl shadow-xs shrink-0">
              <Mail className="w-5 h-5 text-[#FF6014]" />
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{lang === "bn" ? "যোগাযোগ সমূহ" : "Contact Inquiries"}</h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium pl-14">{lang === "bn" ? "সর্বসাধারণের যোগাযোগ রিকোয়েস্ট দেখুন এবং সাড়া দিন।" : "Manage and respond to customer inquiries from the public website."}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm border border-slate-100 rounded-2xl px-6 py-3.5 shadow-sm flex gap-8 shrink-0 w-full md:w-auto justify-around md:justify-start">
          <div className="text-center md:text-left">
            <div className="text-xl font-black text-slate-900 leading-none mb-1">{contacts.length}</div>
            <div className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">{lang === "bn" ? "মোট" : "Total"}</div>
          </div>
          <div className="w-px bg-slate-100" />
          <div className="text-center md:text-left">
            <div className="text-xl font-black text-[#FF6014] leading-none mb-1">
              {contacts.filter((c: any) => !c.isRead).length}
            </div>
            <div className="text-[9px] uppercase font-extrabold text-[#FF6014] tracking-wider">{lang === "bn" ? "অপঠিত" : "Unread"}</div>
          </div>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden w-full">
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
          </div>
        ) : (
          <CustomTable
            columns={columns}
            data={contacts}
            actions={actions}
            searchKey="name"
            searchPlaceholder={lang === "bn" ? "নাম দিয়ে খুঁজুন..." : "Search by name..."}
            filterKey="isRead"
            filterPlaceholder="All Statuses"
            filterOptions={[
              { label: lang === "bn" ? "পঠিত রিকোয়েস্ট" : "Read Inquiries", value: "true" },
              { label: lang === "bn" ? "অপঠিত রিকোয়েস্ট" : "Unread Inquiries", value: "false" }
            ]}
            pageSize={10}
          />
        )}
      </div>
    </div>
  );
}
