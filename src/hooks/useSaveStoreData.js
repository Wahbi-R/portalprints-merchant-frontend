import { auth } from "@/lib/firebase";

// Save store data or handle existing store
export async function saveStoreData(storeData) {
  try {
    // Wait for the user to be authenticated
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

    // Get the ID token for the authenticated user
    const token = await user.getIdToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores/saveStore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token in Authorization header
      },
      body: JSON.stringify({
        userId: user.uid, // Use authenticated user's UID
        store_domain: storeData.storeDomain,
        store_name: storeData.storeName, // This can be `null` or a value
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save store data: ${response.statusText}`);
    }

    const responseData = await response.json();

    if (responseData.message === "Store already exists.") {
      return { exists: true, store: responseData.store }; // Return info about the existing store
    }

    return { exists: false, store: responseData }; // Return the new store data
  } catch (error) {
    console.error("Error in saveStoreData:", error.message);
    throw error;
  }
}
