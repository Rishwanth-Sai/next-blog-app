"use client";
export const dynamic = "force-dynamic";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import AdminBlogItem from "./AdminBlogItem";
import ProfileMenu from "@/Components/ProfileMenu";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.push("/");
    } else {
      fetchBlogs();
    }
  }, [session, status]);

  const fetchBlogs = async () => {
    const res = await axios.get("/api/blog/admin");
    setBlogs(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/blog/${id}`);
    fetchBlogs();
  };

  if (!session || session.user.role !== "admin") return null;

  const adminBlogs = blogs.filter(
    (blog) => blog.user?._id === session.user.id
  );

  return (
    <div className="p-10 max-w-5xl mx-auto">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Page</h1>
        <ProfileMenu showHomeLink={true} showDashboardLink={true} showAdminLink={false} />
      </div>

      {/* Create Blog */}
      <div className="mb-10">
        <Link
          href="/dashboard/create?from=admin"
          className="bg-black text-white px-5 py-2"
        >
          Create Blog
        </Link>
      </div>

      {/* Your Blogs */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Your Blogs
        </h2>

        <div className="flex flex-col gap-4">
          {adminBlogs.map((blog) => (
            <AdminBlogItem
              key={blog._id}
              blog={blog}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* All Blogs */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          All Blogs
        </h2>

        <div className="flex flex-col gap-4">
          {blogs.map((blog) => (
            <AdminBlogItem
              key={blog._id}
              blog={blog}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

    </div>
  );
}