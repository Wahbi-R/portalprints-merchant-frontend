"use client";

export const dynamic = "force-dynamic"; // Prevent pre-rendering

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ShopifyPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const shop = searchParams.get("shop");

    if (!shop || !shop.includes(".myshopify.com")) {
      alert("Invalid or missing Shopify store domain.");
      console.error("Invalid or missing `shop` parameter in the URL.");
      return;
    }

    // Redirect to Shopify OAuth
    const oauthUrl = buildShopifyOAuthUrl(shop);
    window.location.href = oauthUrl;
  }, [searchParams]);

  return (
    <div>
      <h1>Redirecting to Shopify...</h1>
      <p>Please wait while we authenticate your store.</p>
    </div>
  );
}

// Helper to build the Shopify OAuth URL
function buildShopifyOAuthUrl(shop) {
  const clientId = process.env.NEXT_PUBLIC_SHOPIFY_APP_API_ID;
  const redirectUri = `https://merchant.portalprints.com/shopify/callback`; // Update with your base URL
  const scopes = "read_products,write_products,read_orders,write_orders"; // Adjust based on your needs

  return `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
}
