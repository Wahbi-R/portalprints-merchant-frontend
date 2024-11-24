"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { saveStoreData } from "@/hooks/useSaveStoreData";
import { useStore } from "@/context/StoreContext";

export default function ShopifyPage() {
  const searchParams = useSearchParams();
  const { storeName, setStoreName } = useStore();

  useEffect(() => {
    const shop = searchParams.get("shop");
    const accessToken = searchParams.get("accessToken");
    // Handle missing parameters
    if (!shop || !accessToken) {
      console.error("Missing required parameters (shop or accessToken).");
      alert("Missing required parameters. Please check your URL and try again.");
      return;
    }
    setStoreName(shop)

    const handleSaveStore = async () => {
      try {
        // Wait for authentication if user is not authenticated
        const user = await new Promise((resolve, reject) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
              unsubscribe(); // Cleanup the listener
              resolve(user);
            } else {
              console.log("Waiting for authentication...");
            }
          });

          // Set timeout to avoid infinite waiting in edge cases
          setTimeout(() => reject(new Error("Authentication timeout")), 100000);
        });

        // Use saveStoreData to manage store saving logic
        const response = await saveStoreData({
          storeDomain: shop,
          storeName: null, // Leave store name as null
          storeAccessToken: accessToken,
        });

        // Handle response cases
        if (response.exists) {
          console.log("Store found:", response.store.store_domain);
        } else {
          console.log("Store saved successfully:", response.store.store_domain);
        }

        // Save storeDomain as a cookie (client-side only)
        if (typeof document !== "undefined") {
          document.cookie = `storeDomain=${shop}; Path=/; Max-Age=2592000; Secure; SameSite=Strict`;
        }

        // Redirect to /orders after success
        window.location.href = "/orders";
      } catch (error) {
        if (error.message === "Authentication timeout") {
          console.error("Authentication timeout occurred.");
          alert("Authentication timeout. Please log in and try again.");
        } else {
          console.error("Error saving the store:", error.message);
          alert(`An error occurred: ${error.message}`);
        }
      }
    };

    handleSaveStore();
  }, [searchParams]);

  return (
    <div>
      <h1>Saving Your Shopify Store...</h1>
      <p>Please wait while we complete the process.</p>
    </div>
  );
}
