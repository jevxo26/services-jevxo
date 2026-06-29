import { baseApi } from '../../api/baseApi';

export interface Notification {
  id: number;
  message: string;
  type: string;
  isRead: boolean;
  userId: number;
  createdAt: string;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notification',
      providesTags: ['Notification' as any],
    }),
    markNotificationAsRead: builder.mutation<Notification, number>({
      query: (id) => ({
        url: `/notification/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification' as any],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationAsReadMutation } = notificationApi;
