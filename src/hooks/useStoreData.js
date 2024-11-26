import useSWR from 'swr';
import { auth } from '@/lib/firebase';

export const fetcher = async (url) => {
  const token = await auth.currentUser.getIdToken(); // Get Firebase ID token
  url.searchParams.append("userId", auth.currentUser.uid);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Send token in Authorization header
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
};

export function useStoreData() {
    const { data, error, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`, fetcher, {
      dedupingInterval: 60000,
      revalidateOnFocus: true,
    });
    // console.log(data)
    return {
      storeData: data || [], // Default to an empty array if no data is available
      isLoading: !data && !error,
      isError: !!error,
      refreshStoreData: mutate, // Expose mutate to refresh data
    };
}

import { useState, useEffect } from "react";

export function useStoreDataNew() {
  const [storeData, setStoreData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        setError(null);

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
        const userId = user.uid
        // Make the API call to fetch store data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch store data: ${response.statusText}`);
        }

        const data = await response.json();
        setStoreData(data);
      } catch (err) {
        setError(err.message);
        setStoreData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  });

  return { storeData, isLoading, error };
}
