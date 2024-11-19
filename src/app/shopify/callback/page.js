"use client";

import { Suspense } from "react";
import ShopifyCallbackContent from "@/app/components/ShopifyCallbackContent";

export const dynamic = "force-dynamic"; // Disable pre-rendering entirely

export default function ShopifyCallback() {
  return (
    <Suspense fallback={<div>Loading Shopify Integration...</div>}>
      <ShopifyCallbackContent />
    </Suspense>
  );
}
