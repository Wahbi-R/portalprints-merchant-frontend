"use client";

import { useQuery } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";

export async function fetchOrders(storeDomain) {
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
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`);
  url.searchParams.append("uid", user.uid);
  url.searchParams.append("storeDomain", storeDomain);

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
