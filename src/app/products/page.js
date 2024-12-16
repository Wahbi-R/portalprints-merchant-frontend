"use client"
import { useEffect, useState } from "react";
import ProductsTable from "./Components/ProductsTable";
import ProductsFilter from "./Components/ProductsFilter";
import SyncProductsButton from "./Components/SyncProductsButton";
import { fetchVariants } from "@/hooks/useVariantsData";
import { fetchProducts } from "@/hooks/useProductsData";
import { useStore } from "@/context/StoreContext";

export default function ProductsPage() {
  const { storeName } = useStore();

  const [originalProducts, setOriginalProducts] = useState([]); // Original unfiltered products
  const [filteredProducts, setFilteredProducts] = useState([]); // Current filtered products

  useEffect(() => {
    const loadProducts = async () => {
      if (!storeName) return;

      try {
        const fetchedProducts = await fetchProducts(storeName);
        const fetchedVariants = await fetchVariants(fetchedProducts);
        const groupedProducts = groupProductsWithVariants(fetchedProducts, fetchedVariants);

        setOriginalProducts(groupedProducts); // Set unfiltered products
        setFilteredProducts(groupedProducts); // Initialize filtered products
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    loadProducts();
  }, [storeName]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products connected to Portal</h1>
        <SyncProductsButton setProductsList={setOriginalProducts} />
      </div>
      <ProductsFilter
        originalProducts={originalProducts} // Always pass the unfiltered list
        setFilteredProducts={setFilteredProducts}
      />
      <ProductsTable products={filteredProducts} />
    </div>
  );
}

export function groupProductsWithVariants(products, variants) {
  const variantsMap = variants.reduce((acc, variant) => {
    if (!acc[variant.product_id]) {
      acc[variant.product_id] = [];
    }
    acc[variant.product_id].push(variant);
    return acc;
  }, {});

  return products.map((product) => ({
    ...product,
    variants: variantsMap[product.product_id] || [],
  }));
}
