"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const API = "https://api.rajseba.com";

interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  customer: { name: string; phone: string };
  totalPayableAmount: number;
  deletedAt?: string;
}

const fmtDate = (d: string) => {
  try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return d; }
};

const daysRemaining = (deletedAt?: string) => {
  if (!deletedAt) return "Unknown";
  const expiry = new Date(new Date(deletedAt).getTime() + 14 * 24 * 60 * 60 * 1000);
  const diff = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? `${diff} days left` : "Expiring soon";
};

export default function TrashPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState<{ id: number; type: "restore" | "force" } | null>(null);

  const authHeader = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "";
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  };

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/manual-invoices/trash`, { headers: authHeader() });
      if (!res.ok) throw new Error("Failed to load trashed invoices");
      setInvoices(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrash(); }, []);

  const handleRestore = async (id: number) => {
    try {
      await fetch(`${API}/api/manual-invoices/${id}/restore`, { method: "PUT", headers: authHeader() });
      setInvoices(prev => prev.filter(i => i.id !== id));
    } catch {
      setError("Failed to restore invoice.");
    }
    setConfirm(null);
  };

  const handleForceDelete = async (id: number) => {
    try {
      await fetch(`${API}/api/manual-invoices/${id}/force`, { method: "DELETE", headers: authHeader() });
      setInvoices(prev => prev.filter(i => i.id !== id));
    } catch {
      setError("Failed to permanently delete invoice.");
    }
    setConfirm(null);
  };

  const filtered = invoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer.phone.includes(search)
  );

  return (
    <div className="mi-container">
      <div className="mi-header">
        <div>
          <h1 className="mi-title">Trash Bin</h1>
          <p className="mi-subtitle">Deleted invoices are kept here for 14 days before automatic removal.</p>
        </div>
        <Link href="/dashbord/manual-invoice" className="mi-btn mi-btn-secondary">← Dashboard</Link>
      </div>

      {error && <div className="mi-alert mi-alert-error">{error}</div>}

      <div className="mi-card">
        <div className="mi-toolbar">
          <div className="mi-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input className="mi-search-input" placeholder="Search trashed invoices..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="mi-empty"><div className="mi-spinner" /><p>Loading trashed invoices...</p></div>
        ) : filtered.length === 0 ? (
          <div className="mi-empty">
            <div className="mi-empty-icon">🗑️</div>
            <div className="mi-empty-title">Trash is empty</div>
            <div className="mi-empty-desc">{search ? "No results match your search." : "No deleted invoices found."}</div>
          </div>
        ) : (
          <div className="mi-table-wrap">
            <table className="mi-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Deleted On</th>
                  <th>Time Remaining</th>
                  <th className="text-right">Amount (BDT)</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 700, color: "#94a3b8" }}>{inv.invoiceNumber}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{inv.customer.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{inv.customer.phone}</div>
                    </td>
                    <td style={{ color: "#64748b" }}>{fmtDate(inv.date)}</td>
                    <td style={{ color: "#64748b" }}>{inv.deletedAt ? fmtDate(inv.deletedAt) : "—"}</td>
                    <td>
                      <span style={{ color: "#fb923c", fontWeight: 600, fontSize: "0.82rem" }}>
                        ⏳ {daysRemaining(inv.deletedAt)}
                      </span>
                    </td>
                    <td className="text-right" style={{ fontWeight: 600, color: "#64748b" }}>
                      {Number(inv.totalPayableAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-right">
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          className="mi-btn mi-btn-secondary mi-btn-sm"
                          style={{ color: "#15803d", borderColor: "rgba(21,128,61,.3)" }}
                          onClick={() => setConfirm({ id: inv.id, type: "restore" })}
                        >♻️ Restore</button>
                        <button
                          className="mi-btn mi-btn-secondary mi-btn-sm"
                          style={{ color: "#ef4444", borderColor: "rgba(239,68,68,.3)" }}
                          onClick={() => setConfirm({ id: inv.id, type: "force" })}
                        >Delete Forever</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirm && (
        <div className="mi-modal-backdrop">
          <div className="mi-modal">
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>{confirm.type === "restore" ? "♻️" : "⚠️"}</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
              {confirm.type === "restore" ? "Restore Invoice?" : "Permanently Delete?"}
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.88rem", marginBottom: 24, lineHeight: 1.6 }}>
              {confirm.type === "restore"
                ? "The invoice will be moved back to the main dashboard."
                : "This action cannot be undone. The invoice will be permanently removed."}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="mi-btn mi-btn-secondary" onClick={() => setConfirm(null)}>Cancel</button>
              <button
                className="mi-btn mi-btn-primary"
                style={confirm.type === "force" ? { background: "linear-gradient(135deg,#ef4444,#dc2626)", boxShadow: "0 4px 12px rgba(239,68,68,.25)" } : {}}
                onClick={() => confirm.type === "restore" ? handleRestore(confirm.id) : handleForceDelete(confirm.id)}
              >
                {confirm.type === "restore" ? "Restore" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
