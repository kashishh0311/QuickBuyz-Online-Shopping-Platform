import React, { useState, useEffect } from "react";
import Axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Axios.get("/api/v1/admin/getAllUser");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  const handleRemoveUser = (userId) => {
    setUserToRemove(userId);
    setShowRemoveModal(true);
  };

  const confirmRemoveUser = async () => {
    try {
      const response = await Axios.delete("/api/v1/admin/deleteUser", {
        data: { _id: userToRemove },
      });

      if (response.status === 200) {
        setUsers(users.filter((user) => user._id !== userToRemove));
        toast.success("User removed successfully!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          style: { backgroundColor: "black", color: "white", width: "400px" },
        });
      }
    } catch (error) {
      console.error("Error removing user:", error);
      setError("Failed to remove user. Please try again.");
      toast.error("Failed to remove user.", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        style: { backgroundColor: "black", color: "white", width: "400px" },
      });
    } finally {
      setShowRemoveModal(false);
      setUserToRemove(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Users</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white flex items-center gap-4 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <img
                src={
                  user.profileImage ||
                  "https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"
                }
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                }}
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <p className="text-gray-600 text-sm">{user.phone}</p>
                <p className="text-gray-500 text-sm">
                  {Array.isArray(user.address) && user.address.length > 0
                    ? user.address
                        .map((addr) => `${addr.type}: ${addr.details}`)
                        .join(", ")
                    : "No address"}
                </p>
              </div>
              <button
                className="bg-black hover:bg-gray-800 text-white text-sm font-bold py-2 px-4 rounded-md"
                onClick={() => handleRemoveUser(user._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Remove User Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-80">
            <h2 className="text-xl mb-4">
              Are you sure you want to remove this user?
            </h2>
            <div className="flex justify-around mt-4">
              <button
                className="bg-black hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                onClick={confirmRemoveUser}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-600 hover:text-white"
                onClick={() => setShowRemoveModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
}

export default Users;
