import { baseApi } from '@/redux/api/baseApi';

export interface Hero {
  id: number;
  images: string[];
  text?: string;
  subtext?: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface HeroApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface CreateHeroRequest {
  images?: string[];
  text?: string;
  subtext?: string;
  link?: string;
}

export interface UpdateHeroRequest {
  images?: string[];
  text?: string;
  subtext?: string;
  link?: string;
}

export const heroApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllHeroes: builder.query<HeroApiResponse<Hero[]>, void>({
      query: () => '/hero',
      providesTags: ['Hero'],
    }),
    getHeroById: builder.query<HeroApiResponse<Hero>, string | number>({
      query: (id) => `/hero/${id}`,
      providesTags: ['Hero'],
    }),
    createHero: builder.mutation<HeroApiResponse<Hero>, CreateHeroRequest>({
      query: (data) => ({
        url: '/hero',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Hero'],
    }),
    updateHero: builder.mutation<
      HeroApiResponse<Hero>,
      { id: string | number; data: UpdateHeroRequest }
    >({
      query: ({ id, data }) => ({
        url: `/hero/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Hero'],
    }),
    deleteHero: builder.mutation<HeroApiResponse<void>, string | number>({
      query: (id) => ({
        url: `/hero/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hero'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllHeroesQuery,
  useGetHeroByIdQuery,
  useCreateHeroMutation,
  useUpdateHeroMutation,
  useDeleteHeroMutation,
} = heroApi;
