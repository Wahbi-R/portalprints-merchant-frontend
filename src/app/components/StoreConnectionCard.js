import { ShoppingBagIcon } from "@heroicons/react/24/outline";


export default function StoreConnectionCard({ label }) {
  return (
    <div className="flex flex-col items-center text-white">
      <div className="p-2 bg-green-600 rounded-full">
        <ShoppingBagIcon className="h-8 w-8" />
      </div>
      <span className="text-xs mt-2">{label}</span>
    </div>
  );
}