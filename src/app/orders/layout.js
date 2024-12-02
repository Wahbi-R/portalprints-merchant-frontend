"use client";

import { useState } from "react";
import PromoBanner from "../components/IntegrationsBanner";
import SummaryCard from "../components/SummaryCards";
import { ClipboardDocumentListIcon, PrinterIcon, CheckBadgeIcon, TruckIcon } from "@heroicons/react/24/outline";
import OrdersPage from "./page";

export default function OrdersLayout() {
  const [ordersList, setOrdersList] = useState([]);

  // Compute summary data dynamically
  const summaryData = [
    {
      title: "Total Orders",
      value: ordersList.length, // Total number of orders
      icon: ClipboardDocumentListIcon,
    },
    {
      title: "Orders Being Printed",
      value: ordersList.filter((order) => order.order_status === "UNFULFILLED").length,
      icon: PrinterIcon,
    },
    {
      title: "Orders Currently Shipping",
      value: ordersList.filter((order) => order.order_status === "PARTIALLY_FULFILLED").length,
      icon: TruckIcon,
    },
    {
      title: "Orders Completed",
      value: ordersList.filter((order) => order.order_status === "COMPLETED" || order.order_status === "FULFILLED").length,
      icon: CheckBadgeIcon,
    },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-background-gray">
      <div className="p-6">
        <PromoBanner />
      </div>

      {/* Summary section */}
      <div className="p-6 bg-background-gray">
        <div className="p-6 bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg">
          {summaryData.map((data, index) => (
            <SummaryCard
              key={index}
              title={data.title}
              value={data.value}
              icon={data.icon}
            />
          ))}
        </div>
      </div>

      {/* Orders page */}
      <div className="flex justify-center h-full">
        <OrdersPage ordersList={ordersList} setOrdersList={setOrdersList} />
      </div>
    </div>
  );
}
