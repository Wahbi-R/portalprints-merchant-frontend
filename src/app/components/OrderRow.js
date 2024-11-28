export default function OrderRow({ order }) {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
  };
    return (
      <tr className="bg-white border-b hover:bg-gray-50">
        <td className="px-6 py-4 font-medium text-gray-900">{order.external_order_name || ""}</td>
        <td className="px-6 py-4">{order.customer_name || "Not Listed"}</td>
        <td className="px-6 py-4">{formatDate(order.order_date) || ""}</td>
        <td className="px-6 py-4">{order.cancelled_at !== null ? order.order_status + " AND CANCELLED" : order.order_status || ""}</td>
        <td className="px-6 py-4">{order.total_cost || 0.00}</td>
        <td className={`px-6 py-4 font-semibold ${
          order.portal_order_status === "Completed" ? "text-green-500" :
          order.portal_order_status === "Pending" ? "text-yellow-500" : "text-red-500"
        }`}>
          {order.portal_order_status || order.cancelled_at ? "Cancelled" : "Printing"}
        </td>
        {/* <td className="px-6 py-4">{order.items.count || ""}</td> */}
        {/* <td className="px-6 py-4">N/A</td> */}
      </tr>
    );
  }

  