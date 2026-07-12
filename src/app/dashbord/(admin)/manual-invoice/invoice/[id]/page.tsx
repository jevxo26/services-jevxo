"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import InvoiceTemplate1 from "@/components/manual-invoice/InvoiceTemplate1";
import InvoiceTemplate2 from "@/components/manual-invoice/InvoiceTemplate2";

const API = "https://api.rajseba.com";

export default function InvoiceViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [paying, setPaying] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paySuccess, setPaySuccess] = useState("");

  const authHeader = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "";
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`${API}/api/manual-invoices/${id}`, { headers: authHeader() });
        if (!res.ok) throw new Error("Invoice not found");
        setInvoice(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handlePrint = () => window.print();

  const handlePayment = async () => {
    const amount = Number(payAmount);
    if (!amount || amount <= 0) { setError("Enter a valid payment amount"); return; }
    setPaying(true);
    try {
      const res = await fetch(`${API}/api/manual-invoices/${id}/payment`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ amountPaid: amount }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Payment update failed");
      }
      const updated = await res.json();
      setInvoice(updated);
      setShowPayModal(false);
      setPayAmount("");
      setPaySuccess(`✅ Payment of ${amount.toLocaleString()} BDT recorded.`);
      setTimeout(() => setPaySuccess(""), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("invoice-print-area");
      if (!element) return;
      const options = {
        margin: 0,
        filename: `Invoice-${invoice.invoiceNumber}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm" as const, format: "a4", orientation: "portrait" as const },
      };
      html2pdf().set(options).from(element).save();
    } catch {
      alert("html2pdf not installed. Run: npm install html2pdf.js");
    }
  };

  if (loading) {
    return (
      <div className="mi-container">
        <div className="mi-empty"><div className="mi-spinner" /><p>Loading invoice...</p></div>
      </div>
    );
  }

  if (error && !invoice) {
    return (
      <div className="mi-container">
        <div className="mi-alert mi-alert-error">{error}</div>
        <button className="mi-btn mi-btn-secondary" onClick={() => router.back()}>← Back</button>
      </div>
    );
  }

  return (
    <div className="mi-container">
      {/* Action bar */}
      <div className="mi-header mi-no-print">
        <div>
          <h1 className="mi-title">Invoice #{invoice.invoiceNumber}</h1>
          <p className="mi-subtitle">
            {invoice.customer.name} ·{" "}
            <span className={`mi-badge ${invoice.paymentStatus === "Paid" ? "mi-badge-paid" : "mi-badge-due"}`}>
              {invoice.paymentStatus}
            </span>
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="mi-btn mi-btn-secondary" onClick={() => router.push("/dashbord/manual-invoice")}>
            ← Dashboard
          </button>
          {invoice.paymentStatus !== "Paid" && (
            <button className="mi-btn mi-btn-secondary" style={{ color: "#15803d", borderColor: "rgba(21,128,61,.3)" }} onClick={() => setShowPayModal(true)}>
              💰 Receive Payment
            </button>
          )}
          <button className="mi-btn mi-btn-secondary" onClick={handleDownloadPDF}>
            ⬇️ Download PDF
          </button>
          <button className="mi-btn mi-btn-primary" onClick={handlePrint}>
            🖨️ Print
          </button>
        </div>
      </div>

      {paySuccess && <div className="mi-alert mi-alert-success mi-no-print">{paySuccess}</div>}
      {error && <div className="mi-alert mi-alert-error mi-no-print">{error}</div>}

      {/* Due amount warning banner */}
      {invoice.paymentStatus === "Due" && (
        <div className="mi-no-print" style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#9a3412", fontWeight: 600, fontSize: "0.9rem" }}>
            ⚠️ Outstanding due: <strong>{Number(invoice.dueAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT</strong>
          </span>
          <button className="mi-btn mi-btn-secondary mi-btn-sm" style={{ color: "#c2410c", borderColor: "rgba(194,65,12,.3)" }} onClick={() => setShowPayModal(true)}>
            Receive Payment
          </button>
        </div>
      )}

      {/* Invoice template */}
      <div id="invoice-print-area" className="mi-print-area" style={{ maxWidth: "100%", overflowX: "auto" }}>
        {invoice.templateName === "template2" ? (
          <InvoiceTemplate2 invoice={invoice} />
        ) : (
          <InvoiceTemplate1 invoice={invoice} />
        )}
      </div>

      {/* Payment modal */}
      {showPayModal && (
        <div className="mi-modal-backdrop">
          <div className="mi-modal">
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>💰</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Receive Payment</h3>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 20 }}>
              Total Due: <strong style={{ color: "#c2410c" }}>{Number(invoice.dueAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT</strong>
            </p>
            <input
              className="mi-input"
              type="number"
              placeholder="Enter amount received (BDT)"
              value={payAmount}
              onChange={e => setPayAmount(e.target.value)}
              min="1"
              max={invoice.dueAmount}
              style={{ marginBottom: 16, width: "100%" }}
              autoFocus
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="mi-btn mi-btn-secondary" onClick={() => setShowPayModal(false)}>Cancel</button>
              <button className="mi-btn mi-btn-primary" onClick={handlePayment} disabled={paying}>
                {paying ? "Saving..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
