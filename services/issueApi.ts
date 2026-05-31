import { createApi } from "@reduxjs/toolkit/query/react";
import { Issue, IssuesResponse, IssueWithArticles } from "@/types/issue";
import { createBaseQueryWithReauth } from "./baseQuery";

export const issueApi = createApi({
  reducerPath: "issueApi",
  baseQuery: createBaseQueryWithReauth(""),
  tagTypes: ["Issue"],

  endpoints: (builder) => ({
    getIssues: builder.query<IssuesResponse, void>({
      query: () => "issue",
      providesTags: ["Issue"],
    }),

   getIssueById: builder.query<IssueWithArticles, string>({
      query: (id) => `issue/${id}`,
      providesTags: (result, error, id) => [{ type: "Issue", id }],
    }),

    createIssue: builder.mutation({
      query: (formData) => ({
        url: "issue",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Issue"],
    }),

    updateIssue: builder.mutation({
      query: ({ id, body }) => ({
        url: `issue/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Issue", id },
        "Issue",
      ],
    }),

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
