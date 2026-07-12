"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const API = "https://api.rajseba.com";

interface ServiceItem { id: number; name: string; rate: number; createdAt: string; }

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"directory" | "register">("directory");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const authHeader = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "";
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/manual-services`, { headers: authHeader() });
      if (!res.ok) throw new Error("Failed to load services");
      setServices(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(""); setSuccess("");
    if (!name || rate === "") { setFormError("Service name and rate are required."); return; }
    if (Number(rate) < 0) { setFormError("Rate cannot be negative."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/manual-services`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ name, rate: Number(rate) }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to save service");
      }
      setName(""); setRate("");
      setSuccess("Service saved successfully!");
      setTab("directory");
      fetchServices();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API}/api/manual-services/${id}`, { method: "DELETE", headers: authHeader() });
      setServices(prev => prev.filter(s => s.id !== id));
    } catch {
      setError("Failed to delete service.");
    }
    setDeleteId(null);
  };

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mi-container">
      <div className="mi-header">
        <div>
          <h1 className="mi-title">Services & Rates Catalog</h1>
          <p className="mi-subtitle">Pre-configure default rates to speed up invoice creation.</p>
        </div>
        <Link href="/dashbord/manual-invoice/create" className="mi-btn mi-btn-primary">+ Create Invoice</Link>
      </div>

      {error && <div className="mi-alert mi-alert-error">{error}</div>}
      {success && <div className="mi-alert mi-alert-success">{success}</div>}

      <div className="mi-tabs">
        <button className={`mi-tab ${tab === "directory" ? "active" : ""}`} onClick={() => setTab("directory")}>📂 Catalog Services</button>
        <button className={`mi-tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>➕ Register Service</button>
      </div>

      {tab === "directory" ? (
        <div className="mi-card">
          <div className="mi-toolbar">
            <div className="mi-search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input className="mi-search-input" placeholder="Search by service name..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="mi-empty"><div className="mi-spinner" /><p>Loading services...</p></div>
          ) : filtered.length === 0 ? (
            <div className="mi-empty">
              <div className="mi-empty-icon">⚙️</div>
              <div className="mi-empty-title">{search ? "No results" : "No services yet"}</div>
              <div className="mi-empty-desc">Register a service in the Register tab to see it here.</div>
            </div>
          ) : (
            <div className="mi-table-wrap">
              <table className="mi-table">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>Icon</th>
                    <th>Service / Description</th>
                    <th>Billing Rate (BDT)</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>⚙️</div>
                      </td>
                      <td style={{ fontWeight: 600, color: "#0f172a" }}>{s.name}</td>
                      <td style={{ fontWeight: 700, color: "#FF6014" }}>
                        {Number(s.rate).toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
                        <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "#94a3b8" }}>BDT</span>
                      </td>
                      <td className="text-right">
                        <button className="mi-btn mi-btn-ghost mi-btn-sm" style={{ color: "#ef4444" }} onClick={() => setDeleteId(s.id)} title="Delete Service">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div className="mi-card">
            <div className="mi-card-body">
              <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Register Catalog Service</h2>
              <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 22 }}>
                Add a service and its rate. It will appear as autocomplete in the invoice builder.
              </p>
              {formError && <div className="mi-alert mi-alert-error">{formError}</div>}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="mi-form-group">
                  <label className="mi-label">Service Name / Description *</label>
                  <textarea className="mi-textarea" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Logo Design for Brand Identity" required />
                </div>
                <div className="mi-form-group">
                  <label className="mi-label">Default Billing Rate (BDT) *</label>
                  <input className="mi-input" type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 5000" min="0" step="0.01" required />
                </div>
                <button type="submit" className="mi-btn mi-btn-primary" disabled={saving} style={{ width: "100%" }}>
                  {saving ? "Saving..." : "Save Catalog Item"}
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
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Delete Service?</h3>
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
