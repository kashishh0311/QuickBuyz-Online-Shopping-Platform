import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Digital");
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided. Please create an order from the cart.");
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.post(
          "/api/v1/user/getOrderById",
          { orderId },
          { withCredentials: true }
        );

        const paymentResponse = await axios.post(
          "/api/v1/user/getPaymentByOrderId",
          { orderId },
          { withCredentials: true }
        );
        console.log("Order Data:", response.data.data); // Add this log
        setOrder(response.data.data);
        setPayment(paymentResponse.data.data);
      } catch (error) {
        console.error(
          "Failed to fetch order:",
          error.response?.data || error.message
        );
        setError("Failed to fetch order details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const loadStripeScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    const addressIndex = user?.address.findIndex(
      (addr) => addr.type === selectedAddress
    );

    if (addressIndex === -1) {
      alert("Invalid address selection.");
      return;
    }

    setIsConfirming(true);
    try {
      const response = await axios.put(
        "/api/v1/user/updateOrder",
        { orderId, addressIndex },
        { withCredentials: true }
      );

      if (paymentMethod === "Digital") {
        const isScriptLoaded = await loadStripeScript();
        if (!isScriptLoaded) throw new Error("Failed to load Stripe script");

        if (!payment) throw new Error("Payment data not loaded");
        const stripeResponse = await axios.post(
          "/api/v1/user/createStripeCheckoutSession",
          { paymentId: payment._id },
          { withCredentials: true }
        );
        const { id: sessionId, key: publishableKey } = stripeResponse.data;

        const stripe = window.Stripe(publishableKey);
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) throw new Error(error.message);
      } else {
        const response = await axios.put(
          "/api/v1/user/updatePaymentMethod",
          { orderId, paymentMethod },
          { withCredentials: true }
        );

        navigate("/delivery", {
          state: { orderId, paymentMethod },
        });
      }
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      alert("Failed to process payment. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleAddNewAddress = () => {
    navigate("/profile", { state: { addNewAddress: true } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600 text-xl animate-pulse">
          Loading your order...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-lg mb-6">{error}</p>
        <button
          onClick={() => navigate("/cart")}
          className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Details Section (Left Side) */}
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              YOUR ORDERS
            </h2>
            <p className="text-sm text-gray-500 italic mb-4">
              Delicious food is just a few clicks away from your doorstep!
            </p>

            {/* Delivery Address */}
            <div className="mb-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">
                DELIVERY ADDRESS
              </h3>
              <div className="relative">
                <select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md text-gray-600 focus:outline-none focus:border-gray-300 transition-all"
                  aria-label="Select delivery address"
                >
                  <option value="" className="text-gray-500">
                    Select Address
                  </option>
                  {user?.address && user.address.length > 0 ? (
                    user.address.map((addr, index) => (
                      <option
                        key={index}
                        value={addr.type}
                        className="text-gray-700"
                      >
                        {addr.type} - {addr.details}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled className="text-gray-500">
                      No addresses available
                    </option>
                  )}
                </select>
                {(!user?.address || user.address.length === 0) && (
                  <button
                    onClick={handleAddNewAddress}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-800 text-sm font-medium"
                  >
                    + Add Address
                  </button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-2">
                PAYMENT METHOD
              </h3>
              <div className="flex flex-col space-y-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Digital"
                    checked={paymentMethod === "Digital"}
                    onChange={() => setPaymentMethod("Digital")}
                    className="mr-3 text-black focus:ring-black"
                  />
                  <div>
                    <p className="font-medium text-gray-700">Online Payment</p>
                    <p className="text-sm text-gray-500">
                      Pay securely with credit/debit card
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={() => setPaymentMethod("Cash on Delivery")}
                    className="mr-3 text-black focus:ring-gray-800"
                  />
                  <div>
                    <p className="font-medium text-gray-700">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-gray-500">
                      Pay with cash when your order arrives
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">
                ORDER ITEMS
              </h3>
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                {order.orderItems.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                  >
                    <img
                      src={item.productId.ProductImage}
                      alt={item.productId.name}
                      className="w-16 h-16 rounded-md object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h4 className="text-md font-medium text-gray-800">
                        {item.productId.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-md text-black font-medium">
                        ₹{Number(item.totalPrice / item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Summary Section (Right Side) */}
          {order && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                PAYMENT SUMMARY
              </h3>
              <div className="space-y-3 text-gray-600">
                {order.orderItems.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex justify-between text-sm"
                  >
                    <span className="truncate flex-1">
                      {item.productId.name} (x{item.quantity})
                    </span>
                    <span className="text-black">
                      ₹{Number(item.totalPrice).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-3 mt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>DELIVERY CHARGES</span>
                  <span className="text-black">
                    +₹{Number(order.charges || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>TOTAL</span>
                  <span className="text-black">
                    ₹{Number(order.totalOrderAmount).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleConfirmOrder}
                className={`mt-6 w-full py-3 rounded-md font-medium transition-all duration-300 ${
                  isConfirming || !selectedAddress
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-black hover:bg-gray-800 text-white"
                }`}
                disabled={isConfirming || !selectedAddress}
              >
                {isConfirming
                  ? "Processing..."
                  : paymentMethod === "Cash on Delivery"
                  ? "Confirm Order"
                  : "Pay Now"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;
