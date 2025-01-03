import { useStore } from "@/context/StoreContext";
import { useAddProduct } from "@/hooks/useAddProduct";
import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Box, Modal, TextField } from "@mui/material";
import { AddProductModal } from "./AddProductModal";

export default function ProductsTable({ products = [], userStoreProducts = [] }) {
  const { addProduct, isLoading: isAddingProduct } = useAddProduct();
  const { storeName, setStoreName } = useStore();

  // TODO: Do this better
  
  const [ isModalOpen, setModalOpen ] = useState(false);
  const [ targetProduct, setTargetProduct ] = useState({});

  // Check if a product is already in the store
  const isProductInStore = (productId) => {
    return products.find(p => p.product_id === productId)?.isInStore === true;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No products found.</p>
      </div>
    );
  }

  return (<>
    <AddProductModal isModalOpen={isModalOpen} setModalOpen={setModalOpen} product={targetProduct} />

    <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">Product Info</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">Description</th>
            <th scope="col" className="px-6 py-3">Variant Info</th>
            <th scope="col" className="px-6 py-3">Add to Store</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const hasSingleVariant = product.variants?.length === 1;
            const hasMultipleVariants = product.variants?.length > 1;

            // Calculate price range if multiple variants
            let priceDisplay = product.price && parseFloat(product.price).toFixed(2);
            // let priceDisplay = "Not Listed";
            // if (hasSingleVariant) {
            //   priceDisplay = product.variants[0].price || "Not Listed";
            // } else if (hasMultipleVariants) {
            //   const prices = product.variants.map((variant) => variant.price).filter(Boolean);
            //   if (prices.length > 0) {
            //     const minPrice = Math.min(...prices);
            //     const maxPrice = Math.max(...prices);
            //     priceDisplay =
            //       minPrice === maxPrice ? `${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
            //   }
            // }

            const productInStore = isProductInStore(product.product_id);

            return (
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
                  <td className="px-6 py-4">${priceDisplay}</td>
                  <td className="px-6 py-4">{product.description || "No Description"}</td>
                  <td className="px-6 py-4">
                    {hasMultipleVariants ? `${product.variants.length} Variants` : "No Variants"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {productInStore ? (

                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    ) : (
                      <button
                        onClick={() => {
                          setTargetProduct(product);
                          setModalOpen(true);
                          // addProduct({ storeDomain: storeName, productId: product.product_id })
                        }}
                        disabled={isAddingProduct}
                        className={`text-blue-500 hover:text-blue-700 flex justify-center items-center ${
                          isAddingProduct ? "cursor-not-allowed opacity-50" : ""
                        }`}
                      >
                        <PlusCircleIcon className="w-6 h-6" />
                      </button>
                    )}
                  </td>
                </tr>

                {/* Variant Rows */}
                {hasMultipleVariants &&
                  product.variants.map((variant) => (
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
                      <td className="px-6 py-4">{"N/A"}</td>
                    </tr>
                  ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  </>);
}
