"use client";

import React, { use } from 'react';
import { useGetBookingTrackingQuery } from '@/redux/features/admin/booking';

export default function TrackingPage({ params }: { params: Promise<{ bookingId: string }> | { bookingId: string } }) {
  // Unwrap params using React.use if it's a promise (Next.js 15+ handling), or just cast for compatibility.
  // We'll safely access it.
  const resolvedParams = params as { bookingId: string };
  const bookingId = resolvedParams.bookingId;
  
  const { data: response, isLoading, isError } = useGetBookingTrackingQuery(bookingId, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md w-full">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
           <p className="text-gray-500">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  const booking = response?.data;

  if (isError || !booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
          <p className="text-gray-500">The booking you are trying to track does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'on the way': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Your booking has been received and is waiting to be assigned to a professional.';
      case 'assigned': return 'A professional has been assigned to your booking and is preparing for the service.';
      case 'on the way': return 'The assigned professional is currently on their way to your location.';
      case 'completed': return 'The service has been completed successfully. Thank you for choosing us!';
      case 'cancelled': return 'This booking has been cancelled. If you have any questions, please contact support.';
      default: return 'Your booking is currently being processed.';
    }
  };

  const serviceLabel = booking.service?.name || booking.pkg?.name || booking.subServices?.map((s: any) => s.name).join(', ') || 'Service';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-primary/5 border-b border-primary/10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Track Booking</h1>
            <p className="text-sm text-gray-500 mt-1">Booking #{booking.id}</p>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-medium tracking-wide capitalize ${getStatusColor(booking.status)}`}>
            {booking.status}
          </div>
        </div>

        {/* Status Message */}
        <div className={`p-4 px-6 sm:px-8 border-b ${
          booking.status === 'completed' ? 'bg-green-50/50 border-green-100' :
          booking.status === 'cancelled' ? 'bg-red-50/50 border-red-100' :
          booking.status === 'pending' ? 'bg-yellow-50/50 border-yellow-100' :
          booking.status === 'on_the_way' ? 'bg-purple-50/50 border-purple-100' :
          'bg-blue-50/50 border-blue-100'
        }`}>
          <p className={`text-sm font-medium ${
            booking.status === 'completed' ? 'text-green-800' :
            booking.status === 'cancelled' ? 'text-red-800' :
            booking.status === 'pending' ? 'text-yellow-800' :
            booking.status === 'on_the_way' ? 'text-purple-800' :
            'text-blue-800'
          }`}>
            {getStatusMessage(booking.status)}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Service Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Service Details</h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="font-medium text-gray-900">{serviceLabel}</p>
              <div className="mt-2 text-sm text-gray-600 flex flex-col sm:flex-row sm:gap-6 gap-2">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {booking.date}
                </div>
                {booking.time && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {booking.time}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Location</h3>
              <p className="text-gray-900 text-sm leading-relaxed">{booking.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Amount</h3>
              <p className="text-gray-900 font-semibold text-lg">৳{Number(booking.total_price || 0).toLocaleString()}</p>
              {booking.payment_status && (
                 <p className="text-sm text-gray-500 capitalize">Payment: {booking.payment_status}</p>
              )}
            </div>
          </div>

          {/* Assigned Agent/Employee Info (Optional) */}
          {(booking.agent || (booking.employees && booking.employees.length > 0)) && (
            <div className="pt-6 border-t border-gray-100">
               <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Assigned Personnel</h3>
               
               <div className="space-y-4">
                  {booking.agent && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {booking.agent.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{booking.agent.name}</p>
                        <p className="text-xs text-gray-500">Agent</p>
                      </div>
                    </div>
                  )}

                  {booking.employees && booking.employees.length > 0 && booking.employees.map((emp: any) => (
                    <div key={emp.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {emp.name?.charAt(0) || 'E'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{emp.name}</p>
                        <p className="text-xs text-gray-500">Service Provider</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
          
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-sm text-gray-500">Need help with your booking?</p>
          <a href="/contact" className="text-primary text-sm font-medium hover:underline mt-1 inline-block">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
