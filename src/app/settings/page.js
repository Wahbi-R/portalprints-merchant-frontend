"use client";

import LogoCard from '../components/LogoCard';
import StatusCard from '../components/ProfileStatusCard';
import StoreConnectionCard from '../components/StoreConnectionCard';
import WinnersSection from '../components/WinningItemsSection';
import IntegrationSuggestions from '../components/IntegrationsProfile';
import { useUserData } from '@/hooks/useUserData';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { user, isLoading } = useUserData();
  const [isClient, setIsClient] = useState(false);

  // Set `isClient` to true after component mounts on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-900 w-full h-full">
      {/* Left Panel */}
      <div className="flex flex-col bg-gray-800 rounded-2xl space-y-2 p-2">
        <LogoCard logoURL={user?.profile_image_url} />
        <div className="flex space-x-4 justify-center">
          <StatusCard label="Shipped" value="20" />
          <StatusCard label="Ready for Shipping" value="8" />
          <StatusCard label="Printing" value="15" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col items-center space-y-4 p-4 bg-gray-800 rounded-2xl">
          <h2 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {isClient && !isLoading ? (user?.username || user?.email) : "Name"} {/* Display "Name" until client data is available */}
          </h2>
          <div className="flex space-x-2 justify-center">
            <StoreConnectionCard label="Connected Store 1" />
            <StoreConnectionCard label="Connected Store 2" />
          </div>
          <h3 className="text-white text-xl font-bold mt-4">7 Day Winners</h3>
          <WinnersSection />
        </div>
        <IntegrationSuggestions />
      </div>
    </div>
  );
}
