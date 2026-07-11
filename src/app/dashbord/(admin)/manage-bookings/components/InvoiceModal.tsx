import React, { useRef } from 'react';
import { X, Printer, Download } from 'lucide-react';
import Image from 'next/image';
import dayjs from 'dayjs';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export default function InvoiceModal({ isOpen, onClose, booking }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore React state properly after messing with DOM
    }
  };

  // Extract necessary details
  const invoiceId = `INV-${booking.id.toString().padStart(6, '0')}`;
  const date = dayjs(booking.createdAt).format('DD MMM, YYYY');
  
  // Re-calculate actual subservices like we did in BookingTable
  const actualSubServices = booking.subServices?.filter((ss: any) => {
    if (booking.sub_service_items && booking.sub_service_items.length > 0) {
      const qty = booking.sub_service_items.find((entry: any) => entry.sub_service_id === ss.id)?.quantity;
      return qty && qty > 0;
    }
    return true;
  }) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden relative">
        {/* Header Actions */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-slate-800 text-lg">Invoice Preview</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-emerald-500/20"
            >
              <Printer size={16} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 overflow-y-auto bg-slate-50/50">
          {/* We wrap the print content in a div that will be extracted during print */}
          <div 
            ref={printRef} 
            className="bg-white p-10 rounded-xl shadow-sm border border-slate-100 min-h-[800px]"
            style={{ fontFamily: "'Inter', sans-serif" }} // Ensure clean font for print
          >
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b-2 border-emerald-500 pb-8 mb-8">
              <div>
                {/* Logo Placeholder - assuming /logo.png exists or similar */}
                <h1 className="text-3xl font-black text-emerald-600 tracking-tight mb-1">RAJSEBA</h1>
                <p className="text-sm font-medium text-slate-500">Your Trusted Service Partner</p>
                <div className="mt-4 text-xs text-slate-500 space-y-1">
                  <p>123 Service Road, Tech City</p>
                  <p>info@rajseba.com</p>
                  <p>01813-333373</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-black text-slate-200 tracking-wider mb-2">INVOICE</h2>
                <div className="text-sm font-bold text-slate-800">
                  <span className="text-slate-400 font-medium">Invoice No:</span> {invoiceId}
                </div>
                <div className="text-sm font-bold text-slate-800 mt-1">
                  <span className="text-slate-400 font-medium">Date:</span> {date}
                </div>
                <div className="mt-4 inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold uppercase tracking-wider border border-emerald-100">
                  {booking.status === 'completed' ? 'Paid' : 'Unpaid'}
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bill To</p>
                <h3 className="text-lg font-black text-slate-800">{booking.user?.name || booking.name || 'Guest Client'}</h3>
                <p className="text-sm text-slate-600 mt-1">{booking.user?.email || booking.email || 'N/A'}</p>
                <p className="text-sm text-slate-600 mt-1">{booking.user?.phone || booking.phone || 'N/A'}</p>
                <p className="text-sm text-slate-600 mt-2 max-w-[250px] leading-relaxed">{booking.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Service Details</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Service:</span>
                    <span className="text-sm font-bold text-slate-800 text-right">{booking.service?.name || booking.pkg?.name || 'Service'}</span>
                  </div>
                  {booking.schedule_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Schedule:</span>
                      <span className="text-sm font-bold text-slate-800 text-right">
                        {dayjs(booking.schedule_date).format('DD MMM YYYY')} at {booking.schedule_time}
                      </span>
                    </div>
                  )}
                  {booking.vendor && (
                    <div className="flex justify-between border-t border-slate-200 mt-2 pt-2">
                      <span className="text-sm text-slate-500">Assigned Expert:</span>
                      <span className="text-sm font-bold text-emerald-600 text-right">{booking.vendor.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Item Description</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Rate</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Qty</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {actualSubServices.length > 0 ? (
                    actualSubServices.map((ss: any, idx: number) => {
                      const qty = booking.sub_service_items?.find((entry: any) => entry.sub_service_id === ss.id)?.quantity || 1;
                      const price = parseFloat(ss.price) || 0;
                      const subTotal = price * qty;
                      return (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4">
                            <p className="text-sm font-bold text-slate-800">{ss.name}</p>
                            {ss.description && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ss.description}</p>}
                          </td>
                          <td className="py-4 px-4 text-sm font-semibold text-slate-600 text-center">৳{price}</td>
                          <td className="py-4 px-4 text-sm font-semibold text-slate-600 text-center">{qty}</td>
                          <td className="py-4 px-4 text-sm font-black text-slate-800 text-right">৳{subTotal}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="border-b border-slate-100">
                      <td className="py-4 px-4">
                        <p className="text-sm font-bold text-slate-800">{booking.pkg ? booking.pkg.name : booking.service?.name}</p>
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-slate-600 text-center">৳{booking.total_price}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-slate-600 text-center">{booking.quantity || 1}</td>
                      <td className="py-4 px-4 text-sm font-black text-slate-800 text-right">৳{booking.total_price}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-1/2 bg-slate-50 rounded-xl p-6 border border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-slate-500">Subtotal</span>
                  <span className="text-sm font-bold text-slate-800">৳{booking.total_price || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-slate-500">Discount</span>
                  <span className="text-sm font-bold text-emerald-500">- ৳0</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-slate-500">Tax / VAT</span>
                  <span className="text-sm font-bold text-slate-800">৳0</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-emerald-500">
                  <span className="text-lg font-black text-slate-800">Total Amount</span>
                  <span className="text-2xl font-black text-emerald-600">৳{booking.total_price || 0}</span>
                </div>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="border-t border-slate-200 pt-6 flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-800 mb-1">Terms & Conditions</p>
                <p className="text-[10px] text-slate-500 max-w-sm leading-relaxed">
                  Payment is due within 15 days. Please make checks payable to Rajseba Services. Any questions? Contact us at info@rajseba.com.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">{booking.vendor?.name || 'Authorized Signature'}</p>
                <div className="w-32 border-b-2 border-slate-300 ml-auto"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
