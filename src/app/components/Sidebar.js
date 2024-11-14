"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Import specific icons from Heroicons
import { HomeIcon, UserGroupIcon, ClipboardDocumentListIcon, Cog8ToothIcon, ChevronLeftIcon, Bars3Icon, InboxStackIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Start closed
  const [animationCompleted, setAnimationCompleted] = useState(true);

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Orders', path: '/orders', icon: ClipboardDocumentListIcon },
    { name: 'Products', path: '/product', icon: InboxStackIcon },
    // Add more items as needed
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsVisible(false);
        setAnimationCompleted(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAnimationEnd = () => {
    setTimeout(() => {
      setAnimationCompleted(true);
    }, 500); // Ensure the button shows only after the animation completes
  };

  const handleOpenSidebar = () => {
    setIsVisible(true);
    setAnimationCompleted(false);
  };

  const handleCloseSidebar = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isMobile && !isVisible && animationCompleted && (
        <button
          onClick={handleOpenSidebar}
          className="fixed top-4 left-4 p-2 bg-white text-dark-green rounded-full hover:bg-gray z-30"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
      )}

      <div
        className={`bg-dark-green text-white ${isMobile ? 'fixed top-0 left-0 w-full h-full' : 'w-64 h-screen'} flex flex-col p-6 transition-transform duration-500 ease-in-out z-20 ${isMobile ? (isVisible ? 'translate-x-0' : '-translate-x-full') : ''}`}
        onTransitionEnd={handleAnimationEnd}
      >
        {isMobile && isVisible && (
          <button
            onClick={handleCloseSidebar}
            className="absolute top-4 right-4 p-2 bg-light-green text-dark-green rounded-full hover:bg-green-700"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        )}
        <div className="mb-6 flex items-center">
          {/* Add your custom logo image */}
          <Image src="/logo512.png" alt="Portal Logo" className="h-8 w-8 mr-3" width={32} height={32} />
          {!isMobile || isVisible ? (
            <Link href="/" className="text-2xl font-bold">
              PortalPrints
            </Link>
          ) : null}
        </div>

        <nav className="flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => isMobile && handleCloseSidebar()}
              className={`flex items-center py-2 px-4 rounded-lg mb-2 ${pathname === item.path ? 'bg-light-green' : 'hover:bg-light-green'
                }`}
            >
              {/* Render the icon with size and styling */}
              <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <Link href="/settings" onClick={() => isMobile && handleCloseSidebar()} className="flex items-center py-2 px-4 rounded-lg hover:bg-light-green">
            {/* Optional settings icon */}
            <Cog8ToothIcon className="h-5 w-5 mr-3" aria-hidden="true" />
            Settings
          </Link>
        </div>
      </div>
    </>
  );
}
