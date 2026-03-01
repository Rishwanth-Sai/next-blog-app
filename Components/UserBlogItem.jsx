"use client";

import Image from "next/image";
import Link from "next/link";

const UserBlogItem = ({ blog, onDelete }) => {
  return (
    <div className="max-w-82.5 sm:max-w-75 bg-white border border-black hover:shadow-[-7px_7px_7px_#000000]">
      {/* Clickable Image */}
      <Link href={`/blogs/${blog._id}`}>
        <Image
          src={blog.image}
          alt=""
          width={400}
          height={400}
          className="border-b border-black cursor-pointer"
        />
      </Link>

      <p className="ml-5 mt-5 px-1 inline-block bg-black text-white text-sm">
        {blog.category}
      </p>

      <div className="p-5">
        {/* Clickable Title */}
        <Link href={`/blogs/${blog._id}`}>
          <h5 className="mb-2 text-lg font-medium hover:underline cursor-pointer">
            {blog.title}
          </h5>
        </Link>

        <p className="mb-3 text-sm text-gray-700">
          {blog.description.slice(0, 110)}...
        </p>

        <div className="flex justify-between items-center mt-4">
          <Link
            href={`/dashboard/edit/${blog._id}`}
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
    </div>
  );
};

export default UserBlogItem;