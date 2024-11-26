"use client";
import { useEffect, useState } from "react";
import ProductsTable from "./Components/ProductsTable";
import ProductsFilter from "./Components/ProductsFilter";
import SyncProductsButton from "./Components/SyncProductsButton";
import { fetchVariants } from "@/hooks/useVariantsData";
import { fetchProducts } from "@/hooks/useProductsData";
import { useStore } from "@/context/StoreContext";

export default function ProductsPage() {
  const originalItems = [
    {
      name: "Red Bluster",
      cost: 15,
      MSRP: 45,
      description: "Red Bluster flexible toy from the popular kids movie The Sea Beast...",
      addedToStore: false,
      image_url:
        "https://static.wikia.nocookie.net/netflix/images/3/32/The_Sea_Beast_The_Red_Bluster_IB.png/",
      category: "Portal",
      store: "Store A",
    },
    {
      name: "Egg",
      cost: 99.99,
      MSRP: 42.12,
      description: "Gods Egg",
      addedToStore: false,
      image_url:
        "https://ichef.bbci.co.uk/news/1024/branded_news/7614/production/_105482203__105172250_gettyimages-857294664.jpg",
      category: "Portal",
      store: "Store B",
    },
    {
      name: "Sala",
      cost: 0.69,
      MSRP: 0.069,
      description: "Half man half gay",
      addedToStore: true,
      image_url:
        "https://media.licdn.com/dms/image/v2/D5603AQESfuCK56Ps_g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1676930377216?e=2147483647&v=beta&t=nxGuAlQ-1wMFncZS1nZOw1R40tH5sBsVzemW36G5G4I",
      category: "Created By You",
      store: "Store B",
    },
  ];

  const { storeName } = useStore();

  const [productsList, setProductsList] = useState([]);
  useEffect(() => {
    const loadProducts = async () => {
      if (!storeName) return;

      try {
        const fetchedProducts = await fetchProducts(storeName);
        const fetchedVariants = await fetchVariants(fetchedProducts);
        const groupedProducts = groupProductsWithVariants(fetchedProducts, fetchedVariants);


        // Pass the grouped products to your table or filter
        setProductsList(groupedProducts);

      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    loadProducts();
  }, [storeName, setProductsList]);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        {/* Add SyncProductsButton */}
        <SyncProductsButton setProductsList={setProductsList} />
      </div>
      {/* Filter Section */}
      <ProductsFilter originalProducts={productsList} setFilteredProducts={setProductsList} />
      {/* Product Section */}
      <ProductsTable products={productsList} />
    </div>
  );
}

export function groupProductsWithVariants(products, variants) {
  // Create a map to group variants by product_id
  const variantsMap = variants.reduce((acc, variant) => {
    if (!acc[variant.product_id]) {
      acc[variant.product_id] = [];
    }
    acc[variant.product_id].push(variant);
    return acc;
  }, {});

  // Attach variants to each product
  return products.map((product) => ({
    ...product,
    variants: variantsMap[product.product_id] || [], // Add variants array
  }));
}

