"use client";

import Link from "next/link";
import {
  useGetAuthorsQuery,
  useDeleteAuthorMutation,
} from "@/services/authorApi";
import { message, Modal } from "antd";

const AuthorsPage = () => {
  const { data, isLoading, isError } = useGetAuthorsQuery();
  const [deleteAuthor] = useDeleteAuthorMutation();

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete author?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteAuthor(id).unwrap();
          message.success("Author deleted");
        } catch {
          message.error("Failed to delete author");
        }
      },
    });
  };

  if (isLoading) return <p className="p-10">Loading...</p>;
  if (isError) return <p className="p-10">Error loading authors</p>;

  return (
    <div className="p-10 text-black">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Authors</h1>

        <Link
          href="/authors/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">First Name</th>
            <th className="border border-gray-300 p-2">Phone Number</th>
            <th className="border border-gray-300 p-2">Works At</th>
            <th className="border border-gray-300 p-2">Studies At</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((author) => (
            <tr key={author.id}>
              <td className="border border-gray-300 p-2">
                {author.firstName + " " + author.lastName}
              </td>
              <td className="border border-gray-300 p-2">
                {author.phoneNumber}
              </td>
              <td className="border w-[300px] border-gray-300 p-2">
                {author.worksAt ?? "-"}
              </td>
              <td className="border w-[300px] border-gray-300 p-2">
                {author.studiesAt ?? "-"}
              </td>
              <td className="border border-gray-300 p-2 flex gap-2">
                <Link
                  href={`/authors/${author.id}`}
                  className="cursor-pointer px-3 py-1 rounded border border-blue-500 text-blue-500"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(author.id)}
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

export default AuthorsPage;
