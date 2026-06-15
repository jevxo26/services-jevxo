import { baseApi } from '@/redux/api/baseApi';

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRole: builder.mutation<any, any>({
      query: (data) => ({
        url: '/api/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),
    getAllRoles: builder.query<any, void>({
      query: () => '/api/roles',
      providesTags: ['Admin'],
    }),
    getRoleById: builder.query<any, string>({
      query: (id) => `/api/roles/${id}`,
      providesTags: ['Admin'],
    }),
    updateRole: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/roles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),
    deleteRole: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateRoleMutation,
  useGetAllRolesQuery,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
