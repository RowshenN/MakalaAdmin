"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetArticleBySLugQuery,
  useUpdateArticleMutation,
} from "@/services/articleApi";
import { useGetIssuesQuery } from "@/services/issueApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { useGetAuthorsQuery } from "@/services/authorApi";
import dynamic from "next/dynamic";
import { message, Select } from "antd";

const { Option } = Select;

const TipTapEditor = dynamic(() => import("@/components/TipTapEditor"), {
  ssr: false,
});

const UpdateArticlePage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const { data } = useGetArticleBySLugQuery(slug as string);
  const [updateArticle] = useUpdateArticleMutation();

  const { data: issues } = useGetIssuesQuery();
  const { data: categories } = useGetCategoriesQuery();
  const { data: authors } = useGetAuthorsQuery();

  const [form, setForm] = useState({
    title: "",
    content: "",
    issueId: "",
    categoryId: "",
    authorId: "",
  });

  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title,
        content: data.content,
        issueId: data.issueId || "",
        categoryId: data.categoryId || "",
        authorId: data.authorId || "",
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloading(true)

    if (!data?.id) return;

    try {
      await updateArticle({
        id: data.id,
        body: {
          title: form.title,
          content: form.content,
          issueId: form.issueId || null,
          categoryId: form.categoryId || null,
          authorId: form.authorId || null,
        },
      }).unwrap();
      message.success("succesfully updated article")
      setIsloading(false)
      router.push("/articles");
    } catch (error) {
      message.error(`error updating:  ${error}`)
      setIsloading(false)
      console.error("Update failed:", error);
    }
  };

  if (!data) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 w-full text-black">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* HEADER */}
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-4">Update Article</h1>
          <button className="bg-black text-white cursor-pointer p-3 rounded">
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>

        {/* TITLE */}
        <div className="flex items-center justify-start gap-4 w-full ">
          <p>Title: </p>
          <input
            name="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border w-full border-gray-300 bg-white outline-0 p-1.5 rounded"
          />
        </div>

        {/* ISSUE */}
        <div className="flex items-center justify-start gap-4 w-full ">
          <p>Issue: </p>
          <Select
            placeholder="Select Issue"
            value={form.issueId || undefined}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, issueId: value }))
            }
            className="w-full border border-gray-600 h-10"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {issues?.data.map((i) => (
              <Option key={i.id} value={i.id}>
                {i.title}
              </Option>
            ))}
          </Select>
        </div>

        {/* CATEGORY */}
        <div className="flex items-center justify-start gap-4 w-full ">
          <p>Category: </p>
          <Select
            placeholder="Select Category"
            value={form.categoryId || undefined}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, categoryId: value }))
            }
            className="w-full border border-gray-600 h-10"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {categories?.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* AUTHOR */}
        <div className="flex items-center justify-start gap-4 w-full ">
          <p>Author: </p>
          <Select
            placeholder="Select Author"
            value={form.authorId || undefined}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, authorId: value }))
            }
            className="w-full border border-gray-600 h-10"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {authors?.map((a) => (
              <Option key={a.id} value={a.id}>
                {a.firstName} {a.lastName}
              </Option>
            ))}
          </Select>
        </div>

        {/* CONTENT */}
        <div className="w-[1250px] mb-10 h-[70vh]">
          <label className="mb-2 w-full block">Content:</label>
          <TipTapEditor
            content={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
          />
        </div>
      </form>
    </div>
  );
};

export default UpdateArticlePage;
