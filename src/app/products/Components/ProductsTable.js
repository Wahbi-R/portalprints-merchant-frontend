import React from "react";

export default function ProductsTable({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">Product Info</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">Description</th>
            <th scope="col" className="px-6 py-3">Variant Info</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <React.Fragment key={product.product_id}>
              {/* Product Row */}
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-2 font-medium text-gray-900 flex items-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt="Product"
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                  ) : (
                    <span className="mr-4">No Image</span>
                  )}
                  <span>{product.name || "Unnamed Product"}</span>
                </td>
                <td className="px-6 py-4">{product.cost || "Not Listed"}</td>
                <td className="px-6 py-4">{product.description || "No Description"}</td>
                <td className="px-6 py-4">{product.variants?.length || 0} Variants</td>
              </tr>

              {/* Variant Rows */}
              {product.variants?.map((variant) => (
                <tr
                  key={variant.variant_id}
                  className="bg-gray-50 border-b hover:bg-gray-100"
                >
                  <td className="px-6 py-2 pl-10 font-medium text-gray-700 italic flex items-center">
                    <span>{variant.variant_name}</span>
                  </td>
                  <td className="px-6 py-4">{variant.price || "N/A"}</td>
                  <td className="px-6 py-4">Variant of {product.name}</td>
                  <td className="px-6 py-4">{"N/A"}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
