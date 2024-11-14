import { useState } from "react";

export default function StatusTabs({ onStatusChange }) {
  // List of statuses
  const statuses = ["All", "Printing", "Shipping", "Unpaid", "Completed", "Cancelled"];
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Handle tab click to change status
  const handleTabClick = (status) => {
    setSelectedStatus(status);
    onStatusChange(status); // Call the parent function to filter orders
  };

  return (
    <div className="flex border-b border-gray-300">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => handleTabClick(status)}
          className={`px-4 py-2 font-semibold text-sm ${
            selectedStatus === status
              ? "border-b-4 border-orange-500 text-orange-600"
              : "text-gray-600 hover:text-gray-800 hover:border-b-4 hover:border-gray-300"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
