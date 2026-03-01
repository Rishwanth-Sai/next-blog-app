"use client";

import React, { useEffect, useState } from "react";
import BlogItem from "./BlogItem";
import axios from "axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("All");

  const fetchBlogs = async () => {
    const response = await axios.get(
      `/api/blog?page=${page}&category=${category}`
    );
    setBlogs(response.data.blogs);
    setTotalPages(response.data.totalPages);
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, category]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1); // reset page safely
  };

  return (
    <div>

      <div className="flex justify-center gap-6 my-10">
        {["All", "Technology", "Food", "Finance", "Lifestyle", "Travel"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={
                category === cat
                  ? "bg-black text-white py-1 px-4 rounded-sm"
                  : "py-1 px-4"
              }
            >
              {cat}
            </button>
          )
        )}
      </div>

      <div className="flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24">
        {blogs.map((item) => (
          <BlogItem
            key={item._id}
            id={item._id}
            title={item.title}
            description={item.description}
            category={item.category}
            image={item.image}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-10 mb-5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 border border-black cursor-pointer ${
                page === i + 1 ? "bg-black text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default BlogList;