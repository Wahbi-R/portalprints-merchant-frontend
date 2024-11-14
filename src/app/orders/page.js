"use client";

import { useState, useEffect } from "react";
import StatusTabs from "../components/StatusTabs";
import OrderTable from "../components/OrderTable";
import SearchBar from "../components/SearchBar";

// Mock data function (replace with actual data fetching)
const fetchOrders = async (status) => {
  const data = [
    { id: "ORD001", customer: "John Doe", date: "2024-11-08", status: "Printing", total: "$150", paymentStatus: "Pending", items: 3, deliveryMethod: "Free Shipping" },
    { id: "ORD002", customer: "Jane Smith", date: "2024-11-07", total: "$200", paymentStatus: "Completed", items: 2, deliveryMethod: "Express", status: "Delivered" },
    // Add more sample orders
  ];
  return status === "All" ? data : data.filter(order => order.status === status);
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const loadOrders = async () => {
      const fetchedOrders = await fetchOrders(status);
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders); // Initialize filtered orders
    };
    loadOrders();
  }, [status]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleSearch = (searchTerm) => {
    // Filter orders based on the search term
    const filtered = orders.filter(order =>
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  return (
    <div className="p-6 m-6 bg-gray-100 w-full space-y-4 rounded-3xl">
      {/* Status tabs for filtering orders */}
      <StatusTabs onStatusChange={handleStatusChange} />

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Order Table */}
      <OrderTable orders={filteredOrders} />
    </div>
  );
}