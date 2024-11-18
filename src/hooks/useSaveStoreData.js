import { auth } from '@/lib/firebase';

// Wants user-id, store name, store_domain
export async function saveStoreData(storeData) {
    const token = await auth.currentUser.getIdToken(); // Get Firebase ID token
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores/saveStore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
        body: JSON.stringify({ userId: auth.currentUser.uid, store_domain: storeData.storeDomain, store_name: storeData.storeName, store_access_key: storeData.storeAccessToken }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save store data:', response);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error in saveStoreData:', error);
      throw error;
    }
  }
  