"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { assets } from "@/Assets/assets";
import { toast } from "react-toastify";
import Image from "next/image";
import BackButton from "@/Components/BackButton";

export default function EditBlog() {
  const { id } = useParams();
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [image, setImage] = useState(false);
  const [existingImage, setExistingImage] = useState("");
  const [initialData, setInitialData] = useState(null);
  const [initialImage, setInitialImage] = useState("");
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "Lifestyle",
  });

  const [loading, setLoading] = useState(true);
  const isDirty = !!initialData && (
    data.title !== initialData.title ||
    data.description !== initialData.description ||
    data.category !== initialData.category ||
    !!image // new file selected
  );

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${id}`);
        setData({
          title: res.data.title,
          description: res.data.description,
          category: res.data.category,
        });
        setExistingImage(res.data.image);
        setInitialData({
          title: res.data.title,
          description: res.data.description,
          category: res.data.category,
        });
        setInitialImage(res.data.image);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load blog");
        router.push("/dashboard");
      }
    };

    fetchBlog();
  }, [id]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  if (status === "loading" || loading) return <p>Loading...</p>;

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);

    // Only append image if user selected a new one
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.put(`/api/blog/${id}`, formData);

      if (response.data.success) {
        toast.success("Blog Updated Successfully");
        if (from === "admin") router.push("/admin");
        else router.push("/dashboard/myblogs");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-10">
      <BackButton />
      <form onSubmit={onSubmitHandler} className="pt-5 px-5 sm:pt-12 sm:pl-16">
        <p className="text-xl">Upload thumbnail</p>

        <label htmlFor="image">
          <Image
            className="mt-4 cursor-pointer"
            src={
              image
                ? URL.createObjectURL(image)
                : existingImage
                  ? existingImage
                  : assets.upload_area
            }
            alt=""
            width={140}
            height={70}
          />
        </label>

        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          id="image"
          hidden
        />

        <p className="text-xl mt-4">Blog Title</p>
        <input
          name="title"
          onChange={onChangeHandler}
          value={data.title}
          className="w-full sm:w-125 mt-4 px-4 py-3 border"
          type="text"
          placeholder="Enter title"
          required
        />

        <p className="text-xl mt-4">Blog Description</p>
        <textarea
          name="description"
          onChange={onChangeHandler}
          value={data.description}
          className="w-full sm:w-125 mt-4 px-4 py-3 border"
          placeholder="Enter description"
          rows={6}
          required
        />

        <p className="text-xl mt-4">Blog Category</p>
        <select
          name="category"
          onChange={onChangeHandler}
          value={data.category}
          className="w-40 mt-4 px-4 py-3 border font-bold text-gray-500"
        >
          <option value="Food"> Food</option>
          <option value="Technology"> Technology</option>
          <option value="Lifestyle"> Lifestyle</option>
          <option value="Finance"> Finance</option>
          <option value="Travel"> Travel</option>
        </select>

        <br />
        <button
          type="submit"
          disabled={!isDirty}
          className="mt-8 w-40 h-12 bg-black text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Update
        </button>
      </form>
    </div>
  );
}
