import { Suspense } from "react";
import MyblogsClient from "./MyblogsClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <MyblogsClient />
    </Suspense>
  );
}