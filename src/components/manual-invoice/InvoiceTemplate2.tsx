"use client";

import React from "react";

interface InvoiceItem {
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

interface InvoiceTemplateProps {
  invoice: {
    invoiceNumber: string;
    date: string;
    customer: { name: string; phone: string; email?: string; address: string };
    items: InvoiceItem[];
    totalAmount: number;
    discount?: number;
    totalPayableAmount: number;
    paidAmount: number;
    dueAmount: number;
    paymentStatus: string;
    amountInWords: string;
    paymentOptions?: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      branch: string;
      routingNumber: string;
    };
    signeeName?: string;
    signeeRole?: string;
  };
}

const fmt = (n: number) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 });

const fmtDate = (d: string) => {
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return d;
  }
};

export default function InvoiceTemplate2({ invoice }: InvoiceTemplateProps) {
  const po = invoice.paymentOptions || {
    accountName: "RAJSEBA.COM",
    accountNumber: "02433002451",
    bankName: "Bank Asia PLC",
    branch: "Rajshahi Branch",
    routingNumber: "070811937",
  };

  return (
    <div className="inv-page">
      {/* ── Header ── */}
      <div className="inv2-header">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/rajseba-logo.png" alt="Rajseba Logo" className="inv2-logo" />
          <div style={{ marginTop: 8, fontSize: "9pt", opacity: 0.85 }}>
            Rajshahi, Bangladesh | info@rajseba.com
          </div>
        </div>
        <div className="inv2-header-right">
          <div className="inv2-label">INVOICE</div>
          <div className="inv2-number">#{invoice.invoiceNumber}</div>
          <div className="inv2-number">{fmtDate(invoice.date)}</div>
        </div>
      </div>

      {/* ── Meta strip ── */}
      <div className="inv2-meta">
        <div className="inv2-meta-block">
          <div className="inv2-meta-key">Bill To</div>
          <div className="inv2-meta-val">{invoice.customer.name}</div>
        </div>
        <div className="inv2-meta-block">
          <div className="inv2-meta-key">Phone</div>
          <div className="inv2-meta-val">{invoice.customer.phone}</div>
        </div>
        <div className="inv2-meta-block">
          <div className="inv2-meta-key">Payment Status</div>
          <div
            className="inv2-meta-val"
            style={{ color: invoice.paymentStatus === "Paid" ? "#15803d" : "#c2410c" }}
          >
            {invoice.paymentStatus}
          </div>
        </div>
        <div className="inv2-meta-block">
          <div className="inv2-meta-key">Due Amount</div>
          <div className="inv2-meta-val" style={{ color: "#c2410c" }}>
            {fmt(invoice.dueAmount)} BDT
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="inv2-body">
        {/* Bill-to */}
        <div style={{ marginBottom: 14, fontSize: "8pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#64748b" }}>
          Bill To
        </div>
        <div className="inv2-bill-to">
          <div className="inv2-bill-name">{invoice.customer.name}</div>
          <div className="inv2-bill-detail">
            {invoice.customer.phone}
            {invoice.customer.email ? ` | ${invoice.customer.email}` : ""}
            <br />
            {invoice.customer.address}
          </div>
        </div>

        {/* Items table */}
        <table className="inv2-table">
          <thead>
            <tr>
              <th style={{ width: 28 }}>#</th>
              <th>Description</th>
              <th className="right" style={{ width: 55 }}>Qty</th>
              <th className="right" style={{ width: 90 }}>Rate (BDT)</th>
              <th className="right" style={{ width: 100 }}>Amount (BDT)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                <td>{item.description}</td>
                <td className="right">{item.qty}</td>
                <td className="right">{fmt(item.rate)}</td>
                <td className="right">{fmt(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="inv2-totals">
          <div className="inv2-totals-row">
            <span className="label">Subtotal</span>
            <span className="val">{fmt(invoice.totalAmount)} BDT</span>
          </div>
          {invoice.discount != null && Number(invoice.discount) > 0 && (
            <div className="inv2-totals-row">
              <span className="label">Discount</span>
              <span className="val" style={{ color: "#15803d" }}>
                - {fmt(invoice.discount)} BDT
              </span>
            </div>
          )}
          <div className="inv2-totals-row total">
            <span>Total Payable</span>
            <span>{fmt(invoice.totalPayableAmount)} BDT</span>
          </div>
          {Number(invoice.paidAmount) > 0 && (
            <div className="inv2-totals-row paid">
              <span className="label">Paid</span>
              <span className="val">- {fmt(invoice.paidAmount)} BDT</span>
            </div>
          )}
          {Number(invoice.dueAmount) > 0 && (
            <div className="inv2-totals-row due">
              <span className="label">Due</span>
              <span className="val">{fmt(invoice.dueAmount)} BDT</span>
            </div>
          )}
        </div>

        {/* Amount in words */}
        <div className="inv2-words">
          <strong>In Words:</strong> {invoice.amountInWords}
        </div>

        {/* Footer: bank + signature */}
        <div className="inv2-footer">
          <div className="inv2-bank">
            <div className="inv2-bank-title">Payment Information</div>
            <div className="inv2-bank-row"><span className="inv2-bank-key">Account Name</span>{po.accountName}</div>
            <div className="inv2-bank-row"><span className="inv2-bank-key">Account No.</span>{po.accountNumber}</div>
            <div className="inv2-bank-row"><span className="inv2-bank-key">Bank</span>{po.bankName}</div>
            <div className="inv2-bank-row"><span className="inv2-bank-key">Branch</span>{po.branch}</div>
            <div className="inv2-bank-row"><span className="inv2-bank-key">Routing No.</span>{po.routingNumber}</div>
          </div>
          <div className="inv2-sig-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/signature.png" alt="Signature" className="inv2-sig-img" />
            <div className="inv2-sig-line">
              <div className="inv2-sig-name">{invoice.signeeName || "Ariful Islam Arif"}</div>
              <div className="inv2-sig-role">{invoice.signeeRole || "CEO, Rajseba Design Studio"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="inv2-bottom-bar" />
    </div>
  );
}
