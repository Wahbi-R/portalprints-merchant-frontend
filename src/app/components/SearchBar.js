import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value); // Pass the search term to the parent component
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search orders..."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <MagnifyingGlassIcon
        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
      />
    </div>
  );
}
