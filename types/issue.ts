import { Article } from "./article";

export interface Issue {
  id: string;
  title: string;
  description?: string;
  pageCount?: number;
  image?: string;
  pdf?: string;
  year?: number;
  week?: number;

  category?: {
    id: string;
    name: string;
  };

  magazine?: {
    id: string;
    title: string;
  };

  createdAt?: string;
  updatedAt?: string;
}

export interface IssueWithArticles extends Issue {
  articles?: Article[];
}

export interface IssuesResponse {
  data: Issue[];
  total: number;
}
