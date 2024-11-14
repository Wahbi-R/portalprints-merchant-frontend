'use client';

import AccountPage from "./page";

export default function AccountLayout({ children }) {
    return (
      <div className="bg-background-gray text-white md:p-6 flex-grow h-full flex items-center justify-center">
        {/* Main content */}
        <div className="md:p-6 h-full w-full">
          <AccountPage/>
        </div>
      </div>
    );
  }
  
  
  
