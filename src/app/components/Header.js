"use client";

import { useUserData } from '@/hooks/useUserData';
import { logOut } from '@/lib/auth';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const { user, isLoading } = useUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return null; // Show nothing during loading to prevent mismatches

  const handleSignOut = async () => {
    await logOut();
    setIsModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200 shadow-md">
      {/* Left Section: Placeholder for Search Bar */}
      <div className="flex items-center rounded-lg px-3 py-1 w-full max-w-md"></div>

      {/* Right Section: Profile Image and Modal */}
      <div className="flex items-center space-x-4 relative">
        <div className="relative">
          <Image
            src={user?.profile_image_url || "/profile.png"}
            alt="Profile"
            onClick={() => setIsModalOpen((prev) => !prev)}
            className="h-8 w-8 rounded-full border border-gray-300 cursor-pointer"
            width={20}
            height={20}
            
          />
          {isModalOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="text-gray-700 text-sm">{user?.username || user?.email}</div>
              <button
                onClick={handleSignOut}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
