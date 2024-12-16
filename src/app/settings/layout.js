"use client";

export default function SettingsLayout({ children }) {
  return (
    <div className="flex flex-col bg-background-gray md:h-full">
        {/* Main content area for Settings */}
        <div className="h-full md:flex justify-center items">
            {children}
        </div>
    </div>
  );
}
