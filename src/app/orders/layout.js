"use client";

import PromoBanner from '../components/IntegrationsBanner';
import SummaryCard from '../components/SummaryCards';
// import StatusTabs from '../components/StatusTabs';
// import SummaryCards from '../components/SummaryCards';
import { ClipboardDocumentListIcon, PrinterIcon, CheckBadgeIcon, TruckIcon } from '@heroicons/react/24/outline';

export default function OrdersLayout({ children }) {
    // Temp Summary Cards
    const summaryData = [
        {
          title: "Total Orders",
          value: "48",
          icon: ClipboardDocumentListIcon,
        },
        {
            title: "Orders Being Printed",
            value: "11",
            icon: PrinterIcon,
        },
        {
            title: "Orders Currently Shipping",
            value: "11",
            icon: TruckIcon,
        },
        {
            title: "Orders Completed",
            value: "11",
            icon: CheckBadgeIcon,
        },
      ];

  return (
    <div className="flex flex-col w-full h-full bg-background-gray">

        <div className="p-6">
            <PromoBanner />
        </div>
        {/* Summary section and tabs */}
    <div className="p-6 bg-background-gray">
            {/* Summary Section */}
      <div className="p-6 bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg">
        {summaryData.map((data, index) => (
          <SummaryCard
            key={index}
            title={data.title}
            value={data.value}
            icon={data.icon}
            description={data.description}
            trend={data.trend}
          />
        ))}
      </div>
            {/*<StatusTabs />    {/* Tabs for All, Unpaid, Need to Ship, etc. */}
        </div>

        {/* Main content area for Orders */}
        <div className="flex justify-center h-full">
            {children}
        </div>
    </div>
  );
}
