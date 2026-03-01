"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import ThemeToggle from "@/Components/ThemeToggle";
import { assets } from "@/Assets/assets";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProfileMenu({
  showHomeLink = false,
  showDashboardLink = true,
  showAdminLink = true,
}) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUrl = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
  const encodedReturnTo = encodeURIComponent(currentUrl);
  useEffect(() => {
    const outside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const esc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", esc);

    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  if (status !== "authenticated") return null;

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="relative" ref={ref}>
      {/* PROFILE IMAGE BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Image
          src={assets.profile_pic} // 🔥 replace with your downloaded image
          alt="profile"
          width={36}
          height={36}
          className="rounded-full border border-black"
        />

        {/* caret appears only when open */}
        {open && (
          <span className="text-sm font-semibold transition-transform">˅</span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 border border-black bg-white dark:bg-amber-50 shadow-lg z-50">
          {/* USER INFO */}
          <div className="px-4 py-3 border-b border-black">
            <p className="font-semibold">{session.user.username}</p>
            <p className="text-xs text-gray-600">{session.user.email}</p>
          </div>

          {/* LINKS */}
          {showHomeLink && (
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-amber-100"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
          )}
          {showDashboardLink && (
            <Link
              href="/dashboard"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-amber-100"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {
            <Link
              href={`/profile?returnTo=${encodedReturnTo}`}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-amber-100"
              onClick={() => setOpen(false)}
            >
              Modify Profile
            </Link>
          }

          {isAdmin && showAdminLink && (
            <Link
              href="/admin"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-amber-100"
              onClick={() => setOpen(false)}
            >
              Admin Panel
            </Link>
          )}

          {/* THEME TOGGLE */}
          <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-amber-100">
            <ThemeToggle />
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-amber-100 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
