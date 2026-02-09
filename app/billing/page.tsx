import { Suspense } from "react";
import BillingContent from "./billing-content";

export default function BillingPage() {
  return (
    <main className="min-h-screen text-white">
      <Suspense fallback={<div className="pt-20 pb-16" />}>
        <BillingContent />
      </Suspense>
    </main>
  );
}
