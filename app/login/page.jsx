"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        return;
      }

      const session = await getSession();
      if (session?.user?.role === "admin") router.push("/admin");
      else router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-amber-50">
      <div className="w-full max-w-md border border-black bg-white dark:bg-amber-50 shadow-[6px_6px_0px_#000] p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-3xl text-center font-bold">Welcome back</h1>
          <p className="text-sm text-center text-gray-600 mt-1">
            Login to manage your blogs and vote.
          </p>
        </div>

        {error && (
          <div className="mb-4 border border-black bg-red-50 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-sm flex items-center justify-between">
            <p>
              New user?{" "}
              <Link href="/signup" className="underline font-medium text-blue-400">
                Create account
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