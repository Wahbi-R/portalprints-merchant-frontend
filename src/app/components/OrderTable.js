import OrderRow from './OrderRow';

export default function OrderTable({ orders }) {
  if (orders?.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">Order</th>
            <th scope="col" className="px-6 py-3">Customer Name</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Total</th>
            <th scope="col" className="px-6 py-3">Portal Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow key={order.external_order_name} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

