import { baseApi } from '@/redux/api/baseApi';

export interface SubServiceItem {
  sub_service_id: number;
  quantity: number;
}

export interface Booking {
  id: number;
  user?: any;
  vendor?: any;
  employees?: any[];
  subServices?: any[];
  sub_service_items?: SubServiceItem[];
  nestedService?: any;
  pkg?: any;
  service?: any;
  agent?: any;
  package_id?: number;
  quantity?: number;
  subtotal?: number;
  discount_amount?: number;
  coupon_code?: string;
  date: string;
  time?: string;
  location: string;
  total_price?: number;
  notes?: string;
  status: 'pending' | 'assigned' | 'on_the_way' | 'completed' | 'cancelled';
  payment_status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query<BookingApiResponse<Booking[]>, void>({
      query: () => '/bookings',
      providesTags: ['Booking'],
    }),
    getBookingById: builder.query<BookingApiResponse<Booking>, string | number>({
      query: (id) => `/bookings/${id}`,
      providesTags: ['Booking'],
    }),
    getBookingTracking: builder.query<BookingApiResponse<Booking>, string | number>({
      query: (id) => `/bookings/track/${id}`,
      providesTags: ['Booking'],
    }),
    getBookingsByVendor: builder.query<BookingApiResponse<Booking[]>, string | number>({
      query: (vendorId) => `/bookings/vendor/${vendorId}`,
      providesTags: ['Booking'],
    }),
    getBookingsByUser: builder.query<BookingApiResponse<Booking[]>, string | number>({
      query: (userId) => `/bookings/user/${userId}`,
      providesTags: ['Booking'],
    }),
    createBooking: builder.mutation<BookingApiResponse<Booking>, any>({
      query: (data) => ({
        url: '/bookings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Booking'],
    }),
    updateBooking: builder.mutation<BookingApiResponse<Booking>, { id: string | number; data: any }>({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Booking'],
    }),
    assignEmployeeToBooking: builder.mutation<BookingApiResponse<Booking>, { id: string | number; employee_ids: number[] }>({
      query: ({ id, employee_ids }) => ({
        url: `/bookings/${id}/assign`,
        method: 'POST',
        body: { employee_ids },
      }),
      invalidatesTags: ['Booking'],
    }),
    updateBookingStatus: builder.mutation<BookingApiResponse<Booking>, { id: string | number; status: string }>({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Booking'],
    }),
    deleteBooking: builder.mutation<BookingApiResponse<void>, string | number>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useGetBookingTrackingQuery,
  useGetBookingsByVendorQuery,
  useGetBookingsByUserQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useAssignEmployeeToBookingMutation,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
} = bookingApi;
