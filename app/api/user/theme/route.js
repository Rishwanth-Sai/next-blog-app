import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import UserModel from "@/lib/models/UserModel";
import { ConnectDB } from "@/lib/config/db";

export async function PATCH(req) {
  await ConnectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { theme } = await req.json();

  await UserModel.findByIdAndUpdate(session.user.id, { theme });

  return NextResponse.json({ success: true });
}