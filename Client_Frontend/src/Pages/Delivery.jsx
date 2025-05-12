import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const steps = ["Order Placed", "Preparing", "Out for Delivery", "Delivered"];

function Delivery() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId") || location.state?.orderId;
  const paymentId = queryParams.get("paymentId") || location.state?.paymentId;
  const [isVerified, setIsVerified] = useState(false);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(null);
  const [modal, setModal] = useState({
    show: false,
    message: "",
    action: null,
    isSuccess: false,
    refundMessage: null,
  });
  const intervalIdRef = useRef(null);
  const paymentMethod =
    queryParams.get("paymentMethod") || location.state?.paymentMethod;

  const progressSteps = [
    "Order Placed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  const refreshOrderStatus = async () => {
    if (!orderId) return;

    try {
      const orderResponse = await axios.post(
        "/api/v1/user/getOrderById",
        { orderId },
        { withCredentials: true }
      );

      const newOrderData = orderResponse.data.data;

      if (!order || order.orderStatus !== newOrderData.orderStatus) {
        console.log("Order status updated:", newOrderData.orderStatus);
        setOrder(newOrderData);
      }
    } catch (error) {
      console.error("Error refreshing order:", error);
    }
  };

  useEffect(() => {
    const verifyAndFetchOrder = async () => {
      console.log(orderId, paymentId, paymentMethod);

      if (!orderId && !paymentId) {
        setError("Missing order or payment information.");
        navigate("/order");
        return;
      }

      try {
        if (paymentMethod === "Digital") {
          if (!paymentId) {
            setError("Missing payment ID for Stripe verification.");
            navigate(`/order?orderId=${orderId}`);
            return;
          }
          const verifyResponse = await axios.post(
            "/api/v1/user/verifyStripePayment",
            { paymentId },
            { withCredentials: true }
          );
          console.log(verifyResponse.data);
          if (verifyResponse.data.status === "success") {
            setIsVerified(true);
          }
        } else {
          const verifyResponse = await axios.post(
            "/api/v1/user/verifyCashOnDeliveryPayment",
            { orderId },
            { withCredentials: true }
          );
          setIsVerified(true);
        }
        const orderResponse = await axios.post(
          "/api/v1/user/getOrderById",
          { orderId },
          { withCredentials: true }
        );
        setOrder(orderResponse.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        setError(
          "Payment verification or order fetch failed. Please contact support."
        );
        navigate(`/order?orderId=${orderId}`);
      }
    };

    verifyAndFetchOrder();

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [orderId, paymentId, navigate, paymentMethod]);

  useEffect(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    if (!orderId || !order) return;

    if (["Cancelled", "Delivered"].includes(order.orderStatus)) {
      return;
    }

    refreshOrderStatus();

    intervalIdRef.current = setInterval(() => {
      refreshOrderStatus();
    }, 5000);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [orderId, order?.orderStatus]);

  const handleCancelOrder = () => {
    setModal({
      show: true,
      message: "Are you sure you want to cancel this order?",
      action: async () => {
        setModal({
          show: false,
          message: "",
          action: null,
          isSuccess: false,
          refundMessage: null,
        });
        setError(null);
        setCancelSuccess(null);

        try {
          const response = await axios.put(
            "/api/v1/user/updateOrderStatus",
            { orderId, status: "Cancelled" },
            { withCredentials: true }
          );

          if (response.status === 200) {
            setOrder((prevOrder) => ({
              ...prevOrder,
              orderStatus: "Cancelled",
            }));

            if (intervalIdRef.current) {
              clearInterval(intervalIdRef.current);
              intervalIdRef.current = null;
            }

            setModal({
              show: true,
              message: "Order cancelled successfully!",
              action: () => {
                setModal({
                  show: false,
                  message: "",
                  action: null,
                  isSuccess: false,
                  refundMessage: null,
                });
                // Show toast after modal is dismissed
                toast.success("Order cancelled successfully!", {
                  position: "bottom-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "dark",
                });
              },
              isSuccess: true,
              refundMessage:
                paymentMethod === "Digital"
                  ? "Your amount will be refunded to your account within the next 7 days."
                  : null,
            });
          }
        } catch (error) {
          console.error("Cancel Error:", error.response?.data || error.message);
          setError(
            error.response?.data?.message ||
              "Failed to cancel order. Please try again."
          );
        }
      },
      isSuccess: false,
      refundMessage: null,
    });
  };

  const getProgressPercentage = () => {
    if (!order || !order.orderStatus) return 0;
    if (order.orderStatus === "Cancelled") return 0;

    const statusIndex = progressSteps.indexOf(order.orderStatus);
    if (statusIndex === -1) return 0;
    return statusIndex * (100 / (progressSteps.length - 1));
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-600">Loading summary...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        {error}
        <button
          onClick={() => navigate("/cart")}
          className="mt-4 bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 text-center">
          <h1 className="text-xl font-bold mb-3">Order Summary</h1>
          <p className="text-xs">Order ID: {orderId}</p>
          {!["Cancelled", "Delivered"].includes(order.orderStatus) && (
            <p className="text-xs text-green-600 mt-1">
              Status updates automatically
            </p>
          )}
        </div>

        <div className="p-4">
          <div className="flex">
            <div className="mb-4">
              <h2 className="text-md font-semibold text-gray-800 mb-2">
                User Details
              </h2>
              <p className="text-sm text-gray-600">
                Name: {order.customerId?.name}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {order.customerId?.phone}
              </p>
            </div>

            <div className="mb-4 ml-40">
              <h2 className="text-md font-semibold text-gray-800 mb-2">
                Delivery Address
              </h2>
              <p className="text-sm text-gray-600">
                {order.deliveryAddress?.type} - {order.deliveryAddress?.details}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-md font-semibold text-gray-800 mb-2">
              Payment Method
            </h2>
            <p className="text-sm text-gray-600">
              {paymentMethod === "Cash on Delivery" ? (
                <span className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs">
                  Cash on Delivery
                </span>
              ) : (
                <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs">
                  Online Payment (Paid)
                </span>
              )}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-md font-semibold text-gray-800 mb-2">
              Status:{" "}
              <span
                className={
                  order.orderStatus === "Cancelled"
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {order.orderStatus}
              </span>
            </h2>
            {order.orderStatus !== "Cancelled" ? (
              <>
                <div className="w-2/3 bg-gray-200 rounded-full h-1.5 mx-auto">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <div className="w-2/3 mx-auto flex justify-between mt-2 text-xs text-gray-600">
                  {progressSteps.map((status, index) => (
                    <span
                      key={index}
                      className={`font-medium ${
                        progressSteps.indexOf(order.orderStatus) >= index
                          ? "text-green-500"
                          : ""
                      }`}
                    >
                      {status}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-red-600 text-center">
                This order has been cancelled.
              </p>
            )}
          </div>

          <button
            onClick={() =>
              navigate("/", {
                state: { orderId, orderStatus: order.orderStatus },
              })
            }
            className="w-full mt-4 bg-black text-white font-bold py-2 rounded-lg hover:bg-gray-800"
          >
            Back to Home
          </button>

          <button
            onClick={handleCancelOrder}
            disabled={
              order.orderStatus === "Cancelled" ||
              order.orderStatus === "Delivered"
            }
            className={`w-full mt-2 py-2 rounded-lg font-bold ${
              order.orderStatus === "Cancelled" ||
              order.orderStatus === "Delivered"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
          >
            Cancel Order
          </button>

          {cancelSuccess && (
            <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-center">
              {cancelSuccess}
            </div>
          )}
        </div>
      </div>

      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-80">
            <h2 className="text-xl mb-4">{modal.message}</h2>
            {modal.refundMessage && (
              <p className="text-sm text-blue-600 mb-4">
                {modal.refundMessage}
              </p>
            )}
            <div className="flex justify-around mt-4">
              <button
                className={`bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ${
                  modal.isSuccess ? "w-full" : ""
                }`}
                onClick={() => {
                  modal.action();
                }}
              >
                {modal.isSuccess ? "OK" : "Confirm"}
              </button>
              {!modal.isSuccess && (
                <button
                  className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-600 hover:text-white"
                  onClick={() =>
                    setModal({
                      show: false,
                      message: "",
                      action: null,
                      isSuccess: false,
                      refundMessage: null,
                    })
                  }
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default Delivery;
