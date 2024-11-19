"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

export default function ShopifyCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const shop = searchParams.get("shop");
    const code = searchParams.get("code");

    console.log("Shop:", shop);
    console.log("Code:", code);

    if (!shop || !code) {
      console.error("Missing required parameters (shop or code).");
      alert("An error occurred. Please try again.");
      router.push("/shopify"); // Redirect back to OAuth initiation
      return;
    }

    handleShopifyCallback({ shop, code });
  }, [searchParams, router]);

  const handleShopifyCallback = async ({ shop, code }) => {
    try {
      const user = await new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            unsubscribe();
            resolve(user);
          } else {
            unsubscribe();
            reject(new Error("User is not authenticated."));
          }
        });
      });
  
      const uid = user.uid;
      const token = await user.getIdToken();
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shopify/exchange-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shop, code, uid }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to exchange token.");
      }
  
      const responseData = await response.json();
  
      if (responseData.message === "Store already exists.") {
        console.log("Store already exists:", responseData.store);
        alert("This store is already connected.");
      } else {
        console.log("Store saved:", responseData);
      }
  
      // Redirect to /settings
      router.push("/settings");
    } catch (error) {
      console.error("Error handling Shopify callback:", error);
      alert("An error occurred during the setup process. Please try again.");
    }
  };

  return (
    <div>
      {loading ? (
        <div>
          <h1>Processing Shopify Integration...</h1>
          <p>Please wait while we complete the setup process.</p>
        </div>
      ) : (
        <div>
          <h1>Shopify Integration Complete</h1>
          <p>Redirecting to settings...</p>
        </div>
      )}
    </div>
  );
}
