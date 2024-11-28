"use client";

import { useEffect, useState } from "react";
import StatusTabs from "../components/StatusTabs";
import OrderTable from "../components/OrderTable";
import SearchBar from "../components/SearchBar";
import { fetchOrders } from "@/hooks/useOrdersData";
import { useStore } from "@/context/StoreContext";
import SyncOrdersButton from "../components/SyncOrdersButton";

export default function OrdersPage({ ordersList, setOrdersList }) {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const maxPageButtons = 5;
  const { storeName } = useStore();

  // Fetch orders when storeName is available
  useEffect(() => {
    const loadOrders = async () => {
      if (!storeName) return;

      try {
        const fetchedOrders = await fetchOrders(storeName);
        setOrdersList(fetchedOrders); 
        setFilteredOrders(fetchedOrders); 
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    loadOrders();
  }, [storeName, setOrdersList]);

  // Filter orders when `status` changes
  useEffect(() => {
    const filtered =
    status === "All"
      ? ordersList
      : ordersList.filter((order) => {
          if (status.toLowerCase() === "cancelled") {
            return order.cancelled_at !== null;
          }
          return (
            order.order_status?.toLowerCase() === status.toLowerCase() &&
            order.cancelled_at === null
          );
        });
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [ordersList, status]);

  // Paginate filtered orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentPageOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Pagination controls
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    const filtered = ordersList.filter((order) => {
      const customerName = order.customer_name?.toLowerCase() || ""; 
      const externalOrderName = order.external_order_name?.toLowerCase() || ""; 

      return (
        customerName.includes(searchTerm.toLowerCase()) ||
        externalOrderName.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredOrders(filtered);
    setCurrentPage(1); 
  };

  // Generate dynamic pagination buttons
  const getPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(
      totalPages,
      startPage + maxPageButtons - 1
    );

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="p-6 m-6 bg-gray-100 w-full space-y-4 rounded-3xl">
      {/* Sync Orders Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">Orders</h1>
        <SyncOrdersButton storeName={storeName} setOrdersList={setOrdersList} />
      </div>
      <StatusTabs onStatusChange={handleStatusChange} />
      <SearchBar onSearch={handleSearch} />
      <OrderTable orders={currentPageOrders} />
      {/* Pagination */}
      <div className="flex items-center space-x-2 mt-4 overflow-x-auto">
        <button
          className="px-4 py-2 rounded bg-gray-200 text-gray-800"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          hidden={currentPage <= 3}
        >
          First
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-200 text-gray-800"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          hidden={currentPage === 1}
        >
          Previous
        </button>
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            className={`px-4 py-2 rounded ${
              currentPage === pageNumber
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button
          className="px-4 py-2 rounded bg-gray-200 text-gray-800"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          hidden={currentPage >= totalPages-1}
        >
          Next
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-200 text-gray-800"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          hidden={currentPage >= totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
}
