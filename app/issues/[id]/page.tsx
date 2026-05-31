"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useGetIssueByIdQuery,
  useUpdateIssueMutation,
} from "@/services/issueApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { useGetMagazinesQuery } from "@/services/magazineApi";
import { useGetArticlesQuery } from "@/services/articleApi";
import { BsArrowLeft } from "react-icons/bs";
import { message, Select } from "antd";

const UpdateIssuePage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data } = useGetIssueByIdQuery(id as string, {
    refetchOnMountOrArgChange: true,
  });

  const [updateIssue] = useUpdateIssueMutation();

  const { data: categories } = useGetCategoriesQuery();
  const { data: magazines } = useGetMagazinesQuery();
  const { data: articles } = useGetArticlesQuery();

  const [form, setForm] = useState({
    title: "",
    description: "",
    pageCount: "",
    year: "",
    week: "",
    categoryId: "",
    magazineId: "",
    articleIds: [] as string[],
  });

  const [isLoading, setIsloading] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [pdf, setPdf] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [removePdf, setRemovePdf] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        description: data.description || "",
        pageCount: data.pageCount?.toString() || "",
        year: data.year?.toString() || "",
        week: data.week?.toString() || "",
        categoryId: data.category?.id || "",
        magazineId: data.magazine?.id || "",
        articleIds: data.articles?.map((a) => a.id) || [],
      });
      setPreview(data.image || null);
      setPdfPreview(data.pdf || null);
    }
  }, [data]);

  if (!form) return <p className="p-10">Loading...</p>;

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsloading(true);
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach((v) => formData.append(key, v));
      else formData.append(key, value as string);
    });

    if (image) formData.append("image", image);
    if (removeImage) formData.append("removeImage", "true");

    if (pdf) formData.append("pdf", pdf);
    if (removePdf) formData.append("removePdf", "true");

    try {
      await updateIssue({ id, body: formData }).unwrap();
      setIsloading(false)
      message.success("Succesfully updated issue")
      router.push("/issues");
    } catch (err) {
      setIsloading(false)
      message.error(`Error updating: ${err}`)
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
        <h1 className="text-2xl font-bold">Update Issue</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Title :</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="border p-3 rounded w-[70%]"
          />
        </div>

        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Description :</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border p-3 rounded w-[70%]"
          />
        </div>

        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Page Count :</label>
          <input
            name="pageCount"
            value={form.pageCount}
            onChange={handleChange}
            className="border p-3 rounded w-[70%]"
          />
        </div>

        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Year :</label>
          <input
            name="year"
            value={form.year}
            onChange={handleChange}
            className="border p-3 rounded w-[70%]"
          />
        </div>

        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Week :</label>
          <input
            name="week"
            value={form.week}
            onChange={handleChange}
            className="border p-3 rounded w-[70%]"
          />
        </div>

        <div className="flex gap-2 items-center justify-between w-full ">
          <label htmlFor="title">Category :</label>
          <select
            name="categoryId"
            value={form.categoryId}
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
            value={form.magazineId}
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
            className="w-[70%] h-10 border border-black! "
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Image</label>

          <input
            type="file"
            className="border border-gray-400 py-2 px-2 rounded-md cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImage(file);

              if (file) {
                setPreview(URL.createObjectURL(file));
                setRemoveImage(false);
              }
            }}
          />

          {/* IMAGE PREVIEW */}
          {preview && (
            <div className="mt-2 flex flex-col gap-2">
              <p className="text-sm text-gray-600">Image Preview:</p>

              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded border"
              />

              {/* REMOVE BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setImage(null);
                  setRemoveImage(true);
                }}
                className="w-fit px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">PDF</label>

          <input
            type="file"
            accept="application/pdf"
            className="border border-gray-400 py-2 px-2 rounded-md cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setPdf(file);

              if (file) {
                setPdfPreview(URL.createObjectURL(file));
                setRemovePdf(false);
              }
            }}
          />

          {/* PDF PREVIEW */}
          {pdfPreview && (
            <div className="mt-2 flex flex-col gap-2">
              <p className="text-sm text-gray-600">PDF Attached</p>

              <a
                href={pdfPreview}
                target="_blank"
                className="text-blue-600 underline text-sm"
              >
                Open PDF
              </a>

              <button
                type="button"
                onClick={() => {
                  setPdfPreview(null);
                  setPdf(null);
                  setRemovePdf(true);
                }}
                className="w-fit px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Remove PDF
              </button>
            </div>
          )}
        </div>

        <button className="bg-black cursor-pointer text-white p-3 rounded mt-4">
          {isLoading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateIssuePage;
