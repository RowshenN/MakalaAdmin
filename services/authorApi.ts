import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Author } from "@/types/author";

export const authorApi = createApi({
  reducerPath: "authorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://72.62.243.185/",
    // baseUrl: "http://localhost:5000/",
  }),
  tagTypes: ["Author"],

  endpoints: (builder) => ({
    // ✅ GET ALL
    getAuthors: builder.query<Author[], void>({
      query: () => "author",
      providesTags: ["Author"],
    }),

    // ✅ GET ONE
    getAuthorById: builder.query<Author, string>({
      query: (id) => `author/${id}`,
    }),

    // ✅ CREATE
    createAuthor: builder.mutation({
      query: (data) => ({
        url: "author",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Author"],
    }),

    // ✅ UPDATE
    updateAuthor: builder.mutation({
      query: ({ id, data }) => ({
        url: `author/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Author"],
    }),

    // ✅ DELETE
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
