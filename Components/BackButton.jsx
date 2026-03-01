"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ from }) {
  const router = useRouter();

  const handleBack = () => {
    // ✅ If "from" looks like a path (/something), go there directly
    if (typeof from === "string" && from.startsWith("/")) {
      router.push(from);
      return;
    }

    // ✅ Old behavior for keywords
    if (from === "admin") return router.push("/admin");
    if (from === "dashboard") return router.push("/dashboard");
    if (from === "home") return router.push("/");
    if (from === "myblogs") return router.push("/dashboard/myblogs");

    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="mb-6 mt-5 px-4 py-2 border border-black cursor-pointer"
    >
      ← Back
    </button>
  );
}