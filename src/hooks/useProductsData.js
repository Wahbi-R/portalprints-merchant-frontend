"use client";

import { useQuery } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";

export async function fetchProducts(storeDomain) {
  const user = await new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        unsubscribe(); // Cleanup the listener
        resolve(user);
      } else {
        console.log("Waiting for authentication...");
      }
    });
  });

  const token = await user.getIdToken();
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  url.searchParams.append("uid", user.uid);
  url.searchParams.append("storeDomain", storeDomain);
  url.searchParams.append("vendor", "Portal")

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    console.log("Error fetching order data.")
    return []
  }

  return response.json();
}
