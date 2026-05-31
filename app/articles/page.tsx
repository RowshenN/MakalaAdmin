"use client";

import {
  useGetArticlesQuery,
  useDeleteArticleMutation,
} from "@/services/articleApi";
import { formatDate } from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import { message, Modal } from "antd";

const ArticleListPage = () => {
  const { data, isLoading } = useGetArticlesQuery();
  const [deleteArticle] = useDeleteArticleMutation();
  const router = useRouter();

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete article?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteArticle(id).unwrap();
          message.success("Article deleted");
        } catch {
          message.error("Failed to delete article");
        }
      },
    });
  };

  if (isLoading) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 text-black">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Articles</h1>
        <button
          onClick={() => router.push("/articles/create")}
          className="bg-blue-600 cursor-pointer text-white p-2 rounded mb-4"
        >
          + Create New Article
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Slug</th>
            <th className="border border-gray-300 p-2">Issue</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Author</th>
            <th className="border border-gray-300 p-2">Created</th>
            <th className="border border-gray-300 p-2">Updated</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((article) => (
            <tr key={article.id}>
              <td className="border border-gray-300 p-2">{article.title}</td>
              <td className="border border-gray-300 p-2">{article.slug}</td>
              <td className="border border-gray-300 p-2">
                {article?.issue?.title}
              </td>
              <td className="border border-gray-300 p-2">
                {article?.category?.name}
              </td>
              <td className="border border-gray-300 p-2">
                {article?.author
                  ? `${article.author.firstName} ${article.author.lastName}`
                  : "-"}
              </td>
              <td className="border border-gray-300 p-2">
                {article.createdAt ? formatDate(article.createdAt) : "-"}
              </td>
              <td className="border border-gray-300 p-2">
                {article.updatedAt ? formatDate(article.updatedAt) : "-"}
              </td>
              <td className="border border-gray-300 p-2 flex gap-2">
                <button
                  onClick={() => router.push(`/articles/${article.slug}`)}
                  className="bg-yellow-500 cursor-pointer text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="bg-red-500 cursor-pointer text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleListPage;
