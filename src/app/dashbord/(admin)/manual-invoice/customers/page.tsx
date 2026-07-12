"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const API = "https://api.rajseba.com";

interface Customer { id: number; name: string; phone: string; email?: string; address: string; createdAt: string; }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"directory" | "register">("directory");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const authHeader = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "";
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/manual-customers`, { headers: authHeader() });
      if (!res.ok) throw new Error("Failed to load customers");
      setCustomers(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(""); setSuccess("");
    if (!name || !phone || !address) { setFormError("Name, phone and address are required."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/manual-customers`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ name, phone, email, address }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to save customer");
      }
      setName(""); setPhone(""); setEmail(""); setAddress("");
      setSuccess("Customer saved successfully!");
      setTab("directory");
      fetchCustomers();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API}/api/manual-customers/${id}`, { method: "DELETE", headers: authHeader() });
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch {
      setError("Failed to delete customer.");
    }
    setDeleteId(null);
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mi-container">
      <div className="mi-header">
        <div>
          <h1 className="mi-title">Client Directory</h1>
          <p className="mi-subtitle">Manage and register customers for quick invoice autofill.</p>
        </div>
        <Link href="/dashbord/manual-invoice/create" className="mi-btn mi-btn-primary">+ Create Invoice</Link>
      </div>

      {error && <div className="mi-alert mi-alert-error">{error}</div>}
      {success && <div className="mi-alert mi-alert-success">{success}</div>}

      <div className="mi-tabs">
        <button className={`mi-tab ${tab === "directory" ? "active" : ""}`} onClick={() => setTab("directory")}>👥 Client Ledger</button>
        <button className={`mi-tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>➕ Register Client</button>
      </div>

      {tab === "directory" ? (
        <div className="mi-card">
          <div className="mi-toolbar">
            <div className="mi-search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input className="mi-search-input" placeholder="Search by name, phone or email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="mi-empty"><div className="mi-spinner" /><p>Loading clients...</p></div>
          ) : filtered.length === 0 ? (
            <div className="mi-empty">
              <div className="mi-empty-icon">👤</div>
              <div className="mi-empty-title">{search ? "No results" : "No customers yet"}</div>
              <div className="mi-empty-desc">Register a new client using the Register tab.</div>
            </div>
          ) : (
            <div className="mi-table-wrap">
              <table className="mi-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700, color: "#0f172a" }}>{c.name}</td>
                      <td style={{ color: "#64748b" }}>{c.phone}</td>
                      <td style={{ color: "#64748b" }}>{c.email || "—"}</td>
                      <td style={{ color: "#64748b", maxWidth: 200 }}>{c.address}</td>
                      <td className="text-right">
                        <button
                          className="mi-btn mi-btn-ghost mi-btn-sm"
                          style={{ color: "#ef4444" }}
                          onClick={() => setDeleteId(c.id)}
                          title="Delete Customer"
                        >🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="mi-card">
            <div className="mi-card-body">
              <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Register New Client</h2>
              <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 22 }}>
                Saved clients will appear as autocomplete suggestions when creating invoices.
              </p>
              {formError && <div className="mi-alert mi-alert-error">{formError}</div>}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="mi-form-group">
                  <label className="mi-label">Full Name *</label>
                  <input className="mi-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahim Uddin" required />
                </div>
                <div className="mi-form-group">
                  <label className="mi-label">Phone *</label>
                  <input className="mi-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="01XXXXXXXXX" required />
                </div>
                <div className="mi-form-group">
                  <label className="mi-label">Email</label>
                  <input className="mi-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="optional@email.com" />
                </div>
                <div className="mi-form-group">
                  <label className="mi-label">Address *</label>
                  <textarea className="mi-textarea" value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address..." required />
                </div>
                <button type="submit" className="mi-btn mi-btn-primary" disabled={saving} style={{ width: "100%" }}>
                  {saving ? "Saving..." : "Save Client"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="mi-modal-backdrop">
          <div className="mi-modal">
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Delete Customer?</h3>
            <p style={{ color: "#64748b", fontSize: "0.88rem", marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="mi-btn mi-btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="mi-btn mi-btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
