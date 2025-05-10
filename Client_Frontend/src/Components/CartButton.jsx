import React from "react";
import { useCart } from "../CartContext";

function CartButton({ product }) {
  const { increment, decrement } = useCart();

  // Extract the ID based on product structure
  // This could be different based on where the component is used
  let productId = null;

  if (product.productId && product.productId._id) {
    // If the product object contains a nested productId object (common in cart items)
    productId = product.productId._id;
  } else if (product._id) {
    // If the product object has a direct _id property
    productId = product._id;
  }

  if (!productId) {
    console.error("Invalid product object in CartButton - missing ID", product);
    return null;
  }

  return (
    <div className="mt-2">
      <button
        className="rounded-l-lg bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 mt-4 h-4/5"
        onClick={() => {
          decrement(productId);
        }}
      >
        -
      </button>
      <button className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 mt-4 h-4/5">
        {product.quantity}
      </button>
      <button
        className="rounded-r-lg bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 mt-4 h-4/5"
        onClick={() => {
          increment(productId);
        }}
      >
        +
      </button>
    </div>
  );
}

export default CartButton;
