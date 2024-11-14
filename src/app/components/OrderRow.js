export default function OrderRow({ order }) {
    return (
      <tr className="bg-white border-b hover:bg-gray-50">
        <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
        <td className="px-6 py-4">{order.customer}</td>
        <td className="px-6 py-4">{order.date}</td>
        <td className="px-6 py-4">{order.status}</td>
        <td className="px-6 py-4">{order.total}</td>
        <td className={`px-6 py-4 font-semibold ${
          order.paymentStatus === "Completed" ? "text-green-500" :
          order.paymentStatus === "Pending" ? "text-yellow-500" : "text-red-500"
        }`}>
          {order.paymentStatus}
        </td>
        <td className="px-6 py-4">{order.items} item(s)</td>
        <td className="px-6 py-4">{order.deliveryMethod}</td>
      </tr>
    );
  }
  