import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../CartContext";
import Button from "../Components/Button";
import CartButton from "../Components/CartButton";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart } = useCart();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isInCart, setIsInCart] = useState(false);
  const [cartItem, setCartItem] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/v1/user/getProductById/${id}`, {
          withCredentials: true,
        });
        setProduct(response.data.data);
        console.log("Product data:", response.data.data); // Log to check property names
      } catch (error) {
        setError(
          error.response?.status === 404
            ? "Product not found"
            : "Failed to load product details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const fetchSimilarProducts = async () => {
        try {
          const response = await axios.get("/api/v1/user/getAllProduct", {
            withCredentials: true,
          });
          const relatedProducts = response.data.data.filter(
            (item) =>
              item.category === product.category && item._id !== product._id
          );
          setSimilarProducts(relatedProducts);
          console.log("Similar products:", relatedProducts); // Log to check property names
        } catch (error) {
          console.error("Error fetching similar products:", error);
        }
      };
      fetchSimilarProducts();
    }
  }, [product]);

  useEffect(() => {
    const foundItem = cart.find((item) => item.productId._id === id);
    setIsInCart(!!foundItem);
    setCartItem(foundItem);
  }, [cart, id]);

  const handleAddToCart = () => addToCart(id);

  const handleRatingClick = (index) =>
    setRating(index + 1 === rating ? index : index + 1);

  const handleSubmitFeedback = async () => {
    if (!rating || !reviewText.trim()) {
      setFeedbackMessage("Please provide a rating and review.");
      return;
    }
    setIsSubmitting(true);
    setFeedbackMessage("");
    try {
      await axios.post(
        "/api/v1/user/createFeedback",
        { productId: id, rating, review: reviewText },
        { withCredentials: true }
      );
      setFeedbackMessage("Feedback submitted successfully!");
      setRating(0);
      setReviewText("");
      setShowFeedbackForm(false);
      const updatedProduct = await axios.get(
        `/api/v1/user/getProductById/${id}`,
        {
          withCredentials: true,
        }
      );
      setProduct(updatedProduct.data.data);
    } catch (error) {
      console.error("Feedback submission error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (!error.response) {
        setFeedbackMessage(
          "Network error. Please check your connection and try again."
        );
      } else {
        setFeedbackMessage(
          error.response.status === 401
            ? "User not authenticated. Please log in."
            : error.response.status === 400
            ? error.response.data.message ||
              "You can only review items you've ordered and received."
            : `Server error (${error.response.status}). Please try again later.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return <div className="text-center py-16 text-gray-600">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4 text-lg font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-orange-400 text-white py-2 px-6 rounded-lg hover:bg-orange-500 transition"
        >
          Retry
        </button>
      </div>
    );
  if (!product)
    return <p className="text-center py-16 text-gray-600">Product not found</p>;

  // Get image URL with fallback mechanism - check both possible property names
  const getProductImage = (prod) => {
    return prod.productImage || prod.ProductImage || "/fallback-image.jpg";
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div
        className="pr-2 overflow-y-auto h-[95vh]"
        style={{
          msOverflowStyle: "none", // For IE/Edge (legacy)
          scrollbarWidth: "none", // For Firefox
        }}
      >
        {/* Main Product Section */}
        <div className="max-w-6xl h[90%] mx-auto rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div
              className="p-6"
              style={{
                width: "65%",
                height: "550px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={getProductImage(product)}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                className="object-cover w-full h-full rounded-lg"
                onError={(e) => (e.target.src = "/fallback-image.jpg")}
              />
            </div>
            <div className="md:w-1/2 md:h-1/2 p-6 flex flex-col justify-between mt-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  {product.name}
                </h1>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {product.description || "No description available"}
                </p>

                {/* Add Fabric section for main product */}
                {product.fabric && product.fabric.length > 0 && (
                  <div className="mb-4 mt-7">
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      Fabric:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.fabric.map((item, index) => (
                        <span
                          key={index}
                          className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Check for the alternative property name */}
                {product.Fabric && product.Fabric.length > 0 && (
                  <div className="mb-4 mt-7">
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      Fabric:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.Fabric.map((item, index) => (
                        <span
                          key={index}
                          className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="text-lg font-medium text-gray-800 mb-2">
                  {product.category}
                </div>
                <p className="text-2xl font-semibold text-gray-900 mb-3">
                  ₹{product.price || "N/A"}
                </p>
                <p
                  className={`text-base font-medium mb-4 ${
                    product.isAvailable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.isAvailable ? "In Stock" : "Out of Stock"}
                </p>
                {isInCart ? (
                  <CartButton product={{ _id: id, ...cartItem }} />
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    text="Add to Cart"
                    disabled={!product.isAvailable}
                    className={`w-full py-3 text-white font-semibold rounded-lg transition ${
                      product.isAvailable
                        ? "bg-black-400 hover:bg-gray-800"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="max-w-7xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Similar Items
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProducts.map((item) => (
                <Link
                  key={item._id}
                  to={`/product/${item._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div
                    className="p-6"
                    style={{
                      width: "100%",
                      height: "400px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={getProductImage(item)}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      className="rounded-lg"
                      onError={(e) => (e.target.src = "/fallback-image.jpg")}
                    />
                  </div>
                  <div className="p-4 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <p className="text-gray-700 font-medium mt-1">
                        ₹{item.price}
                      </p>
                      {/* Check both possible property names for fabric */}
                      {item.fabric && item.fabric.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2 justify-center">
                          {item.fabric.map((fabricItem, index) => (
                            <span
                              key={index}
                              className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                            >
                              {fabricItem}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.Fabric && item.Fabric.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2 justify-center">
                          {item.Fabric.map((fabricItem, index) => (
                            <span
                              key={index}
                              className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                            >
                              {fabricItem}
                            </span>
                          ))}
                        </div>
                      )}
                      <p
                        className={`text-base font-medium mb-4 mt-2 ${
                          item.isAvailable ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.isAvailable ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews & Feedback Section */}
        <div className="max-w-7xl mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Reviews & Feedback
          </h2>
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded mb-6"
          >
            {showFeedbackForm ? "Close Form" : "Write a Review"}
          </button>
          {feedbackMessage && (
            <p
              className={`mb-4 ${
                feedbackMessage.includes("success")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {feedbackMessage}
            </p>
          )}
          {showFeedbackForm && (
            <div className="border-t pt-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Your Feedback
              </h3>
              <div className="flex gap-2 mb-4">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    onClick={() => handleRatingClick(index)}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={index < rating ? "orange" : "none"}
                    stroke="orange"
                    strokeWidth="1"
                    className="cursor-pointer"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <textarea
                placeholder="Tell us about your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="3"
              />
              <button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className={`mt-4 bg-orange-400 hover:bg-orange-500 text-white py-2 px-6 rounded ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          )}

          <div className="max-h-[400px] overflow-y-auto space-y-6">
            {product.feedback && product.feedback.length > 0 ? (
              product.feedback.map((review, index) => (
                <div
                  key={index}
                  className="border-b pb-4 last:border-b-0 flex items-start"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={
                        review.customerId?.profileImage || "/fallback-image.jpg"
                      }
                      alt={review.customerId?.name || "Profile"}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "/fallback-image.jpg")}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.customerId?.name || "Anonymous"}
                    </p>
                    <div className="flex gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={i < review.rating ? "orange" : "none"}
                          stroke="orange"
                          strokeWidth="1"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700">{review.review}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-700">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
