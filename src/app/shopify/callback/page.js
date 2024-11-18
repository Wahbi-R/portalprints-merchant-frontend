"use client";
/* eslint-disable react/no-unescaped-entities */

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { saveStoreData } from "@/hooks/useSaveStoreData"; // Import saveStoreData function

export default function ShopifyCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Handle the Shopify callback logic
  const handleShopifyCallback = async ({ shop, code, state }) => {
    try {
      // Step 1: Parse the state parameter
      const parsedState = parseState(state);
      if (!parsedState || !parsedState.uid) {
        throw new Error("Invalid state parameter.");
      }

      const { uid } = parsedState;

      // Step 2: Exchange the authorization code for an access token
      const accessToken = await exchangeCodeForAccessToken(shop, code);

      // Step 3: Save the store data
      await saveStoreData({
        storeDomain: shop,
        storeName: "Unknown Store", // Replace this with a call to get the store name if needed
        storeAccessToken: accessToken,
      });

      // Step 4: Redirect to the /settings page
      router.push("/settings");
    } catch (error) {
      console.error("Error handling Shopify callback:", error);
      alert("An error occurred during the setup process. Please try again.");
    }
  };
  
  useEffect(() => {
    // Extract parameters from the query string
    const shop = searchParams.get("shop");
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!shop || !code || !state) {
      console.error("Missing required parameters (shop, code, or state).");
      alert("An error occurred. Please try again.");
      return;
    }

    handleShopifyCallback({ shop, code, state });
  }, [searchParams, router]);


  return (
    <div>
      <h1>Processing Shopify Integration...</h1>
      <p>Please wait while we complete the setup process.</p>
    </div>
  );
}

// Helper: Parse the state parameter safely
function parseState(state) {
  try {
    return JSON.parse(state);
  } catch (error) {
    console.error("Error parsing state parameter:", error);
    return null;
  }
}

// Helper: Exchange the authorization code for an access token
async function exchangeCodeForAccessToken(shop, code) {
  const clientId = process.env.NEXT_PUBLIC_SHOPIFY_APP_API_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_SECRET;

  try {
    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to exchange token:", errorData);
      throw new Error(errorData.error || "Failed to exchange token.");
    }

    const { access_token } = await response.json();
    return access_token;
  } catch (error) {
    console.error("Error exchanging code for access token:", error);
    throw error;
  }
}
