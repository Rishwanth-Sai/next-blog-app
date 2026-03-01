"use client";
export const dynamic = "force-dynamic";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import UserBlogItem from "@/Components/UserBlogItem";

export default function MyBlogs() {
  const { status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      axios.get("/api/blog/myblogs").then((res) => {
        setBlogs(res.data);
      });
    }
  }, [status, router]);

  const handleDelete = async (id) => {
    await axios.delete(`/api/blog/${id}`);
    setBlogs(blogs.filter((blog) => blog._id !== id));
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="p-10">

      <h2 className="text-2xl font-semibold mb-6">
        Your Blogs
      </h2>

      <div className="flex flex-wrap justify-around gap-6">
        {blogs.map((blog) => (
          <UserBlogItem
            key={blog._id}
            blog={blog}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}