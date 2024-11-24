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
import AddStoreButton from '../components/AddStoreButton';

export default function SettingsPage() {
  const { user, isLoading } = useUserData();
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
          (order) => order.order_status.toLowerCase() === "fulfilled"
        ).length;
        const readyForShipping = fetchedOrders.filter(
          (order) => order.order_status.toLowerCase() === "partially_fulfilled"
        ).length;
        const printing = fetchedOrders.filter(
          (order) => order.order_status.toLowerCase() === "unfulfilled"
        ).length;

        setStatusCounts({ shipped, readyForShipping, printing });
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    loadOrders();
  }, [storeName]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-900 w-full h-full">
      {/* Left Panel */}
      <div className="flex flex-col bg-gray-800 rounded-2xl space-y-2 p-2">
        <LogoCard logoURL={user?.profile_image_url} />
        <div className="flex space-x-4 justify-center">
          <StatusCard label="Shipped" value={statusCounts.shipped} />
          <StatusCard label="Ready for Shipping" value={statusCounts.readyForShipping} />
          <StatusCard label="Printing" value={statusCounts.printing} />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col items-center space-y-4 p-4 bg-gray-800 rounded-2xl">
          <h2 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {isClient && !isLoading ? (user?.username || user?.email) : "Name"} {/* Display "Name" until client data is available */}
          </h2>

          {/* Store Connection Section */}
          <div className="flex items-center space-x-2">
            {storeName === null || storeName === "" ? (
              <p className="text-gray-400">No connected stores. Add one to get started!</p> // Empty state message
            ) : (
              <StoreConnectionCard key={1} label={storeName} />
            )}

            {/* Add Store Button */}
            {/* <AddStoreButton onStoreAdded={refreshStoreData} /> Refresh store data after adding */}
          </div>

          {/* <h3 className="text-white text-xl font-bold mt-4">Current Winners</h3>
          <WinnersSection orders={orders} /> Pass orders to WinnersSection */}
        </div>
        {/* Don't show on Shopify during review */}
        {/* <IntegrationSuggestions /> */}
      </div>
    </div>
  );
}
