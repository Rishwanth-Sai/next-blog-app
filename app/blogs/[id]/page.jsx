import { Suspense } from "react";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogClient />
    </Suspense>
  );
}