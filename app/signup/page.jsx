"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/signup", data);

      if (res.data.success) {
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-amber-50">
      <div className="w-full max-w-md border border-black bg-white dark:bg-amber-50 shadow-[6px_6px_0px_#000] p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-3xl text-center font-bold">Create account</h1>
          <p className="text-sm text-center text-gray-600 mt-1">
            Publish your blogs and manage them from dashboard.
          </p>
        </div>

        {error && (
          <div className="mb-4 border border-black bg-red-50 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="w-full border border-black px-3 py-2 bg-white"
              type="text"
              placeholder="Enter your name"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full border border-black px-3 py-2 bg-white"
              type="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Password</label>
              <button
                type="button"
                className="text-xs underline cursor-pointer"
                onClick={() => setShowPass((v) => !v)}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            <input
              className="w-full border border-black px-3 py-2 bg-white"
              type={showPass ? "text" : "password"}
              placeholder="Minimum 6 characters"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <div className="text-sm flex items-center justify-between">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="underline text-blue-400 font-medium">
                Login
              </Link>
            </p>
            <Link href="/" className="underline">
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}