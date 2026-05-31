import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./config";
import { AuthUser } from "@/redux/authSlice";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}auth/` }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.mutation<{ message: string }, { refreshToken: string }>({
      query: (body) => ({
        url: "logout",
        method: "POST",
        body,
      }),
    }),

    me: builder.query<{ user: AuthUser }, void>({
      query: () => "me",
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;
