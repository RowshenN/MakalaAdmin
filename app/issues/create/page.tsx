"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateIssueMutation } from "@/services/issueApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { useGetMagazinesQuery } from "@/services/magazineApi";
import { useGetArticlesQuery } from "@/services/articleApi"; // <-- new
import { BsArrowLeft } from "react-icons/bs";
import { message, Select } from "antd";

const CreateIssuePage = () => {
  const router = useRouter();
  const [createIssue] = useCreateIssueMutation();

  const { data: categories } = useGetCategoriesQuery();
  const { data: magazines } = useGetMagazinesQuery();
  const { data: articles } = useGetArticlesQuery(); // <-- all articles for selection

  const [form, setForm] = useState({
    title: "",
    description: "",
    pageCount: "",
    year: "",
    week: "",
    categoryId: "",
    magazineId: "",
    articleIds: [] as string[], // <-- selected articles
  });

  const [isLoading,setIsloading] = useState(false)

  const [image, setImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsloading(true)
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v)); // append multiple articles
      } else {
        formData.append(key, value as string);
      }
    });

    if (image) formData.append("image", image);
    if (pdf) formData.append("pdf", pdf);

    try {
      await createIssue(formData);
      message.success("succesfully created issue")
      setIsloading(false)
      router.push("/issues");
    } catch(err) {
      message.error(`error when creating issue:  ${err}`)
      setIsloading(false)
    }
  };

  return (
    <div className="p-10 text-black">
      <div className="flex mb-6 items-center gap-3">
        <div
          onClick={() => router.back()}
          className="flex items-center border border-gray-300 rounded-md cursor-pointer py-2 px-3"
        >
          <BsArrowLeft />
        </div>
        <h1 className="text-2xl font-bold">Create Issue</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Title :</label>
          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            className="border p-3 rounded w-[70%]"
          />
        </div>

        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Description :</label>
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="border p-3 rounded w-[70%]"
          />
        </div>

        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Page Count :</label>
          <input
            name="pageCount"
            placeholder="Page Count"
            onChange={handleChange}
            className="border p-3 rounded w-[70%]"
          />
        </div>

        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Year :</label>
          <input
            name="year"
            placeholder="Year"
            onChange={handleChange}
            className="border p-3 rounded w-[70%]"
          />
        </div>

        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Week :</label>
          <input
            name="week"
            placeholder="Week"
            onChange={handleChange}
            className="border p-3 rounded w-[70%]"
          />
        </div>

        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Category :</label>
          <select
            name="categoryId"
            onChange={handleChange}
            className="border p-3 rounded w-[70%]"
          >
            <option value="">Select Category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Magazine :</label>
          <select
            name="magazineId"
            onChange={handleChange}
            className="border p-3 rounded w-[70%]"
          >
            <option value="">Select Magazine</option>
            {magazines?.map((mag) => (
              <option key={mag.id} value={mag.id}>
                {mag.title}
              </option>
            ))}
          </select>
        </div>

        {/* MULTI-SELECT ARTICLES */}
        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Articles :</label>
          <Select
            mode="multiple"
            placeholder="Select Articles"
            value={form.articleIds}
            onChange={(value) => setForm({ ...form, articleIds: value })}
            options={articles?.data?.map((a) => ({
              label: a.title,
              value: a.id,
            }))}
            className="w-[70%] h-10 border border-black!"
          />
        </div>

        <div className="flex items-center justify-between ">
          <label htmlFor="">Image</label>

          <input
          type="file"
          accept="image/*"
          className="border border-gray-400 py-2 px-2 rounded-md cursor-pointer"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        </div>

        {image && (
          <div className="mt-4">
            <p className="mb-2">Preview:</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-64 h-64 object-cover border rounded"
            />
          </div>
        )}

        <div className="flex items-center justify-between ">
          <p></p>
          <label htmlFor="">Pdf: </label>
          <input
          type="file"
          accept="application/pdf"
          className="border border-gray-400 py-2 px-2 rounded-md cursor-pointer"
          onChange={(e) => setPdf(e.target.files?.[0] || null)}
        />
        </div>

        {pdf && (
          <p className="text-sm text-gray-600">Selected PDF: {pdf.name}</p>
        )}  

        <button className="bg-black cursor-pointer text-white p-3 rounded">
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateIssuePage;
