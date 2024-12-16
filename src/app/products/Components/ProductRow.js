import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function ProductRow({ product }) {
      return (
        <tr className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-2 font-medium text-gray-900 flex flex-row items-center just">
                {product.image_url ? (
                    <img
                    src={product.image_url}
                    alt="Product"
                    className="w-16 h-16 object-cover rounded"
                    />
                ) : (
                    "No Image"
                )}
                <span className="px-6 py-4 font-medium text-gray-900">{product.name || ""}</span>
            </td>
            <td className="px-6 py-4">{product.cost || "Not Listed"}</td>
            <td className="px-6 py-4">{product.market_price || "Not Listed"}</td>
            <td className="px-6 py-4"><p>{product.description || ""}</p></td>
            <td className="px-6 py-4">
                {product.addedToStore ? (
                    <CheckIcon className="w-6 h-6 text-green-500" />
                ) : (
                    <button
                    className="w-6 h-6 text-blue-500 hover:text-blue-700"
                    onClick={() => {console.log("do nothing atm")}}
                    >
                    <PlusIcon />
                    </button>
                )}
            </td>
        </tr>
      );
    }
  