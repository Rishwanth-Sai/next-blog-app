import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import BlogModel from "@/lib/models/BlogModel";
import { ConnectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";

export async function GET() {
  await ConnectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const blogs = await BlogModel.find({ user: session.user.id });

  return NextResponse.json(blogs);
}