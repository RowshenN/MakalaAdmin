"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateArticleMutation } from "@/services/articleApi";
import { useGetIssuesQuery } from "@/services/issueApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { useGetAuthorsQuery } from "@/services/authorApi";
import dynamic from "next/dynamic";
import { message, Select } from "antd";

const { Option } = Select;

// ✅ dynamic import TipTap editor (client-side only)
const TipTapEditor = dynamic(() => import("@/components/TipTapEditor"), {
  ssr: false,
});

const CreateArticlePage = () => {
  const router = useRouter();
  const [createArticle] = useCreateArticleMutation();

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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsloading(true)
    try {
      e.preventDefault();
      await createArticle(form).unwrap();
      setIsloading(false)
      message.success("succesfully created article")
      router.push("/articles");
    } catch (err) {
      message.error(`Cannot created articel : ${JSON.stringify(err)}`)
      setIsloading(false)
    }
  };

  return (
    <div className="p-10  w-full text-black">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="w-full flex items-center justify-between ">
          <h1 className="text-2xl font-bold mb-4">Create Article</h1>
          <button className="bg-black text-white cursor-pointer p-3 rounded">
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>

        <div className="flex items-center justify-start gap-4 w-full ">
          <p>Title: </p>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border w-full border-gray-300 bg-white outline-0 p-1.5 rounded "
          />
        </div>

        {/* <select
          name="issueId"
          value={form.issueId}
          onChange={handleChange}
          className="border p-3 rounded"
        >
          <option value="">Select Issue</option>
          {issues?.map((i) => (
            <option key={i.id} value={i.id}>
              {i.title}
            </option>
          ))}
        </select> */}

        <div className="flex items-center justify-start gap-4 w-full ">
          <p>Issue: </p>
          <Select
            placeholder="Select Issue"
            value={form.issueId || undefined}
            onChange={(value) =>
              handleChange({ target: { name: "issueId", value } })
            }
            className="w-full border border-gray-600 h-10"
            allowClear
          >
            {issues?.data?.map((i) => (
              <Option key={i.id} value={i.id}>
                {i.title}
              </Option>
            ))}
          </Select>
        </div>

        {/* <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="border p-3 rounded"
        >
          <option value="">Select Category</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select> */}
        <div className="flex items-center justify-start gap-4 w-full ">
          <p>Category: </p>
          <Select
            placeholder="Select Category"
            value={form.categoryId || undefined}
            onChange={(value) =>
              handleChange({ target: { name: "categoryId", value } })
            }
            className="w-full border border-gray-600 h-10"
            allowClear
          >
            {categories?.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* <select
          name="authorId"
          value={form.authorId}
          onChange={handleChange}
          className="border p-3 rounded"
        >
          <option value="">Select Author</option>
          {authors?.map((a) => (
            <option key={a.id} value={a.id}>
              {a.firstName} {a.lastName}
            </option>
          ))}
        </select> */}

        <div className="flex items-center justify-start gap-4 w-full ">
          <p>Author: </p>
          <Select
            placeholder="Select Author"
            value={form.authorId || undefined}
            onChange={(value) =>
              handleChange({ target: { name: "authorId", value } })
            }
            className="w-full border border-gray-600 h-10"
            allowClear
          >
            {authors?.map((a) => (
              <Option key={a.id} value={a.id}>
                {a.firstName} {a.lastName}
              </Option>
            ))}
          </Select>
        </div>

        <div className=" w-[1250px] mb-10 h-[70vh] ">
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

export default CreateArticlePage;
