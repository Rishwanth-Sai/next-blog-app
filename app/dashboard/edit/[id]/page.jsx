import { Suspense } from "react";
import EditClient from "./EditClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditClient />
    </Suspense>
  );
}