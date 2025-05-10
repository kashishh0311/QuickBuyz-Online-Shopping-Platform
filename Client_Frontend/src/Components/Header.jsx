import React, { useEffect, useState, useMemo, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingCart, Search } from "lucide-react";
import Card from "../Components/Card";

function Header() {
  const { user, logout } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDiv, setShowDiv] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === "" || searchQuery.length < 2) {
      setShowDiv(false);
      setSearchResult([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await axios.post(
          `/api/v1/user/getAllproductBySearch`,
          {
            search: searchQuery,
          }
        );
        const results = response.data.data || [];
        setSearchResult(results);
        setShowDiv(results.length > 0);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setShowDiv(false);
        setSearchResult([]);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleResultClick = () => {
    setShowDiv(false);
    setSearchResult([]);
    setSearchQuery("");
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout Successful!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "white", color: "black", width: "300px" },
      });
      setShowLogoutModal(false);
      window.location.href = "/login";
    } catch (error) {
      toast.error("Logout Failed. Please try again.");
    }
  };

  return (
    <div>
      <nav className="bg-black border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="text-white text-xl font-bold">
            QuickBuyz
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <ul className="flex space-x-6 text-gray-300">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `${
                      isActive ? "text-white font-bold" : "font-normal"
                    } hover:text-gray-100 hover:font-bold`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className={({ isActive }) =>
                    `${
                      isActive ? "text-white font-bold" : "font-normal"
                    } hover:text-gray-100 hover:font-bold`
                  }
                >
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/aboutUs"
                  className={({ isActive }) =>
                    `${
                      isActive ? "text-white font-bold" : "font-normal"
                    } hover:text-gray-100 hover:font-bold`
                  }
                >
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `${
                      isActive ? "text-white font-bold" : "font-normal"
                    } hover:text-gray-100 hover:font-bold`
                  }
                >
                  Profile
                </NavLink>
              </li>
              {user ? (
                <li>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-gray-300 hover:text-gray-100 hover:font-bold"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `${
                        isActive ? "text-white font-bold" : "font-normal"
                      } hover:text-gray-100 hover:font-bold`
                    }
                  >
                    Login
                  </NavLink>
                </li>
              )}
            </ul>

            {/* Search and Cart */}
            <div className="flex items-center space-x-4">
              <div className="relative w-96">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-white text-black rounded h-10 py-1 px-3 focus:outline-none focus:ring-2 focus:ring-gray-600 border border-gray-700 placeholder-gray-400"
                />
                <button
                  onClick={handleSearchClick}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-800"
                >
                  <Search className="h-5 w-5" />
                </button>
                {showDiv && (
                  <div className="absolute right-0 top-full mt-1 w-full bg-gray-800 shadow-lg rounded-lg p-2 z-50 border border-gray-700 max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {searchResult.map((item) => (
                        <NavLink to={`product/${item._id}`} key={item._id}>
                          <div
                            className="flex items-center p-2 border border-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer my-2"
                            onClick={handleResultClick}
                          >
                            <img
                              src={
                                item.ProductImage ||
                                "https://via.placeholder.com/50"
                              }
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover mr-3"
                            />
                            <div className="flex-1">
                              <h2 className="text-sm font-bold text-white">
                                {item.name}
                              </h2>
                              <p className="text-gray-300 font-bold">
                                ₹{item.price}
                              </p>
                            </div>
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className="text-gray-300 hover:text-gray-100">
                <Link to="/Cart">
                  <ShoppingCart className="h-6 w-6" />
                </Link>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-xl text-center w-80 border border-gray-700">
            <h2 className="text-xl mb-4 text-black ">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-around mt-4">
              <button
                className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800"
                onClick={handleLogout}
              >
                Confirm
              </button>
              <button
                className="bg-gray-100 text-black font-bold py-2 px-4 rounded hover:bg-gray-400 border border-gray-100"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Header;
