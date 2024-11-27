import { useState, useEffect } from "react";

export default function ProductsFilter({ originalProducts = [], setFilteredProducts }) {
  const [category, setCategory] = useState("All");
  const [store, setStore] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", ...new Set(originalProducts.map((product) => product.category || ""))];
  const stores = ["All", ...new Set(originalProducts.map((product) => product.store || ""))];

  useEffect(() => {
    let filtered = [...originalProducts];

    if (category !== "All") {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (store !== "All") {
      filtered = filtered.filter((product) => product.store === store);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [category, store, searchQuery, originalProducts, setFilteredProducts]); // Depend on `originalProducts` to reset on update

  const resetFilters = () => {
    setCategory("All");
    setStore("All");
    setSearchQuery("");
    setFilteredProducts(originalProducts); // Reset to original list
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
      <div className="flex flex-wrap items-center space-x-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={store}
          onChange={(e) => setStore(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          {stores.map((storeName) => (
            <option key={storeName} value={storeName}>
              {storeName}
            </option>
          ))}
        </select>
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
