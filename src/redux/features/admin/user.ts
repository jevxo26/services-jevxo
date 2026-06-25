import { baseApi } from '@/redux/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<any, any>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),
    getAllUsers: builder.query<any, { role?: string } | void>({
      query: (params) => {
        if (params && params.role) {
          return `/users?role=${params.role}`;
        }
        return '/users';
      },
      providesTags: ['Admin'],
    }),
    getUserById: builder.query<any, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['Admin'],
    }),
    updateUser: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),
    getEmployeesByVendor: builder.query<any, string | number>({
      query: (vendorId) => `/users/employees/vendor/${vendorId}`,
      providesTags: ['Admin'],
    }),
    getSavedServices: builder.query<any, void>({
      query: () => '/users/me/saved-services',
      providesTags: ['Admin', 'Client'],
    }),
    toggleSavedService: builder.mutation<any, string | number>({
      query: (serviceId) => ({
        url: `/users/me/saved-services/${serviceId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Admin', 'Client'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetEmployeesByVendorQuery,
  useGetSavedServicesQuery,
  useToggleSavedServiceMutation,
} = userApi;
