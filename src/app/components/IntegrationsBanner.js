import { useState } from "react";
import Image from "next/image";
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function PromoBanner() {
  return (
    <div className="flex items-center justify-between p-10 rounded-lg shadow-md text-white"
    style={{
      backgroundImage: "url('/textured_banner.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundBlendMode: "overlay",
      backgroundColor: "#22331D", // Dark green overlay color
    }}>
      {/* Left side: Text */}
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-4xl font-semibold">Dashboard</h2>
          <p className="text-2xl mt-1">Start fulfilling your shopify orders</p>
        </div>
        {/* <button className="px-5 py-3 bg-orange-500 text-xl text-white rounded-full font-semibold hover:bg-orange-600 flex items-center">
          Find App
          <ArrowTopRightOnSquareIcon className="ml-2 h-6 w-6" aria-hidden="true"/>
        </button> */}
      </div>

      {/* Right side: Button and Icons */}
      <div className="flex items-center space-x-4 p-6">
        
        {/* Icons */}
        <div className="flex space-x-2">
          <div className="bg-green-200 rounded-full h-40 w-40 flex items-center justify-center">
          <Image
            src="/shopify_logo.svg"
            width={0}
            height={0}
            sizes="100vw"
            alt="Shopify Icon"
            style={{ width: '70%', height: 'auto' }} // optional
          />
          </div>
          {/* <div className="bg-gray-800 rounded-full h-40 w-40 flex items-center justify-center">
          <Image
            src="/etsy_logo.svg"
            width={0}
            height={0}
            sizes="100vw"
            alt="Etsy Icon"
            style={{ width: '100%', height: 'auto' }} // optional
          />
          </div> */}
        </div>
      </div>
    </div>
  );
}
