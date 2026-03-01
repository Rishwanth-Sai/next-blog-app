import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
const fs = require("fs");

const LoadDB = async () => {
  await ConnectDB();
};
// for production connecting to be db should be in runtime phase, not build phase
// LoadDB();
export async function GET(req) {
  await ConnectDB();

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page")) || 1;
  const category = searchParams.get("category");

  const limit = 6;
  const skip = (page - 1) * limit;

  let filter = {};
  if (category && category !== "All") {
    filter.category = category;
  }

  const blogs = await BlogModel.find(filter)
    .populate("user", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalBlogs = await BlogModel.countDocuments(filter);
  const totalPages = Math.ceil(totalBlogs / limit);

  return NextResponse.json({
    blogs,
    totalPages,
    currentPage: page,
  });
}

export async function POST(request) {
  await ConnectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const timestamp = Date.now();
  const image = formData.get("image");
  const imageByteData = await image.arrayBuffer();
  const buffer = Buffer.from(imageByteData);
  const path = `./public/${timestamp}_${image.name}`;

  await writeFile(path, buffer);
  const imageURL = `/${timestamp}_${image.name}`;

  const blogData = {
    title: `${formData.get("title")}`,
    description: `${formData.get("description")}`,
    category: `${formData.get("category")}`,
    image: `${imageURL}`,
    user: session.user.id 
  };
  await BlogModel.create(blogData);
  console.log("Blog Saved");
  return NextResponse.json({ success: true, msg: "Blog Added" });
}

