import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ConnectDB } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";

export async function PATCH(req) {
  await ConnectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username, email, currentPassword, newPassword } = await req.json();

  if (!username || !email || !currentPassword) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const user = await UserModel.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  // Check uniqueness (exclude self)
  const existing = await UserModel.findOne({
    $or: [{ username }, { email }],
    _id: { $ne: user._id },
  });

  if (existing) {
    return NextResponse.json({ error: "Username or email already in use" }, { status: 400 });
  }

  user.username = username;
  user.email = email;

  if (newPassword) {
    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();

  return NextResponse.json({
    success: true,
    user: {
      username: user.username,
      email: user.email,
    },
  });
}