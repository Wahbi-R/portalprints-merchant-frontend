"use client";

import { useState, useEffect } from "react";

export default function ProductsFilter({ originalProducts = [], setFilteredProducts }) {
  const [category, setCategory] = useState("All");
  const [store, setStore] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique categories and stores, ensuring `originalProducts` is an array
  const categories = ["All", ...new Set(originalProducts?.map((product) => product.category || ""))];
  const stores = ["All", ...new Set(originalProducts?.map((product) => product.store || ""))];

  // Apply filters whenever category, store, or searchQuery changes
  useEffect(() => {
    let filtered = [...originalProducts];

    // Filter by category
    if (category !== "All") {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Filter by store
    if (store !== "All") {
      filtered = filtered.filter((product) => product.store === store);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered); // Update the filtered list
  }, [category, store, searchQuery]); // Dependencies for useEffect

  // Reset filters
  const resetFilters = () => {
    setCategory("All");
    setStore("All");
    setSearchQuery("");
    setFilteredProducts(originalProducts); // Reset to the original list
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-wrap items-center space-x-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Instant filtering
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />

        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)} // Instant filtering
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Store Dropdown */}
        <select
          value={store}
          onChange={(e) => setStore(e.target.value)} // Instant filtering
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          {stores.map((storeName) => (
            <option key={storeName} value={storeName}>
              {storeName}
            </option>
          ))}
        </select>

        {/* Reset Filters Button */}
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
