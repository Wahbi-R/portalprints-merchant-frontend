import OrderRow from './OrderRow';

export default function OrderTable({ orders }) {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">Order</th>
            <th scope="col" className="px-6 py-3">Customer</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Total</th>
            <th scope="col" className="px-6 py-3">Payment Status</th>
            <th scope="col" className="px-6 py-3">Items</th>
            <th scope="col" className="px-6 py-3">Delivery Method</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
