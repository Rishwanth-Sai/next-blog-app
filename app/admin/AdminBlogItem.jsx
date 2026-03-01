"use client";

import Image from "next/image";
import Link from "next/link";

const AdminBlogItem = ({ blog, onDelete }) => {
  return (
    <div className="border border-black p-4 w-full flex justify-between items-center">

      <Link
        href={`/blogs/${blog._id}?from=admin`}
        className="flex items-center gap-4"
      >
        <Image
          src={blog.image}
          alt=""
          width={80}
          height={80}
          className="border"
        />
        <div>
          <h3 className="font-semibold hover:underline">
            {blog.title}
          </h3>
          <p className="text-sm text-gray-500">
            Author: {blog.user?.username}
          </p>
          <p className="text-xs">{blog.category}</p>
        </div>
      </Link>

      <div className="flex gap-3">
        <Link
          href={`/dashboard/edit/${blog._id}?from=admin`}
          className="bg-blue-500 text-white px-3 py-1 text-sm"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete(blog._id)}
          className="bg-red-500 text-white px-3 py-1 text-sm cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminBlogItem;