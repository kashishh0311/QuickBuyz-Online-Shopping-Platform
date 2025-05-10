import React, { useState, useEffect } from "react";
import axios from "axios";

function Feedback() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await axios.get("api/v1/admin/getFeedback");
        setFeedbackData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load feedback");
        setLoading(false);
        console.error("Error fetching feedback:", err);
      }
    };

    fetchFeedback();
  }, []);

  // Function to render stars based on actual rating from database
  const renderStars = (rating = 0) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={index < rating ? "text-yellow-400" : "text-gray-300"}
        >
          {index < rating ? "★" : "☆"}
        </span>
      ));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Recent Reviews</h2>
        <div className="flex items-center">
          <div className="relative mr-2">
            <input
              type="text"
              placeholder="What do you want eat today..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 w-80"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list" ? "bg-gray-200" : "bg-white"
              } border border-gray-300 rounded-lg`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid" ? "bg-gray-200" : "bg-white"
              } border border-gray-300 rounded-lg`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        }
      >
        {feedbackData.map((feedback, index) => (
          <div
            key={index}
            className="border-l-4 border-black rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-center mb-4">
              <img
                src={
                  feedback.customerId?.profileImage || "/api/placeholder/40/40"
                }
                alt={feedback.customerId?.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="font-medium text-gray-800">
                  {feedback.customerId?.name || "Anonymous User"}
                </h3>
                {/* <p className="text-sm text-gray-500">
                  User since {new Date().getFullYear()}
                </p> */}
              </div>
            </div>

            <div className="flex items-center mb-3">
              <img
                src={
                  feedback.productId?.ProductImage || "/api/placeholder/40/40"
                }
                alt={feedback.productId?.name || "product"}
                className="w-12 h-12 object-cover rounded-md mr-3"
              />
              <div>
                <h4 className="font-medium text-gray-800">
                  {feedback.productId?.name || "Fish Burger"}
                </h4>
                <div className="flex text-lg">
                  {renderStars(feedback.rating || 0)}
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-3">
              {feedback.review ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."}
            </p>

            <p className="text-sm text-gray-500">
              Given on:{" "}
              {new Date(feedback.createdAt || "2020-06-21").toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feedback;
