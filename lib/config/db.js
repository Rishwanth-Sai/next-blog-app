import mongoose from "mongoose";

export async function ConnectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(uri);
}