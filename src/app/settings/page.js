"use client";

import LogoCard from '../components/LogoCard';
import StatusCard from '../components/ProfileStatusCard';
import StoreConnectionCard from '../components/StoreConnectionCard';
import WinnersSection from '../components/WinningItemsSection';
import IntegrationSuggestions from '../components/IntegrationsProfile';
import { useUserData } from '@/hooks/useUserData';
import { useStore } from '@/context/StoreContext';
import { fetchOrders } from '@/hooks/useOrdersData';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { user, isLoading, refreshUserData } = useUserData(); // Include refreshUserData to update user info
  const { storeName } = useStore(); // Fetch store data
  const [isClient, setIsClient] = useState(false);
  const [orders, setOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    shipped: 0,
    readyForShipping: 0,
    printing: 0,
  });

  useEffect(() => {
    setIsClient(true); // Ensure this component renders client-side
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      if (!storeName) return;

      try {
        const fetchedOrders = await fetchOrders(storeName);
        setOrders(fetchedOrders);

        // Calculate status counts
        const shipped = fetchedOrders.filter(
          (order) => order.order_status.toLowerCase() === 'fulfilled'
        ).length;
        const readyForShipping = fetchedOrders.filter(
          (order) => order.order_status.toLowerCase() === 'partially_fulfilled'
        ).length;
        const printing = fetchedOrders.filter(
          (order) => order.order_status.toLowerCase() === 'unfulfilled'
        ).length;

        setStatusCounts({ shipped, readyForShipping, printing });
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      }
    };

    loadOrders();
  }, [storeName]);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Allowed MIME types
  
  const handleImageUpload = async (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds the 10MB limit. Please upload a smaller image.');
      return;
    }
  
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Invalid file type. Please upload an image file (JPEG, PNG, GIF, or WebP).');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.user_id); // Pass the user ID
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/upload-profile-picture`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
  
      const { url } = await response.json();
  
      console.log('Uploaded successfully:', url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-900 w-full h-full">
      {/* Left Panel */}
      <div className="flex flex-col bg-gray-800 rounded-2xl space-y-2 p-2">
        <LogoCard logoURL={user?.profile_image_url} onImageUpload={handleImageUpload} />
        <div className="flex space-x-4 justify-center">
          <StatusCard label="Shipped" value={statusCounts.shipped} />
          <StatusCard label="Ready for Shipping" value={statusCounts.readyForShipping} />
          <StatusCard label="Printing" value={statusCounts.printing} />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col space-y-6">
  <div className="flex flex-col items-center space-y-4 p-4 bg-gray-800 rounded-2xl">
    <h2
      className="text-white font-bold text-center"
      style={{
        fontSize: 'clamp(1.5rem, 5vw, 3rem)', // Adjusts size between 1.5rem and 3rem
        overflowWrap: 'break-word', // Breaks long words
        wordBreak: 'break-word', // Breaks long continuous text
        maxWidth: '100%', // Ensures it doesn't exceed the div
      }}
    >
      {isClient && !isLoading ? (user?.username || user?.email) : 'Name'}
    </h2>

    {/* Store Connection Section */}
    <div className="flex items-center space-x-2">
      {storeName === null || storeName === '' ? (
        <p className="text-gray-400">No connected stores. Add one to get started!</p>
      ) : (
        <StoreConnectionCard key={1} label={storeName} />
      )}
    </div>
  </div>
</div>

    </div>
  );
}
