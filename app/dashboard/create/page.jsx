import { Suspense } from "react";
import CreateClient from "./CreateClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateClient />
    </Suspense>
  );
}