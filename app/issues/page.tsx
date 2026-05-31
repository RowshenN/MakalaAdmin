"use client";

import Link from "next/link";
import { useGetIssuesQuery, useDeleteIssueMutation } from "@/services/issueApi";
import { Image } from "antd";
import { formatDate } from "@/utils/formatDate";

const IssuesPage = () => {
  const { data, isLoading } = useGetIssuesQuery();
  const [deleteIssue] = useDeleteIssueMutation();

  if (isLoading) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 text-black ">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold"> Issues</h1>

        <Link
          href="/issues/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create
        </Link>
      </div>

      {/* <div className="bg-white shadow rounded-xl p-4">
        {data?.map((issue) => (
          <div
            key={issue.id}
            className="flex justify-between border-b border-gray-300 py-3"
          >
            <div className="flex items-center justify-center gap-3 ">
              <Image
                src={`${issue?.image}`}
                alt="issue photo"
                width={55}
                height={55}
                style={{ borderRadius: "8px" }}
              />
              <div>
                <p className="font-semibold">{issue.title}</p>
                <p className="text-sm text-gray-500">
                  {issue.category?.name} • {issue.magazine?.title}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Link href={`/issues/${issue.id}`} className="text-blue-500">
                Edit
              </Link>

              <button
                onClick={() => deleteIssue(issue.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div> */}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Magazine</th>
            <th className="border border-gray-300 p-2">Year</th>
            <th className="border border-gray-300 p-2">Week</th>
            <th className="border border-gray-300 p-2">Created</th>
            <th className="border border-gray-300 p-2">Updated</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((issue) => (
            <tr key={issue.id}>
              <td className="border border-gray-300 p-2">
                <Image
                  src={`${issue?.image}`}
                  alt="issue photo"
                  width={55}
                  height={55}
                  style={{ borderRadius: "8px" }}
                />
              </td>
              <td className="border border-gray-300 p-2">{issue.title}</td>
              <td className="border border-gray-300 p-2">
                {issue?.category?.name}
              </td>
              <td className="border border-gray-300 p-2">
                {issue?.magazine?.title}
              </td>
              <td className="border border-gray-300 p-2">
                {issue?.year}
              </td>
              <td className="border border-gray-300 p-2">
                {issue?.week}
              </td>
              <td className="border border-gray-300 p-2">
                {issue.createdAt ? formatDate(issue.createdAt) : "-"}
              </td>

              <td className="border border-gray-300 p-2">
                {issue.updatedAt ? formatDate(issue.updatedAt) : "-"}
              </td>

              <td className="border border-gray-300 p-2 flex gap-2">
                <Link href={`/issues/${issue.id}`} className="text-blue-500">
                  <button className="bg-yellow-500 cursor-pointer text-white px-2 py-1 rounded">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => deleteIssue(issue.id)}
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

export default IssuesPage;
