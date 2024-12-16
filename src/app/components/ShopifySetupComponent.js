"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ShopifySetupComponent() {
  const searchParams = useSearchParams(); // Get query parameters

  useEffect(() => {
    const shop = searchParams.get("shop");

    if (!shop || !shop.includes(".myshopify.com")) {
      console.error("Invalid shop parameter.");
      alert("Invalid or missing Shopify store domain.");
      return;
    }

    // Authenticate with Firebase and redirect to Shopify OAuth
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Build the Shopify OAuth URL
        const oauthUrl = buildShopifyOAuthUrl(shop, user.uid);
        console.log("Redirecting to Shopify OAuth:", oauthUrl);

        // Redirect to Shopify's OAuth flow
        window.location.href = oauthUrl;
      } else {
        alert("Please log in to continue.");
      }
    });
  }, [searchParams]);

  return (
    <div>
      <h1>Setting Up Shopify Integration...</h1>
      <p>Please wait while we redirect you to Shopify&apos;s authentication page.</p>
    </div>
  );
}

// Helper function to build the Shopify OAuth URL
function buildShopifyOAuthUrl(shop, uid) {
  const clientId = process.env.NEXT_PUBLIC_SHOPIFY_APP_API_ID;
  const redirectUri = "https://merchant.portalprints.com/shopify/callback"; // e.g., "https://merchant.portalprints.com/shopify/callback"
  const scopes = "read_products,write_products,read_orders,write_orders"; // Adjust scopes as needed
  const csrfToken = Math.random().toString(36).substring(2); // Generate a random CSRF token

  // Build the `state` parameter with CSRF protection and Firebase user ID
  const state = JSON.stringify({ csrf: csrfToken, uid });

  // Construct the full Shopify OAuth URL
  return `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${encodeURIComponent(state)}`;
}
