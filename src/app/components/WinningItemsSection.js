import Image from "next/image";
import { useMemo } from "react";

export default function WinnersSection({ orders = [] }) {
  const topItems = useMemo(() => {
    const itemCounts = {};

    // Aggregate item counts from orders
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = {
            name: item.name,
            price: item.price,
            image: item.image_url,
            count: 0,
          };
        }
        itemCounts[item.name].count += item.quantity || 1; // Add item quantity
      });
    });

    // Sort items by count and take the top 5
    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {topItems.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-white bg-gray-700 p-2 rounded-lg"
        >
          <Image src={item.image} alt={item.name} width={60} height={60} />
          <span className="mt-2 text-sm">{item.name}</span>
          <span className="text-xs">Sold: {item.count}</span>
          <span className="text-xs">Price: {item.price}</span>
        </div>
      ))}
    </div>
  );
}
