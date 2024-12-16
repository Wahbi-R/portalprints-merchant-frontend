"use client";

import { auth } from "@/lib/firebase";

export async function fetchVariants(products) {
    // console.log(products)
  const productIds = products.map((product) => product.product_id);

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
    setTimeout(() => reject(new Error("Authentication timeout")), 10000);
  });

  const token = await user.getIdToken();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/variants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productIds }),
  });

  if (!response.ok) {
    throw new Error(`Error fetching variants: ${response.statusText}`);
  }

  return response.json();
}
