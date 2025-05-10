import React, { useEffect, useState, useMemo } from "react";
import Card from "../Components/Card";
import axios from "axios";

function Product() {
  const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          axios.get("/api/v1/user/getAllProduct"), // Update to the correct endpoint for products
          axios.get("/api/v1/user/getAllCategory"), // Same here for categories
        ]);

        setProductData(productResponse.data.data || []);
        setCategories(categoriesResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "Failed to load product items and categories. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Get search query from URL
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search") || "";
    setSearchQuery(search);
  }, []);

  // Memoized filtering with search included
  const filteredProductData = useMemo(() => {
    return productData.filter((product) => {
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;
      const matchesPrice =
        (!minPrice || product.price >= parseFloat(minPrice)) &&
        (!maxPrice || product.price <= parseFloat(maxPrice));
      const matchesRating =
        !selectedRating || product.rating === parseFloat(selectedRating);
      const matchesAvailability =
        selectedAvailability === "" ||
        product.isAvailable.toString() === selectedAvailability;
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesAvailability &&
        matchesSearch
      );
    });
  }, [
    productData,
    selectedCategory,
    minPrice,
    maxPrice,
    selectedRating,
    selectedAvailability,
    searchQuery,
  ]);

  const resetFilters = async () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedRating("");
    setSelectedAvailability("");
    setSearchQuery("");
    setIsLoading(true);
    try {
      const response = await axios.get("/api/v1/user/getAllProduct"); // Adjusted to new API
      setProductData(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error("Error resetting filters:", error);
      setError("Failed to load product items.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <p className="text-red-500 mb-6 text-xl">{error}</p>
          <button
            onClick={resetFilters}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-100 hover:text-black transition-colors font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Inline Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-gray-700 text-xs font-medium">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-gray-100 transition-colors"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-gray-700 text-xs font-medium">
                Min Price (₹)
              </label>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-gray-100 transition-colors"
              />
            </div>
            <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-gray-700 text-xs font-medium">
                Max Price (₹)
              </label>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-gray-100 transition-colors"
              />
            </div>
            <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-gray-700 text-xs font-medium">
                Rating
              </label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-gray-100 transition-colors"
              >
                <option value="">All Ratings</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-gray-700 text-xs font-medium">
                Availability
              </label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-gray-100 transition-colors"
              >
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </div>
          <button
            onClick={resetFilters}
            className="mt-4 bg-black text-white p-2 rounded-md hover:bg-gray-800 hover:text-white transition-colors font-medium w-28"
          >
            Reset Filters
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProductData.length > 0 ? (
            filteredProductData.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Card id={product._id} {...product} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-xl mb-4">
                No products match your current selection.
              </p>
              <button
                onClick={resetFilters}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Product;
