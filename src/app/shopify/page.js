"use client"; // Required for Client Components

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ShopifySetupComponent from "../components/ShopifySetupComponent";

export default function ShopifyPage() {
  return (
    <Suspense fallback={<div>Loading Shopify Integration...</div>}>
      <ShopifySetupComponent />
    </Suspense>
  );
}
