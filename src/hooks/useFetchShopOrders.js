import { useState } from "react";
import { auth } from "@/lib/firebase";
import { useStoreDataNew } from "@/hooks/useStoreData";

export function useFetchShopOrders() {
    const [orders, setOrders] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { storeData, isLoading: isStoreLoading, error: storeError } = useStoreDataNew();
  
    const fetchShopOrders = async () => {
      // console.log("fetchShopOrders invoked");
      if (storeError) {
        // console.log(storeData)
        setError("Store data is still loading or there was an error.");
        return;
      }
  
      if (!storeData || storeData.length === 0) {
        setError("No store data available.");
        return;
      }
  
      const storeDomain = storeData[0]?.store_domain;
      if (!storeDomain) {
        setError("Store domain is not available.");
        return;
      }
  
      try {
        console.log("Starting API call");
        setIsLoading(true);
        setError(null);
  
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
  
        const token = await user.getIdToken();
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shopify/getShopOrders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            storeDomain,
            uid: user.uid,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch shop orders: ${response.statusText}`);
        }
  
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
        setOrders(null);
      } finally {
        console.log("API call finished");
        setIsLoading(false);
      }
    };
  
    return {
      orders,
      isLoading,
      error,
      fetchShopOrders,
      storeLoading: isStoreLoading,
      storeError,
    };
  }
  