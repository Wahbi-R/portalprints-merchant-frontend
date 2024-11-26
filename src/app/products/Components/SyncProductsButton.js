"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { useStore } from "@/context/StoreContext";
import { fetchProducts } from "@/hooks/useProductsData";
import { fetchVariants } from "@/hooks/useVariantsData";
import { groupProductsWithVariants } from "../page";

export default function SyncProductsButton({ setProductsList }) {
  const [loading, setLoading] = useState(false);
  const { storeName } = useStore();

  const handleSyncProducts = async () => {
    if (!storeName) return;

    setLoading(true);
    try {
      // Ensure the user is authenticated
      const user = await new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            unsubscribe();
            resolve(user);
          } else {
            console.log("Waiting for authentication...");
          }
        });

        // Set timeout to avoid infinite waiting in edge cases
        setTimeout(() => reject(new Error("Authentication timeout")), 100000);
      });

      if (!user.uid) {
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shopify/getStoreProducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeDomain: storeName,
          uid: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to sync products: ${response.statusText}`);
      }
      console.log("success")
    //   Fetch the updated products after syncing
    const updatedProducts = await fetchProducts(storeName);
    const variantsList = await fetchVariants(updatedProducts);
    //   const updatedProducts = await fetch(`/api/products?storeName=${storeName}`).then((res) =>
    //     res.json()
    //   );

    //   // Update the products list in the parent state
    const productVariantList = groupProductsWithVariants(updatedProducts, variantsList)
    setProductsList(productVariantList);
    } catch (error) {
      console.error("Error syncing products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSyncProducts}
      className={`px-4 py-2 rounded-2xl text-center ${
        loading
          ? "bg-gray-400 text-black cursor-not-allowed"
          : "bg-gray-300 text-black hover:bg-gray-600"
      }`}
      disabled={loading}
      style={{ width: "140px" }} // Adjust button width
    >
      {loading ? (
        <span className="flex justify-center items-center">
          Syncing
          <span className="dots ml-1"></span>
        </span>
      ) : (
        "Sync Products"
      )}
    </button>
  );
}
