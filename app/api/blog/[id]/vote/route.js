import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  await ConnectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { value } = await req.json(); // 1 or -1 or 0

  if (![1, -1].includes(value)) {
    return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
  }

  const blog = await BlogModel.findById(id);

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  const userId = session.user.id;
  const existingVote = blog.votes.get(userId) || 0;

  if (existingVote === value) {
    // Remove vote if same clicked again
    blog.votes.delete(userId);
  } else {
    blog.votes.set(userId, value);
  }

  await blog.save();

  return NextResponse.json({ message: "Vote updated" });
}
