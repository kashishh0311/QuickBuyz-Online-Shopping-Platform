import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

import { AdminContext } from "../AdminContext";
import { useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { logout, admin } = useContext(AdminContext);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout Successful!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "300px" },
      });
      setShowLogoutModal(false);
      window.location.href = "/login";
    } catch (error) {
      toast.error("Logout Failed. Please try again.");
    }
  };

  // Handle clearing search results when a result is clicked

  return (
    <div>
      <nav className="bg-black p-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <a href="#" className="flex items-center">
            <svg
              className="fill-current h-11 w-11 text-white mr-2"
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="300.000000pt"
              height="300.000000pt"
              viewBox="0 0 300.000000 300.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
                fill="#FFFFFF"
                stroke="none"
              >
                <path d="M1435 2498 c-113 -22 -279 -107 -361 -186 -12 -12 -25 -18 -28 -15 -3 4 -6 2 -6 -4 0 -5 -18 -29 -40 -53 -22 -24 -40 -47 -40 -52 0 -4 -13 -27 -30 -50 -16 -22 -30 -44 -30 -48 0 -4 -10 -29 -22 -56 -26 -59 -25 -55 -38 -124 -28 -145 -19 -263 30 -418 17 -51 30 -102 29 -115 0 -12 -14 -42 -29 -67 -16 -25 -36 -58 -43 -75 -8 -16 -26 -48 -41 -69 -31 -47 -33 -84 -5 -120 26 -33 67 -34 100 -3 23 20 80 111 123 196 10 20 55 92 100 161 46 69 85 133 89 143 3 9 11 17 17 17 13 0 13 -6 -2 -33 -7 -12 -13 -26 -14 -32 -1 -5 -16 -37 -33 -70 -17 -33 -36 -72 -43 -87 -7 -16 -16 -28 -20 -28 -4 0 -8 -7 -8 -15 0 -17 -60 -130 -102 -192 -15 -23 -28 -46 -28 -51 0 -5 -16 -30 -35 -55 -19 -25 -35 -50 -35 -55 0 -20 -47 -92 -55 -85 -4 5 -5 3 -1 -4 6 -11 -15 -56 -34 -73 -3 -3 -17 -27 -31 -55 -14 -27 -43 -81 -63 -118 -41 -75 -41 -94 2 -134 30 -28 55 -23 90 16 29 32 91 127 102 155 4 12 31 58 59 103 28 46 51 90 51 98 0 9 4 14 9 11 5 -4 12 7 16 24 4 16 10 30 14 30 4 0 28 38 54 84 50 89 77 109 117 84 36 -23 35 -48 -6 -128 -22 -41 -42 -77 -45 -80 -3 -3 -21 -32 -39 -65 -18 -33 -39 -68 -48 -77 -8 -10 -13 -18 -10 -18 4 0 -14 -35 -38 -77 -24 -43 -44 -85 -44 -94 0 -29 33 -59 71 -65 48 -8 62 9 185 227 6 10 14 16 18 11 5 -4 7 0 5 8 -3 20 11 53 28 63 7 4 13 14 13 22 0 14 38 85 51 95 3 3 23 37 44 75 20 39 50 86 66 106 16 20 29 40 29 44 0 5 11 23 25 41 14 18 25 35 25 39 0 7 39 63 58 83 6 7 12 24 12 38 0 13 4 24 8 24 9 0 8 106 -1 189 -3 34 1 55 20 90 31 60 63 81 63 43 0 -29 35 -55 65 -50 21 4 31 -2 53 -33 28 -40 57 -49 81 -26 11 10 12 6 6 -23 -4 -19 -12 -41 -17 -47 -6 -7 -7 -13 -3 -13 26 0 -53 -58 -85 -62 -3 -1 -30 -13 -60 -29 -74 -37 -114 -88 -188 -234 -9 -16 -19 -32 -23 -35 -5 -3 -10 -15 -12 -25 -1 -11 -10 -31 -19 -45 -9 -14 -25 -41 -35 -60 -10 -19 -31 -54 -46 -77 -15 -23 -28 -48 -29 -55 -2 -7 -10 -20 -19 -30 -8 -10 -35 -57 -60 -105 -24 -49 -48 -91 -53 -94 -5 -4 -6 -11 -2 -17 3 -6 2 -13 -4 -17 -15 -10 -12 -22 14 -49 27 -30 71 -34 101 -8 27 23 75 88 75 102 0 6 7 13 15 16 8 4 15 17 15 29 0 13 3 25 8 27 4 2 18 25 32 52 13 27 29 54 35 60 5 6 21 33 35 59 41 79 70 103 136 117 81 16 234 81 297 126 52 37 187 172 187 187 0 5 11 23 24 40 49 66 94 193 108 303 12 97 0 273 -21 297 -5 7 -9 14 -9 17 0 18 -17 68 -28 85 -8 11 -14 25 -14 33 0 39 -149 219 -222 268 -24 15 -47 33 -53 38 -27 29 -228 108 -251 99 -6 -2 -15 0 -19 6 -8 13 -218 12 -290 -1z" />
              </g>
            </svg>
            <span className="text-white text-xl font-bold">QuickBites</span>
          </a>
          <div className="flex items-center">
            <ul className="flex space-x-4 mr-6 text-white">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `${
                      isActive ? "font-bold" : "font-normal"
                    } hover:font-bold transition-all duration-200 ease-in-out`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className={({ isActive }) =>
                    `${
                      isActive ? "font-bold" : "font-normal"
                    } hover:font-bold transition-all duration-200 ease-in-out`
                  }
                >
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/order"
                  className={({ isActive }) =>
                    `${
                      isActive ? "font-bold" : "font-normal"
                    } hover:font-bold transition-all duration-200 ease-in-out `
                  }
                >
                  Order
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `${
                      isActive ? "font-bold" : "font-normal"
                    } hover:font-bold transition-all duration-200 ease-in-out`
                  }
                >
                  Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/feedback"
                  className={({ isActive }) =>
                    `${
                      isActive ? "font-bold" : "font-normal"
                    } hover:font-bold transition-all duration-200 ease-in-out`
                  }
                >
                  FeedBacks
                </NavLink>
              </li>
              {admin ? (
                <li>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-white hover:font-bold"
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
                        isActive ? "font-bold" : "font-normal"
                      } hover:font-bold`
                    }
                  >
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-80">
            <h2 className="text-xl mb-4">Are you sure you want to logout?</h2>
            <div className="flex justify-around mt-4">
              <button
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                onClick={handleLogout}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-600 hover:text-white"
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
