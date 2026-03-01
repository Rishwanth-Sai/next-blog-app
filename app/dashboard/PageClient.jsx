"use client";
export const dynamic = "force-dynamic";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");

    if (status === "authenticated") {
      axios.get("/api/blog/myblogs").then((res) => setBlogs(res.data));
    }
  }, [status, router]);

  const recentBlogs = useMemo(() => {
    // show latest 6
    return [...blogs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
      .map((b) => {
        const votes = b.votes || {};
        const score = Object.values(votes).reduce((acc, v) => acc + v, 0);
        return { ...b, score };
      });
  }, [blogs]);

  const stats = useMemo(() => {
    const scored = blogs.map((b) => {
      const votes = b.votes || {};
      const score = Object.values(votes).reduce((acc, v) => acc + v, 0);
      return { ...b, score };
    });

    const totalBlogs = scored.length;
    const totalScore = scored.reduce((acc, b) => acc + b.score, 0);

    const topBlog =
      scored.length === 0
        ? null
        : scored.reduce(
            (best, curr) => (curr.score > best.score ? curr : best),
            scored[0],
          );

    return { totalBlogs, totalScore, topBlog };
  }, [blogs]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="p-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold">
            Welcome {session?.user?.username}
          </h1>
          <p className="mt-2 text-gray-600">
            Quick overview of your recent blogs and their score.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-black bg-white dark:bg-amber-50 p-5">
          <p className="text-sm text-gray-600">Total blogs</p>
          <p className="text-3xl font-bold mt-2">{stats.totalBlogs}</p>
        </div>

        <div className="border border-black bg-white dark:bg-amber-50 p-5">
          <p className="text-sm text-gray-600">Total score</p>
          <p className="text-3xl font-bold mt-2">{stats.totalScore}</p>
        </div>

        <div className="border border-black bg-white dark:bg-amber-50 p-5">
          <p className="text-sm text-gray-600">Top blog</p>
          {stats.topBlog ? (
            <div className="mt-2">
              {/* <p className="font-semibold truncate">{stats.topBlog.title}</p> */}
              <Link
                href={`/blogs/${stats.topBlog._id}?from=dashboard`}
                className="font-semibold underline truncate block"
              >
                {stats.topBlog.title}
              </Link>
              <p className="text-sm mt-1">
                Score: <span className="font-bold">{stats.topBlog.score}</span>
              </p>
            </div>
          ) : (
            <p className="mt-2 text-gray-600">No blogs yet</p>
          )}
        </div>
      </div>

      <div className="mt-8 border border-black bg-white dark:bg-amber-50">
        <div className="px-5 py-4 border-b border-black flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your recent blogs</h2>
          <Link href="/dashboard/myblogs" className="underline text-sm">
            View all
          </Link>
        </div>

        {recentBlogs.length === 0 ? (
          <div className="px-5 py-6 text-gray-600">
            You haven’t created any blogs yet.
          </div>
        ) : (
          <div className="divide-y divide-black">
            {recentBlogs.map((b) => (
              <Link
                key={b._id}
                href={`/blogs/${b._id}?from=dashboard`}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-amber-100"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* optional thumbnail */}
                  <div className="hidden sm:block">
                    <Image
                      src={b.image}
                      alt=""
                      width={56}
                      height={56}
                      className="border border-black object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium truncate">{b.title}</p>
                    <p className="text-xs text-gray-600">
                      Category: {b.category}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">Score</p>
                  <p className="text-lg font-bold">{b.score}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
