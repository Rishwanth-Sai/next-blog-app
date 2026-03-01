import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/lib/models/UserModel";
import { ConnectDB } from "@/lib/config/db";

export async function POST(request) {
  await ConnectDB();

  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "All fields required" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hashedPassword
  });

  return NextResponse.json({ success: true });
}