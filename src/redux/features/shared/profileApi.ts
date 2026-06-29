import { baseApi } from '@/redux/api/baseApi';

/* ==========================================================================
   PROFILE TYPES
   ========================================================================== */

export interface Profile {
  id: number;
  type: 'personal' | 'company';
  rating?: number;
  total_projects?: number;
  location?: string;
  description?: string;
  company_name?: string;
  min_starting_price?: number;
  google_map_link?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: Record<string, any>;
  categories?: Record<string, any>[];
  category?: any;
}

export interface ProfileApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface CreateProfileRequest {
  type: 'personal' | 'company';
  location?: string;
  description?: string;
  company_name?: string;
  min_starting_price?: number;
  google_map_link?: string;
  user_id?: number;
  category_ids?: number[];
}

export interface UpdateProfileRequest {
  type?: 'personal' | 'company';
  rating?: number;
  total_projects?: number;
  location?: string;
  description?: string;
  company_name?: string;
  min_starting_price?: number;
  google_map_link?: string;
  category_ids?: number[];
}

/* ==========================================================================
   PROFILE API
   ========================================================================== */

export const profileApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllProfiles: builder.query<ProfileApiResponse<Profile[]>, void>({
      query: () => '/profiles',
      providesTags: ['Profile'],
    }),
    getProfileById: builder.query<ProfileApiResponse<Profile>, string | number>({
      query: (id) => `/profiles/${id}`,
      providesTags: ['Profile'],
    }),
    createProfile: builder.mutation<ProfileApiResponse<Profile>, CreateProfileRequest>({
      query: (data) => ({
        url: '/profiles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<
      ProfileApiResponse<Profile>,
      { id: string | number; data: UpdateProfileRequest }
    >({
      query: ({ id, data }) => ({
        url: `/profiles/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteProfile: builder.mutation<ProfileApiResponse<void>, string | number>({
      query: (id) => ({
        url: `/profiles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetAllProfilesQuery,
  useGetProfileByIdQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} = profileApi;
