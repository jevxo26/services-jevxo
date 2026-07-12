"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const API = "https://api.rajseba.com";

interface Customer { id: number; name: string; phone: string; email?: string; address: string; }
interface ServiceItem { id: number; name: string; rate: number; }
interface LineItem { description: string; qty: number; rate: number; amount: number; }

const EMPTY_ITEM: LineItem = { description: "", qty: 1, rate: 0, amount: 0 };
const DEFAULT_PO = { accountName: "RAJSEBA.COM", accountNumber: "02433002451", bankName: "Bank Asia PLC", branch: "Rajshahi Branch", routingNumber: "070811937" };

function toWords(n: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (n === 0) return "Zero";
  const convert = (num: number): string => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
    if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + convert(num % 100) : "");
    if (num < 100000) return convert(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + convert(num % 1000) : "");
    if (num < 10000000) return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + convert(num % 100000) : "");
    return convert(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + convert(num % 10000000) : "");
  };
  const whole = Math.floor(n);
  return convert(whole) + " Taka Only";
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Customer form
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [custSuggestions, setCustSuggestions] = useState<Customer[]>([]);
  const [showCustDrop, setShowCustDrop] = useState(false);

  // Invoice meta
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [templateName, setTemplateName] = useState<"template1" | "template2">("template1");
  const [discount, setDiscount] = useState(0);
  const [signeeName, setSigneeName] = useState("Ariful Islam Arif");
  const [signeeRole, setSigneeRole] = useState("CEO, Rajseba Design Studio");

  // Items
  const [items, setItems] = useState<LineItem[]>([{ ...EMPTY_ITEM }]);
  const [svcSuggestions, setSvcSuggestions] = useState<ServiceItem[][]>([[]]);
  const [showSvcDrop, setShowSvcDrop] = useState<boolean[]>([false]);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const authHeader = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "";
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cr, sr] = await Promise.all([
          fetch(`${API}/api/manual-customers`, { headers: authHeader() }),
          fetch(`${API}/api/manual-services`, { headers: authHeader() }),
        ]);
        setCustomers(await cr.json());
        setServices(await sr.json());
      } catch { /* non-blocking */ }
    };
    fetchData();
    // Auto-generate invoice number
    const now = new Date();
    setInvoiceNumber(`INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 900 + 100)}`);
  }, []);

  // Customer autocomplete
  const handleCustNameChange = (v: string) => {
    setCustName(v);
    if (v.trim().length > 0) {
      const q = v.toLowerCase();
      setSugg(customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q)));
      setShowCustDrop(true);
    } else { setShowCustDrop(false); }
  };
  const setSugg = (s: Customer[]) => setCustSuggestions(s.slice(0, 5));
  const selectCustomer = (c: Customer) => {
    setCustName(c.name); setCustPhone(c.phone);
    setCustEmail(c.email || ""); setCustAddress(c.address);
    setShowCustDrop(false);
  };

  // Items
  const updateItem = (i: number, field: keyof LineItem, value: string) => {
    const updated = [...items];
    const item = { ...updated[i], [field]: field === "description" ? value : Number(value) };
    item.amount = item.qty * item.rate;
    updated[i] = item;
    setItems(updated);
  };

  const handleDescChange = (i: number, val: string) => {
    updateItem(i, "description", val);
    if (val.trim().length > 0) {
      const q = val.toLowerCase();
      const matches = services.filter(s => s.name.toLowerCase().includes(q)).slice(0, 5);
      const newSvc = [...svcSuggestions]; newSvc[i] = matches; setSvcSuggestions(newSvc);
      const newShow = [...showSvcDrop]; newShow[i] = matches.length > 0; setShowSvcDrop(newShow);
    } else {
      const newShow = [...showSvcDrop]; newShow[i] = false; setShowSvcDrop(newShow);
    }
  };

  const selectService = (i: number, svc: ServiceItem) => {
    const updated = [...items];
    updated[i] = { ...updated[i], description: svc.name, rate: svc.rate, amount: updated[i].qty * svc.rate };
    setItems(updated);
    const newShow = [...showSvcDrop]; newShow[i] = false; setShowSvcDrop(newShow);
  };

  const addItem = () => {
    setItems([...items, { ...EMPTY_ITEM }]);
    setSvcSuggestions([...svcSuggestions, []]);
    setShowSvcDrop([...showSvcDrop, false]);
  };

  const removeItem = (i: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== i));
    setSvcSuggestions(svcSuggestions.filter((_, idx) => idx !== i));
    setShowSvcDrop(showSvcDrop.filter((_, idx) => idx !== i));
  };

  const totalAmount = items.reduce((s, it) => s + it.amount, 0);
  const totalPayable = Math.max(0, totalAmount - Number(discount));
  const amountInWords = toWords(totalPayable);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!invoiceNumber.trim() || !custName.trim() || !custPhone.trim() || !custAddress.trim()) {
      setError("Invoice number and customer details are required."); return;
    }
    if (items.some(it => !it.description.trim() || it.qty <= 0)) {
      setError("All line items must have a description and valid quantity."); return;
    }
    setSubmitting(true);
    try {
      const body = {
        invoiceNumber: invoiceNumber.trim(),
        date,
        customer: { name: custName.trim(), phone: custPhone.trim(), email: custEmail.trim(), address: custAddress.trim() },
        items,
        totalAmount,
        discount: Number(discount),
        totalPayableAmount: totalPayable,
        paidAmount: 0,
        dueAmount: totalPayable,
        paymentStatus: "Due",
        amountInWords,
        templateName,
        paymentOptions: DEFAULT_PO,
        signeeName,
        signeeRole,
      };
      const res = await fetch(`${API}/api/manual-invoices`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to create invoice");
      }
      const created = await res.json();
      router.push(`/dashbord/manual-invoice/invoice/${created.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mi-container">
      <div className="mi-header">
        <div>
          <h1 className="mi-title">Create New Invoice</h1>
          <p className="mi-subtitle">Fill in the details below to generate a professional invoice.</p>
        </div>
        <button className="mi-btn mi-btn-secondary" onClick={() => router.back()}>← Back</button>
      </div>

      {error && <div className="mi-alert mi-alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* ── Customer ── */}
          <div className="mi-card" style={{ gridColumn: "1 / -1" }}>
            <div className="mi-card-body">
              <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: 18 }}>👤 Customer Details</h2>
              <div className="mi-form-grid">
                <div className="mi-form-group" style={{ position: "relative" }}>
                  <label className="mi-label">Customer Name *</label>
                  <input className="mi-input" value={custName} onChange={e => handleCustNameChange(e.target.value)} placeholder="Start typing to search..." autoComplete="off" required />
                  {showCustDrop && custSuggestions.length > 0 && (
                    <div className="mi-dropdown">
                      {custSuggestions.map(c => (
                        <div key={c.id} className="mi-dropdown-item" onMouseDown={() => selectCustomer(c)}>
                          <strong>{c.name}</strong> — {c.phone}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mi-form-group">
                  <label className="mi-label">Phone *</label>
                  <input className="mi-input" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="01XXXXXXXXX" required />
                </div>
                <div className="mi-form-group">
                  <label className="mi-label">Email</label>
                  <input className="mi-input" type="email" value={custEmail} onChange={e => setCustEmail(e.target.value)} placeholder="customer@email.com" />
                </div>
                <div className="mi-form-group">
                  <label className="mi-label">Address *</label>
                  <input className="mi-input" value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="Full address" required />
                </div>
              </div>
            </div>
          </div>

          {/* ── Invoice Meta ── */}
          <div className="mi-card">
            <div className="mi-card-body">
              <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: 18 }}>📋 Invoice Details</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="mi-form-group">
                  <label className="mi-label">Invoice Number *</label>
                  <input className="mi-input" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} required />
                </div>
                <div className="mi-form-group">
                  <label className="mi-label">Date *</label>
                  <input className="mi-input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="mi-form-group">
                  <label className="mi-label">Discount (BDT)</label>
                  <input className="mi-input" type="number" min="0" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Template ── */}
          <div className="mi-card">
            <div className="mi-card-body">
              <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: 18 }}>🎨 Template & Signee</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="mi-form-group">
                  <label className="mi-label">Template</label>
                  <select className="mi-select" value={templateName} onChange={e => setTemplateName(e.target.value as any)}>
                    <option value="template1">Template 1 — RDS Dark Style</option>
                    <option value="template2">Template 2 — Rajseba Orange Style</option>
                  </select>
                </div>
                <div className="mi-form-group">
                  <label className="mi-label">Signee Name</label>
                  <input className="mi-input" value={signeeName} onChange={e => setSigneeName(e.target.value)} />
                </div>
                <div className="mi-form-group">
                  <label className="mi-label">Signee Role</label>
                  <input className="mi-input" value={signeeRole} onChange={e => setSigneeRole(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Line Items ── */}
          <div className="mi-card" style={{ gridColumn: "1 / -1" }}>
            <div className="mi-card-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>📦 Line Items</h2>
                <button type="button" className="mi-btn mi-btn-secondary mi-btn-sm" onClick={addItem}>+ Add Item</button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="mi-items-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th style={{ minWidth: 220 }}>Description</th>
                      <th style={{ width: 80 }}>Qty</th>
                      <th style={{ width: 110 }}>Rate (BDT)</th>
                      <th style={{ width: 110 }}>Amount (BDT)</th>
                      <th style={{ width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td style={{ color: "#94a3b8", fontWeight: 600, paddingTop: 10 }}>{i + 1}</td>
                        <td style={{ position: "relative" }}>
                          <input
                            className="mi-input"
                            style={{ width: "100%" }}
                            value={item.description}
                            onChange={e => handleDescChange(i, e.target.value)}
                            placeholder="Service description..."
                            autoComplete="off"
                          />
                          {showSvcDrop[i] && svcSuggestions[i]?.length > 0 && (
                            <div className="mi-dropdown">
                              {svcSuggestions[i].map(svc => (
                                <div key={svc.id} className="mi-dropdown-item" onMouseDown={() => selectService(i, svc)}>
                                  <strong>{svc.name}</strong> — {Number(svc.rate).toLocaleString()} BDT
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td>
                          <input className="mi-input" type="number" min="1" value={item.qty} onChange={e => updateItem(i, "qty", e.target.value)} style={{ width: "100%" }} />
                        </td>
                        <td>
                          <input className="mi-input" type="number" min="0" value={item.rate} onChange={e => updateItem(i, "rate", e.target.value)} style={{ width: "100%" }} />
                        </td>
                        <td style={{ fontWeight: 700, color: "#0f172a", paddingLeft: 8 }}>
                          {item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          <button type="button" className="mi-btn mi-btn-ghost" style={{ color: "#ef4444", padding: "4px 8px" }} onClick={() => removeItem(i)}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals summary */}
              <div style={{ marginTop: 20, marginLeft: "auto", maxWidth: 280, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#64748b" }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT</span>
                </div>
                {Number(discount) > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#15803d" }}>
                    <span>Discount</span>
                    <span style={{ fontWeight: 600 }}>- {Number(discount).toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem", fontWeight: 800, color: "#FF6014", borderTop: "2px solid #e2e8f0", paddingTop: 8, marginTop: 4 }}>
                  <span>Total Payable</span>
                  <span>{totalPayable.toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontStyle: "italic", marginTop: 4 }}>
                  {amountInWords}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button type="button" className="mi-btn mi-btn-secondary" onClick={() => router.back()}>Cancel</button>
          <button type="submit" className="mi-btn mi-btn-primary" disabled={submitting}>
            {submitting ? "Creating..." : "✅ Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
