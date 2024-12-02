import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

const preloadUserData = () => {
  if (typeof window !== "undefined") {
    const cachedUser = localStorage.getItem('cachedUserData');
    return cachedUser ? JSON.parse(cachedUser) : null;
  }
  return null;
};

const fetcher = async (url) => {
  if (!auth.currentUser) {
    console.warn("User is not authenticated yet.");
    return null; // Prevent fetching if not authenticated
  }

  const token = await auth.currentUser.getIdToken();
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.error("Failed to fetch user data:", res.status);
    return null;
  }

  const data = await res.json();
  localStorage.setItem('cachedUserData', JSON.stringify(data));
  return data;
};

export function useUserData() {
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [initialData] = useState(preloadUserData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setIsAuthInitialized(!!user);
      });
      return () => unsubscribe();
    }
  }, []);

  const { data, error, mutate } = useSWR(
    isAuthInitialized && auth.currentUser
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`
      : null,
    fetcher,
    {
      initialData,
      revalidateOnMount: isAuthInitialized,
      compare: (currentData, newData) =>
        JSON.stringify(currentData) === JSON.stringify(newData),
    }
  );

  return {
    user: data || initialData,
    isLoading: !error && !data && !isAuthInitialized,
    isError: error,
    refreshUser: mutate,
  };
}
