"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const API = "https://api.rajseba.com";

interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  customer: { name: string; phone: string; address: string };
  totalPayableAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "Paid" | "Due";
  templateName: string;
  createdAt: string;
}

const fmt = (n: number) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 });

const fmtDate = (d: string) => {
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch { return d; }
};

export default function ManualInvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Paid" | "Due">("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token") || "";
      const res = await fetch(`${API}/api/manual-invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();
      setInvoices(data);
    } catch (err: any) {
      setError(err.message || "Could not load invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token") || "";
      await fetch(`${API}/api/manual-invoices/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch {
      setError("Failed to move invoice to trash.");
    }
    setDeleteConfirmId(null);
  };

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.phone.includes(search);
    const matchesFilter = filter === "all" || inv.paymentStatus === filter;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = invoices.reduce((s, i) => s + Number(i.totalPayableAmount), 0);
  const totalPaid = invoices.reduce((s, i) => s + Number(i.paidAmount), 0);
  const totalDue = invoices.reduce((s, i) => s + Number(i.dueAmount), 0);
  const countPaid = invoices.filter((i) => i.paymentStatus === "Paid").length;
  const countDue = invoices.filter((i) => i.paymentStatus === "Due").length;

  return (
    <div className="mi-container">
      {/* Header */}
      <div className="mi-header mi-no-print">
        <div>
          <h1 className="mi-title">Manual Invoice Dashboard</h1>
          <p className="mi-subtitle">Manage all your manual invoices, track payments and due amounts.</p>
        </div>
        <Link href="/dashbord/manual-invoice/create" className="mi-btn mi-btn-primary">
          + Create Invoice
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mi-stats-grid mi-no-print">
        <div className="mi-stat-card">
          <div className="mi-stat-label">Total Invoices</div>
          <div className="mi-stat-value">{invoices.length}</div>
          <div className="mi-stat-sub">{countPaid} paid · {countDue} due</div>
        </div>
        <div className="mi-stat-card">
          <div className="mi-stat-label">Total Revenue</div>
          <div className="mi-stat-value" style={{ color: "#FF6014" }}>{fmt(totalRevenue)}</div>
          <div className="mi-stat-sub">BDT · all invoices</div>
        </div>
        <div className="mi-stat-card">
          <div className="mi-stat-label">Total Collected</div>
          <div className="mi-stat-value" style={{ color: "#15803d" }}>{fmt(totalPaid)}</div>
          <div className="mi-stat-sub">BDT · paid amount</div>
        </div>
        <div className="mi-stat-card">
          <div className="mi-stat-label">Outstanding Due</div>
          <div className="mi-stat-value" style={{ color: "#c2410c" }}>{fmt(totalDue)}</div>
          <div className="mi-stat-sub">BDT · pending collection</div>
        </div>
      </div>

      {/* Invoices table */}
      <div className="mi-card mi-no-print">
        {/* Toolbar */}
        <div className="mi-toolbar">
          <div className="mi-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="mi-search-input"
              placeholder="Search by invoice #, customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="mi-filter-pills">
            {(["all", "Paid", "Due"] as const).map((f) => (
              <button key={f} className={`mi-pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {error && <div className="mi-alert mi-alert-error" style={{ margin: "16px 20px" }}>⚠️ {error}</div>}

        {loading ? (
          <div className="mi-empty"><div className="mi-spinner" /><p>Loading invoices...</p></div>
        ) : filtered.length === 0 ? (
          <div className="mi-empty">
            <div className="mi-empty-icon">📄</div>
            <div className="mi-empty-title">{search || filter !== "all" ? "No results found" : "No invoices yet"}</div>
            <div className="mi-empty-desc">
              {search || filter !== "all" ? "Try adjusting your search or filter." : "Click \"Create Invoice\" to get started."}
            </div>
          </div>
        ) : (
          <div className="mi-table-wrap">
            <table className="mi-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total (BDT)</th>
                  <th>Paid (BDT)</th>
                  <th>Due (BDT)</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 700, color: "#FF6014" }}>{inv.invoiceNumber}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{inv.customer.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{inv.customer.phone}</div>
                    </td>
                    <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>{fmtDate(inv.date)}</td>
                    <td style={{ fontWeight: 700 }}>{fmt(inv.totalPayableAmount)}</td>
                    <td style={{ color: "#15803d", fontWeight: 600 }}>{fmt(inv.paidAmount)}</td>
                    <td style={{ color: inv.dueAmount > 0 ? "#c2410c" : "#64748b", fontWeight: 600 }}>
                      {fmt(inv.dueAmount)}
                    </td>
                    <td>
                      <span className={`mi-badge ${inv.paymentStatus === "Paid" ? "mi-badge-paid" : "mi-badge-due"}`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="text-right">
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Link href={`/dashbord/manual-invoice/invoice/${inv.id}`} className="mi-btn mi-btn-secondary mi-btn-sm">
                          View
                        </Link>
                        <button
                          className="mi-btn mi-btn-ghost mi-btn-sm"
                          style={{ color: "#ef4444" }}
                          onClick={() => setDeleteConfirmId(inv.id)}
                          title="Move to Trash"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="mi-no-print" style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
        <Link href="/dashbord/manual-invoice/customers" className="mi-btn mi-btn-secondary">
          👥 Client Directory
        </Link>
        <Link href="/dashbord/manual-invoice/services" className="mi-btn mi-btn-secondary">
          ⚙️ Service Catalog
        </Link>
        <Link href="/dashbord/manual-invoice/trash" className="mi-btn mi-btn-secondary">
          🗑️ Trash Bin
        </Link>
      </div>

      {/* Delete confirm modal */}
      {deleteConfirmId !== null && (
        <div className="mi-modal-backdrop">
          <div className="mi-modal">
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Move to Trash?</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: 24, lineHeight: 1.6 }}>
              The invoice will be moved to the trash bin and can be restored within 14 days.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="mi-btn mi-btn-secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button className="mi-btn mi-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>Move to Trash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
