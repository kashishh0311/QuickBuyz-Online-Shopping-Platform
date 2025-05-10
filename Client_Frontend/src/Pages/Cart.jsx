import React, { useContext, useEffect } from "react";
import { useCart } from "../CartContext";
import CartButton from "../Components/CartButton";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function Cart() {
  const { cart, fetchCart, createOrder } = useCart();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleOrderNow = async () => {
    if (!user) {
      navigate("/login");
    } else {
      try {
        const orderData = await createOrder();
        if (orderData) {
          navigate("/order", { state: { orderId: orderData._id } });
        }
      } catch (error) {
        console.error("Order creation failed", error);
      }
    }
  };

  // Calculate total based on cart item structure
  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const price = item.productId?.price || 0;
      return acc + price * item.quantity;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8">
      <div className="w-[90%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side: Cart Items */}
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">YOUR CART</h2>
            <p className="text-sm text-gray-500 italic mb-4">
              Freshly prepared meals are ready to be ordered!
            </p>

            {/* Cart Items */}
            {!cart || cart.length === 0 ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <p className="text-gray-500 text-lg font-medium">
                    Your Cart is Empty
                  </p>
                  <Link
                    to="/product"
                    className="mt-4 inline-block text-black hover:text-gray-800 font-semibold"
                  >
                    Explore Delicious products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-4 pr-3">
                {cart.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <img
                      src={item.productId.ProductImage}
                      alt={item.productId.name}
                      className="w-14 h-14 rounded-md object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h4 className="text-md font-medium text-gray-800">
                        {item.productId.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-md text-black font-medium">
                        ₹{item.productId.price * item.quantity}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <CartButton product={item} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Price Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              PRICE SUMMARY
            </h3>

            <div className="space-y-3 text-gray-600">
              {cart && cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex justify-between text-sm"
                  >
                    <span className="truncate flex-1">
                      {item.productId.name} (x{item.quantity})
                    </span>
                    <span className="text-black">
                      ₹{item.productId.price * item.quantity}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items in cart</p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold text-gray-800 mb-4">
                <span>TOTAL</span>
                <span className="text-black">₹{calculateTotal()}</span>
              </div>
              <button
                onClick={handleOrderNow}
                className={`w-full py-3 rounded-md font-medium transition-all duration-300 ${
                  !cart || cart.length === 0
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-black hover:bg-gray-800 text-white"
                }`}
                disabled={!cart || cart.length === 0}
              >
                {user ? "Order Now" : "Login to Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
