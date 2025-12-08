import ProductsPage from "@/components/Products/ProductsPageContent";
import React from "react";
export const metadata = {
  title: "Products — Somoco EV",
  description: "Browse our electric vehicle lineup and compare models.",
};
const Products = () => {
  return (
    <div>
      <ProductsPage />
    </div>
  );
};

export default Products;
