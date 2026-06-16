import { baseApi } from '@/redux/api/baseApi';

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  parent: Category | null;
  children: Category[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CategoryApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  order?: number;
  icon?: string;
  parentId?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  order?: number;
  icon?: string;
  parentId?: number | null;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<CategoryApiResponse<Category[]>, void>({
      query: () => '/category',
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query<CategoryApiResponse<Category>, string | number>({
      query: (id) => `/category/${id}`,
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<CategoryApiResponse<Category>, CreateCategoryRequest>({
      query: (data) => ({
        url: '/category',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<
      CategoryApiResponse<Category>,
      { id: string | number; data: UpdateCategoryRequest }
    >({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<CategoryApiResponse<void>, string | number>({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
