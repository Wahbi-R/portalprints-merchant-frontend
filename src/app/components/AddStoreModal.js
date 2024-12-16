import { useState } from 'react';
import { saveStoreData } from '@/hooks/useSaveStoreData'; // Function to save store data
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AddStoreModal({ isOpen, onClose, onSuccess }) {
  const [storeName, setStoreName] = useState('');
  const [storeDomain, setStoreDomain] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!storeName || !storeDomain || !storeDomain.includes('.com')) {
      alert('Please fill in both fields with valid Shopify data.');
      return;
    }

    setIsSaving(true);

    try {
      // Trigger Shopify OAuth Flow
      const clientId = 'aa676896538ae18b49d59e840d86e96b';
      const redirectUri = NEXT_PUBLIC_API_URL + '/shopify/callback'; // Ensure this matches your backend's callback
      const scopes = 'read_products,write_products,read_orders,write_orders';

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid; // Firebase user ID
          const state = JSON.stringify({ csrf: Math.random().toString(36).substring(2), uid: userId });

          const oauthUrl = `https://${storeDomain}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(
            redirectUri
          )}&state=${encodeURIComponent(state)}`;

          // Redirect to Shopify OAuth
          window.location.href = oauthUrl;
        } else {
          alert('Please log in to continue.');
        }
      });
    } catch (error) {
      console.error('Error during Shopify OAuth:', error);
      alert('Failed to connect to Shopify. Please try again.');
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Add Store</h2>

        {/* Store Name Input */}
        <div className="mb-4">
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
            Store Name
          </label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="mt-1 p-1 text-black block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Enter store name"
          />
        </div>

        {/* Store Domain Input */}
        <div className="mb-4">
          <label htmlFor="storeDomain" className="block text-sm font-medium text-gray-700">
            Store Domain
          </label>
          <input
            id="storeDomain"
            type="text"
            value={storeDomain}
            onChange={(e) => setStoreDomain(e.target.value)}
            className="mt-1 p-1 text-black block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="mystore.myshopify.com"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg text-white ${
              isSaving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSaving ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  );
}
