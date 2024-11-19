"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { saveStoreData } from "@/hooks/useSaveStoreData";

export default function ShopifyCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const shop = searchParams.get("shop");
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    console.log("Shop:", shop);
    console.log("Code:", code);
    console.log("State:", state);
    if (!shop || !code || !state) {
      console.error("Missing required parameters (shop, code, or state).");
      alert("An error occurred. Please try again.");
      return;
    }

    handleShopifyCallback({ shop, code, state });
  }, [searchParams, router]);

  const handleShopifyCallback = async ({ shop, code, state }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shopify/exchange-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, code }),
      });

      if (!response.ok) {
        throw new Error("Failed to exchange token.");
      }

      const { accessToken } = await response.json();

      // Save the store data
      await saveStoreData({
        storeDomain: shop,
        storeName: "Unknown Store", // Replace this with a call to get the store name if needed
        storeAccessToken: accessToken,
      });

      // Redirect to /settings
      router.push("/settings");
    } catch (error) {
      console.error("Error handling Shopify callback:", error);
      alert("An error occurred during the setup process. Please try again.");
    }
  };

  return (
    <div>
      <h1>Processing Shopify Integration...</h1>
      <p>Please wait while we complete the setup process.</p>
    </div>
  );
}
