import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Plus,
  X,
  Edit,
  Trash2,
  Image,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";

function Products() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    _id: "",
    name: "",
    category: "",
    price: "",
    ProductImage: null,
    imagePreview: "",
    description: "",
    fabric: "",
    isAvailable: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({
    show: false,
    message: "",
    action: null,
  });
  const [productPopup, setProductPopup] = useState(null);
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const formRef = useRef(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/v1/admin/getAllProduct", {
        withCredentials: true,
      });
      setData(response.data.data || []);
      if (response.data.data.length === 0) {
        setError("No products found");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch products";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "500px" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/v1/admin/getAllCategory", {
        withCredentials: true,
      });
      setCategories(response.data.data || []);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch categories";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "500px" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    try {
      const response = await axios.post(
        `/api/v1/admin/getAllProductBySearch`,
        { search: searchQuery },
        { withCredentials: true }
      );
      const results = response.data.data || [];
      setSearchResult(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResult([]);
      toast.error("Failed to fetch search results", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "500px" },
      });
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  useEffect(() => {
    let results = searchQuery.trim() ? searchResult : data;
    const { min: minPrice, max: maxPrice } = priceFilter;

    if (minPrice || maxPrice) {
      results = results.filter((product) => {
        const matchesPrice =
          (!minPrice || product.price >= parseFloat(minPrice)) &&
          (!maxPrice || product.price <= parseFloat(maxPrice));
        return matchesPrice;
      });
    }

    setFilteredData(results);
  }, [searchQuery, priceFilter, searchResult, data]);

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchSearchResults();
    } else {
      setSearchResult([]);
    }
  }, [searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    setError(null);
  };

  const handlePriceFilterChange = (e) => {
    const { name, value } = e.target;
    if (value === "" || parseFloat(value) >= 0) {
      setPriceFilter({ ...priceFilter, [name]: value });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({
        ...product,
        ProductImage: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !product.name ||
      !product.category ||
      !product.price ||
      !product.description ||
      !product.fabric.trim()
    ) {
      setError("Please fill all required fields, including fabric");
      toast.error("Please fill all required fields", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "500px" },
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("isAvailable", product.isAvailable);
      formData.append("Fabric", product.fabric); // Backend expects 'Fabric'
      if (product.ProductImage instanceof File) {
        formData.append("ProductImage", product.ProductImage); // Changed to match backend Multer
      }

      if (product._id) {
        formData.append("_id", product._id);
        setModal({
          show: true,
          message: "Are you sure you want to update this product?",
          action: async () => {
            await axios.put("/api/v1/admin/updateProduct", formData, {
              withCredentials: true,
            });
            toast.success("Product updated successfully!", {
              position: "bottom-center",
              autoClose: 3000,
              hideProgressBar: true,
              style: {
                backgroundColor: "black",
                color: "white",
                width: "500px",
              },
            });
            await fetchData();
            formEmpty();
            setShowAddProduct(false);
            setModal({ show: false, message: "", action: null });
          },
        });
      } else {
        await axios.post("/api/v1/admin/addProduct", formData, {
          withCredentials: true,
        });
        toast.success("Product added successfully!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          style: { backgroundColor: "black", color: "white", width: "500px" },
        });
        await fetchData();
        formEmpty();
        setShowAddProduct(false);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "Operation failed";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "500px" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editProduct = (selectedProduct) => {
    setProduct({
      _id: selectedProduct._id,
      name: selectedProduct.name,
      category: selectedProduct.category,
      price: selectedProduct.price,
      ProductImage: null,
      imagePreview: selectedProduct.ProductImage || "",
      description: selectedProduct.description,
      fabric: Array.isArray(selectedProduct.Fabric)
        ? selectedProduct.Fabric.join(", ")
        : selectedProduct.Fabric || "",
      isAvailable: selectedProduct.isAvailable,
    });
    setShowAddProduct(true);
    setError(null);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const removeProduct = (productId) => {
    setModal({
      show: true,
      message: "Are you sure you want to delete this product?",
      action: async () => {
        setIsLoading(true);
        setError(null);
        try {
          await axios.delete("/api/v1/admin/deleteProduct", {
            data: { _id: productId },
            withCredentials: true,
          });
          toast.success("Product removed successfully!", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            style: { backgroundColor: "black", color: "white", width: "500px" },
          });
          await fetchData();
          setModal({ show: false, message: "", action: null });
        } catch (error) {
          const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Failed to delete product";
          setError(errorMsg);
          toast.error(errorMsg, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            style: { backgroundColor: "black", color: "white", width: "500px" },
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const showProductDetails = (item) => {
    setProductPopup(item);
  };

  const formEmpty = () => {
    setProduct({
      _id: "",
      name: "",
      category: "",
      price: "",
      ProductImage: null,
      imagePreview: "",
      description: "",
      fabric: "",
      isAvailable: true,
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <div className="p-8 bg-gray-100 rounded-xl w-4/5 mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 w-80">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-black"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  name="min"
                  placeholder="Min Price"
                  value={priceFilter.min}
                  onChange={handlePriceFilterChange}
                  className="pl-8 border p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-black"
                  min="0"
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  name="max"
                  placeholder="Max Price"
                  value={priceFilter.max}
                  onChange={handlePriceFilterChange}
                  className="pl-8 border p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-black"
                  min="0"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <button
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg shadow-md disabled:opacity-50 flex items-center gap-2"
            onClick={() => {
              setShowAddProduct(!showAddProduct);
              if (!showAddProduct) formEmpty();
            }}
            disabled={isLoading}
          >
            {showAddProduct ? (
              <>
                <X size={20} />
                Close
              </>
            ) : (
              <>
                <Plus size={20} />
                Add Product
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <XCircle size={20} />
            {error}
          </div>
        )}

        {isLoading && !data.length && (
          <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
            Loading products...
          </div>
        )}

        {showAddProduct && (
          <div ref={formRef} className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {product._id ? (
                <>
                  <Edit size={20} />
                  Edit Product
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add New Product
                </>
              )}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full hover:ring-1 hover:ring-black focus:outline-none"
                required
                disabled={isLoading}
              />
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full hover:ring-1 hover:ring-black focus:outline-none"
                required
                disabled={isLoading}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option
                    key={category._id || category}
                    value={category._id || category}
                  >
                    {category.name || category}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Description"
                value={product.description}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full col-span-1 hover:ring-1 hover:ring-black focus:outline-none"
                required
                disabled={isLoading}
              />
              <div className="flex flex-col">
                <label className="flex items-center gap-2 mb-2">
                  <Image size={20} />
                  Product Image
                </label>
                <input
                  type="file"
                  name="ProductImage"
                  onChange={handleImageChange}
                  className="border border-gray-300 p-2 rounded-lg w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 transition duration-200"
                  accept="image/*"
                  required={!product._id}
                  disabled={isLoading}
                />
                {product.imagePreview && (
                  <img
                    src={product.imagePreview}
                    alt="Preview"
                    className="mt-2 w-20 h-20 rounded-lg object-cover border"
                  />
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={product.price}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full pl-8 hover:ring-1 hover:ring-black focus:outline-none"
                  required
                  disabled={isLoading}
                  min="0"
                />
              </div>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isAvailable"
                    value="true"
                    checked={product.isAvailable === true}
                    onChange={() =>
                      setProduct({ ...product, isAvailable: true })
                    }
                    disabled={isLoading}
                  />
                  <CheckCircle size={20} className="text-green-500" />
                  Available
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isAvailable"
                    value="false"
                    checked={product.isAvailable === false}
                    onChange={() =>
                      setProduct({ ...product, isAvailable: false })
                    }
                    disabled={isLoading}
                  />
                  <XCircle size={20} className="text-red-500" />
                  Not Available
                </label>
              </div>
              <input
                type="text"
                name="fabric"
                placeholder="Fabric (comma separated, e.g., Cotton, Polyester)"
                value={product.fabric}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full col-span-2 hover:ring-1 hover:ring-black focus:outline-none"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-black text-white py-2 px-6 rounded-lg w-full col-span-2 hover:bg-gray-800 shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Processing..."
                ) : product._id ? (
                  <>
                    <Edit size={20} />
                    Update Product
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Add Product
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {data.length === 0 && !isLoading && !error && (
          <div className="mt-8 text-center text-gray-600">
            No products available. Add some to get started!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredData.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
              onClick={() => showProductDetails(item)}
            >
              <div className="p-4">
                <img
                  src={item.ProductImage}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>
              <div className="p-4 pt-0">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  {item.name}
                </h2>
                <p className="text-black font-semibold">₹{item.price}</p>
                <p className="text-gray-600">
                  {typeof item.category === "object"
                    ? item.category?.name || item.category?._id || "N/A"
                    : item.category || "N/A"}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-black hover:bg-gray-800 text-white font-semibold py-1 px-4 rounded disabled:opacity-50 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      editProduct(item);
                    }}
                    disabled={isLoading}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded disabled:opacity-50 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProduct(item._id);
                    }}
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                    {isLoading ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {productPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{productPopup.name}</h2>
              <button onClick={() => setProductPopup(null)}>
                <X size={24} />
              </button>
            </div>
            <img
              src={productPopup.ProductImage}
              alt={productPopup.name}
              className="w-full h-48 rounded-lg object-cover mb-4"
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg";
              }}
            />
            <p className="text-gray-700 mb-2">
              <strong>Description:</strong> {productPopup.description}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Price:</strong> ₹{productPopup.price}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Category:</strong>{" "}
              {typeof productPopup.category === "object"
                ? productPopup.category?.name ||
                  productPopup.category?._id ||
                  "N/A"
                : productPopup.category || "N/A"}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Available:</strong>{" "}
              {productPopup.isAvailable ? (
                <span className="inline text-gray-800">YES</span>
              ) : (
                <span className="inline text-gray-800">NO</span>
              )}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Fabric:</strong>{" "}
              {Array.isArray(productPopup.Fabric)
                ? productPopup.Fabric.join(", ")
                : productPopup.Fabric || ""}
            </p>
            <button
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center gap-2"
              onClick={() => setProductPopup(null)}
            >
              <X size={20} />
              Close
            </button>
          </div>
        </div>
      )}

      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-80">
            <h2 className="text-xl mb-4">{modal.message}</h2>
            <div className="flex justify-around mt-4">
              <button
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                onClick={() => {
                  modal.action();
                }}
                disabled={isLoading}
              >
                <CheckCircle size={20} />
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-600 hover:text-white flex items-center gap-2"
                onClick={() =>
                  setModal({ show: false, message: "", action: null })
                }
                disabled={isLoading}
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        style={{ width: "500px" }}
      />
    </div>
  );
}

export default Products;
