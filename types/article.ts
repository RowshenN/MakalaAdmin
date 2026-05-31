export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  issueId?: string | null;
  categoryId?: string | null;
  authorId?: string | null;

  // Related models (optional, depending on include in query)
  issue?: {
    id: string;
    title: string;
    year?: number;
    week?: number;
    magazine?: {
      id: string;
      title: string;
    };
  };
  category?: {
    id: string;
    name: string;
  };
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    worksAt?: string | null;
    studiesAt?: string | null;
  };

  createdAt?: string;
  updatedAt?: string;
}
