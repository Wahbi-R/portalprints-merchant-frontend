import { auth } from "@/lib/firebase";
import { useStoreData, useStoreDataNew } from "./useStoreData";

export async function fetchOrders() {
  try {
    // Ensure the user is authenticated
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

    // Get the Firebase ID token
    const token = await user.getIdToken();

    // Get the store URL
    const storeDomain = "wabbleton.myshopify.com"
    // Construct the URL with query parameters
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`);
    url.searchParams.append("uid", user.uid);
    url.searchParams.append("storeDomain", storeDomain);
    console.log(url)
    // Make the GET request
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token in Authorization header
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error in fetchOrders:", error.message);
    throw error;
  }
}
