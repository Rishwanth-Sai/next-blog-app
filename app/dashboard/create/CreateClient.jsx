"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import axios from "axios";
import { assets } from "@/Assets/assets";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-toastify";
import BackButton from "@/Components/BackButton";

export default function CreateBlog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const { status } = useSession();

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "Lifestyle",
  });
  
  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }
  
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
    console.log(data);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("image", image);
    const response = await axios.post("/api/blog", formData);
    if (response.data.success) {
      toast.success(response.data.msg);
      setImage(false);
      setData({
        title: "",
        description: "",
        category: "Lifestyle",
      });
      // router.push("/dashboard");
    } else {
      toast.error("Error");
    }
  };

  return (
    <div className="p-10">
      <form onSubmit={handleSubmit} className="pt-5 px-5 sm:pt-12 sm:pl-16">
        <p className="text-xl">Upload thumbnail</p>
        <label htmlFor="image">
          <Image
            className="mt-4 cursor-pointer"
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
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
          required
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
          type="text"
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
        <button type="submit" className="mt-8 w-40 h-12 bg-black text-white cursor-pointer">
          Create
        </button>
      </form>
      <BackButton/>
    </div>
  );
}
