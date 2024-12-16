import { useState } from "react";
import { auth } from "@/lib/firebase";

export function useAddProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addProduct = async ({ storeDomain, product, name, description, margin, variants }) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isLoading) return; // debounce
      // Get the authenticated user
      const user = await new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            unsubscribe();
            resolve(user);
          } else {
            console.log("Waiting for authentication...");
          }
        });
      });

      const token = await user.getIdToken();
      console.log("nd", name, description);

      // Make the API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shopify/addProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: user.uid, // User ID from Firebase
          storeDomain: storeDomain,   // Shopify store domain
          product_id: product.product_id,     // ID of the product from your database
          // TODO: Variants to use
          name,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add product: ${response.statusText}`);
      }

      const data = await response.json();
      return data; // Return the response data
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { addProduct, isLoading, error };
}
