import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Issue, IssuesResponse, IssueWithArticles } from "@/types/issue";

export const issueApi = createApi({
  reducerPath: "issueApi",
  baseQuery: fetchBaseQuery({
      baseUrl: "http://72.62.243.185/"
      // baseUrl: "http://localhost:5000/"
  }),
  tagTypes: ["Issue"],

  endpoints: (builder) => ({
    // ✅ GET ALL
    getIssues: builder.query<IssuesResponse, void>({
      query: () => "issue",
      providesTags: ["Issue"],
    }),

    // ✅ GET ONE (🔥 FIX HERE)
   getIssueById: builder.query<IssueWithArticles, string>({
      query: (id) => `issue/${id}`,
      providesTags: (result, error, id) => [{ type: "Issue", id }],
    }),

    // ✅ CREATE
    createIssue: builder.mutation({
      query: (formData) => ({
        url: "issue",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Issue"],
    }),

    // ✅ UPDATE (🔥 FIX HERE)
    updateIssue: builder.mutation({
      query: ({ id, body }) => ({
        url: `issue/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Issue", id },
        "Issue", // also refresh list
      ],
    }),

    // ✅ DELETE
    deleteIssue: builder.mutation({
      query: (id) => ({
        url: `issue/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Issue"],
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetIssueByIdQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} = issueApi;
