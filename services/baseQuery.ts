import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/redux/store";
import { setCredentials, logout } from "@/redux/authSlice";
import { API_URL } from "./config";

// Shared base query — adds Authorization header from Redux state
const rootBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Factory: creates a base query for a given path prefix that
// auto-refreshes the access token on 401 and retries the request.
export const createBaseQueryWithReauth = (
  basePath: string
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const serviceBaseQuery = fetchBaseQuery({
    baseUrl: `${API_URL}${basePath}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    let result = await serviceBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      const { refreshToken } = (api.getState() as RootState).auth;

      if (refreshToken) {
        // Try to get a new access token
        const refreshResult = await rootBaseQuery(
          {
            url: "auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          api.dispatch(
            setCredentials(
              refreshResult.data as {
                accessToken: string;
                refreshToken: string;
              }
            )
          );
          // Retry original request with new token
          result = await serviceBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } else {
        api.dispatch(logout());
      }
    }

    return result;
  };
};
