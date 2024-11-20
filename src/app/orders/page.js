"use client";

import { useState, useEffect } from "react";
import StatusTabs from "../components/StatusTabs";
import OrderTable from "../components/OrderTable";
import SearchBar from "../components/SearchBar";
import { fetchOrders } from "@/hooks/useOrdersData";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders(); // Use the provided fetchOrders function
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders); // Initialize filtered orders
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    // Filter orders when status changes
    const filtered = status === "All" ? orders : orders.filter((order) => order.status === status);
    setFilteredOrders(filtered);
  }, [status, orders]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleSearch = (searchTerm) => {
    // Filter orders based on the search term
    const filtered = orders.filter(
      (order) =>
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
