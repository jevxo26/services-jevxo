import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/lib/token';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rajseba-api-production.up.railway.app";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      // attempt to refresh token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // save new tokens
        const data = refreshResult.data as any;
        const accessToken = data.accessToken || data.access_token;
        const newRefreshToken = data.refreshToken || data.refresh_token || refreshToken;

        if (accessToken) {
          setTokens(accessToken, newRefreshToken);
          // retry the original query
          result = await baseQuery(args, api, extraOptions);
        } else {
          clearTokens();
          if (typeof window !== 'undefined') window.location.href = '/login';
        }
      } else {
        clearTokens();
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    } else {
      clearTokens();
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['Admin', 'Landing', 'Agent', 'Client', 'Vendor', 'Category', 'Service', 'NestedService', 'Package', 'Profile', 'Withdraw'],
});
