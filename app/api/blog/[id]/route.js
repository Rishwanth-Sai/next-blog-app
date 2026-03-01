import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
const fs = require("fs");

export async function GET(req, context) {
  await ConnectDB();

  const session = await getServerSession(authOptions);

  const { id } = await context.params;

  const blog = await BlogModel.findById(id).populate("user", "username").lean();

  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let score = 0;
  let currentUserVote = 0;

  if (blog.votes) {
    const voteValues = Object.values(blog.votes);
    score = voteValues.reduce((acc, val) => acc + val, 0);

    if (session?.user?.id) {
      currentUserVote = blog.votes[session.user.id] || 0;
    }
  }

  return NextResponse.json({
    ...blog,
    score,
    currentUserVote,
  });
}

export async function PUT(req, context) {
  await ConnectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const blog = await BlogModel.findById(id);

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  if (
    blog.user.toString() !== session.user.id &&
    session.user.role !== "admin"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();

  let imageURL = blog.image;
  const image = formData.get("image");

  if (image && typeof image === "object") {
    fs.unlink(`./public${blog.image}`, () => {});
    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}_${image.name}`;
    await writeFile(`./public/${filename}`, buffer);
    imageURL = `/${filename}`;
  }

  const updated = await BlogModel.findByIdAndUpdate(
    id,
    {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      image: imageURL,
    },
    { new: true },
  );

  return NextResponse.json({ success: true, blog: updated });
}

export async function DELETE(req, context) {
  await ConnectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const blog = await BlogModel.findById(id);
  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }
  const isOwner = blog.user.toString() === session.user.id;
  const isAdmin = session.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  fs.unlink(`./public${blog.image}`, () => {});
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted successfully" });
}
