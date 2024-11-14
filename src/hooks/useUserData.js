import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

// Function to get preloaded user data from local storage
const preloadUserData = () => {
  const cachedUser = localStorage.getItem('cachedUserData');
  return cachedUser ? JSON.parse(cachedUser) : null;
};

const fetcher = async (url) => {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch user data");
  const data = await res.json();

  // Store the fetched data in localStorage
  localStorage.setItem('cachedUserData', JSON.stringify(data));

  return data;
};

export function useUserData() {
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [initialData] = useState(preloadUserData()); // Set cached data immediately for initial render

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setIsAuthInitialized(true); // Set to true once Firebase has checked authentication
    });
    return () => unsubscribe();
  }, []);

  // Start SWR immediately but conditionally fetch based on isAuthInitialized
  const { data, error, mutate } = useSWR(
    isAuthInitialized && `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
    fetcher,
    {
      initialData, // Use preloaded data for initial display
      revalidateOnMount: isAuthInitialized, // Only revalidate after auth is initialized
      compare: (currentData, newData) => JSON.stringify(currentData) === JSON.stringify(newData),
    }
  );

  return {
    user: data || initialData, // Show initial data if still loading
    isLoading: !error && !data && !isAuthInitialized,
    isError: error,
    refreshUser: mutate,
  };
}
