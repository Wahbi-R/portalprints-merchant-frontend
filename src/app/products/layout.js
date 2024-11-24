// import { useState } from "react";
import ProductsPage from "./page";
import { Metadata } from 'next';

export const metadata = {
    title: 'Products'
  }

export default function PageLayout() {
    return (
        <div className="flex flex-col w-full h-full bg-background-gray p-6">
            <ProductsPage />
        </div>
    )
}