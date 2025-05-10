import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart on initial load
  useEffect(() => {
    fetchCart();
  }, []);

  // Get cart data from server
  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/v1/user/getCart", {
        withCredentials: true,
      });

      console.log("GET CART RESPONSE:", response.data);

      // Handle the correct structure based on API response
      if (response.data.data && response.data.data.items) {
        setCart(response.data.data.items);
      } else {
        setCart(response.data.data || []);
      }
    } catch (error) {
      console.error(
        "Failed to fetch cart:",
        error.response?.data?.message || "An error occurred."
      );
    }
  };

  // Add item to cart
  const addToCart = async (productId) => {
    setLoading(true);
    try {
      console.log("Adding to cart, productId:", productId);
      const response = await axios.post(
        "/api/v1/user/addToCart",
        { _id: productId },
        { withCredentials: true }
      );
      console.log("Add to cart response:", response.data);
      await fetchCart(); // Refresh cart after adding item
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data?.message || "Server error."
      );
    } finally {
      setLoading(false);
    }
  };

  // Update quantity of item in cart
  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      console.log("Updating quantity:", { productId, quantity });

      const response = await axios.put(
        "/api/v1/user/updateQuantity",
        { _id: productId, quantity },
        { withCredentials: true }
      );

      console.log("Update quantity response:", response.data);

      // Make sure we're setting the cart state correctly
      if (response.data.data && response.data.data.items) {
        setCart(response.data.data.items);
      } else {
        setCart(response.data.data || []);
      }
    } catch (error) {
      console.error(
        "Error updating quantity:",
        error.response?.data?.message || "Server error.",
        error.response?.data || error
      );

      // If there was an error, refresh the cart to ensure it's in sync
      fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Increment quantity
  const increment = (productId) => {
    console.log("Increment called for productId:", productId);

    // Find the correct item
    const item = findItemInCart(productId);

    if (item) {
      console.log("Found item to increment:", item);
      // Use productId from the item object, which should match what the server expects
      const idToUse = item.productId._id;
      updateQuantity(idToUse, item.quantity + 1);
    } else {
      console.error("Item not found in cart for increment:", productId);
    }
  };

  // Decrement quantity
  const decrement = (productId) => {
    console.log("Decrement called for productId:", productId);

    // Find the correct item
    const item = findItemInCart(productId);

    if (item && item.quantity > 1) {
      console.log("Found item to decrement:", item);
      // Use productId from the item object, which should match what the server expects
      const idToUse = item.productId._id;
      updateQuantity(idToUse, item.quantity - 1);
    } else if (item) {
      // Remove item from cart if quantity reaches 0
      console.log("Removing item from cart:", item);
      const idToUse = item.productId._id;
      updateQuantity(idToUse, 0);
    } else {
      console.error("Item not found in cart for decrement:", productId);
    }
  };

  // Helper function to find an item in the cart by ID
  const findItemInCart = (productId) => {
    console.log("Looking for item in cart with productId:", productId);
    console.log("Current cart:", cart);

    // Try to find the item based on possible structures
    let item = cart.find((item) => {
      // Main case: Match productId._id with the passed productId
      return item.productId && item.productId._id === productId;
    });

    // If not found, try other ways
    if (!item) {
      item = cart.find((item) => item._id === productId);
    }

    if (!item) {
      item = cart.find((item) => item.productId === productId);
    }

    console.log("Found item:", item);
    return item;
  };

  // Create order from cart
  const createOrder = async () => {
    try {
      const response = await axios.post(
        "/api/v1/user/createOrder",
        { items: cart },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response?.data?.message || "Server error."
      );
      return null;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await axios.delete("/api/v1/user/clearCart", {
        withCredentials: true,
      });
      setCart([]);
    } catch (error) {
      console.error(
        "Error clearing cart:",
        error.response?.data?.message || "Server error."
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        increment,
        decrement,
        fetchCart,
        createOrder,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
