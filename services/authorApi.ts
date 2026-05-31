import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Author } from "@/types/author";
import { API_URL } from "./config";

export const authorApi = createApi({
  reducerPath: "authorApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Author"],

  endpoints: (builder) => ({
    getAuthors: builder.query<Author[], void>({
      query: () => "author",
      providesTags: ["Author"],
    }),

    getAuthorById: builder.query<Author, string>({
      query: (id) => `author/${id}`,
    }),

    createAuthor: builder.mutation({
      query: (data) => ({
        url: "author",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Author"],
    }),

    updateAuthor: builder.mutation({
      query: ({ id, data }) => ({
        url: `author/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Author"],
    }),

    deleteAuthor: builder.mutation({
      query: (id) => ({
        url: `author/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Author"],
    }),
  }),
});

export const {
  useGetAuthorsQuery,
  useGetAuthorByIdQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
} = authorApi;
