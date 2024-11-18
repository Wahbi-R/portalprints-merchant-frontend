import useSWR from 'swr';
import { auth } from '@/lib/firebase';

export const fetcher = async (url) => {
  const token = await auth.currentUser.getIdToken(); // Get Firebase ID token
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
    console.log(data)
    return {
      storeData: data || [], // Default to an empty array if no data is available
      isLoading: !data && !error,
      isError: !!error,
      refreshStoreData: mutate, // Expose mutate to refresh data
    };
}
