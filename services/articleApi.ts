import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Article } from "@/types/article";

export const articleApi = createApi({
  reducerPath: "articleApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "http://72.62.243.185/"  + "article/" }),
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/"  + "article/" }),
  tagTypes: ["Article"],
  endpoints: (builder) => ({
    // GET ALL ARTICLES
    getArticles: builder.query<{ data: Article[]; total: number }, void>({
      query: () => "",
      providesTags: ["Article"],
    }),

    // GET SINGLE ARTICLE
    getArticleBySLug: builder.query<Article, string>({
      query: (slug) => `${slug}`,
    }),

    // CREATE ARTICLE
    createArticle: builder.mutation<Article, Partial<Article>>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Article"],
    }),

    // UPDATE ARTICLE
    updateArticle: builder.mutation<
      Article,
      { id: string; body: Partial<Article> }
    >({
      query: ({ id, body }) => ({
        url: `${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Article"],
    }),

    // DELETE ARTICLE
    deleteArticle: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Article"],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleBySLugQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articleApi;
