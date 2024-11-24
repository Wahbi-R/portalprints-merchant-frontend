"use client";

import { useState } from "react";
import { fetchOrders } from "@/hooks/useOrdersData";
import { auth } from "@/lib/firebase";
import { useStore } from "@/context/StoreContext";

export default function SyncOrdersButton({ setOrdersList }) {
  const [loading, setLoading] = useState(false);
  const { storeName } = useStore()

  const handleSyncOrders = async () => {
    if (!storeName) return;

    setLoading(true);
    try {
      // Make sure the users authenticated
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
      if(!user.uid) {
        return;
      }
      console.log("storeDomain:", storeName)
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shopify/getShopOrders`, {
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
        throw new Error(`Failed to fetch shop orders: ${response.statusText}`);
      }
      const updatedOrders = await fetchOrders(storeName);
      setOrdersList(updatedOrders);
    } catch (error) {
      console.error("Error syncing orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSyncOrders}
      className={`px-4 py-2 rounded-2xl text-center ${
        loading
          ? "bg-gray-400 text-black cursor-not-allowed"
          : "bg-gray-300 text-black hover:bg-gray-600"
      }`}
      disabled={loading}
      style={{ width: "120px" }} // Set fixed width
    >
      {loading ? (
        <span className="flex justify-center items-center">
          Syncing
          <span className="dots ml-1"></span>
        </span>
      ) : (
        "Sync Orders"
      )}
    </button>
  );
}