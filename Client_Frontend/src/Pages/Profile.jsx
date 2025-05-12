import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const navigate = useNavigate();
  const { user, loading, fetchUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState("userInfo");
  const [orders, setOrders] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [modal, setModal] = useState({
    show: false,
    message: "",
    action: null,
    isSuccess: false,
    refundMessage: null,
  });

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    email: "",
  });

  const handleInputChange = (e) => {
    setPasswordFormData({
      ...passwordFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("New password and confirm password do not match", {
        position: "bottom-center",
        theme: "dark",
      });
      return;
    }

    try {
      const response = await fetch("/api/v1/user/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: passwordFormData.email,
          oldPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }
      toast.success("Password changed successfully!", {
        position: "bottom-center",
        theme: "dark",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-center",
        theme: "dark",
      });
    }
  };

  // Default placeholder image URL
  const defaultProfileImage =
    "https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg";

  // Function to apply Cloudinary transformations and add cache-busting
  const applyCloudinaryTransform = (url, width, height) => {
    if (!url || !url.includes("cloudinary.com")) {
      return url;
    }
    const parts = url.split("/upload/");
    if (parts.length !== 2) return url;
    const cacheBuster = `t=${new Date().getTime()}`;
    return `${parts[0]}/upload/c_fit,w_${width},h_${height}/${parts[1]}?${cacheBuster}`;
  };

  useEffect(() => {
    if (user) {
      console.log("User object:", user);
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || []);
      setPreviewImage(
        user.profileImage
          ? applyCloudinaryTransform(user.profileImage, 160, 160)
          : defaultProfileImage
      );
      // Set email for password form
      setPasswordFormData((prev) => ({ ...prev, email: user.email || "" }));
    }
  }, [user]);

  useEffect(() => {
    if (selected === "userOrders" && user) {
      fetchOrders();
    }
  }, [selected, user]);

  const trackOrder = async (orderId) => {
    try {
      const response = await axios.post(
        "/api/v1/user/getPaymentByOrderId",
        { orderId },
        { withCredentials: true }
      );

      const paymentResponse = response.data.data;

      if (!paymentResponse) {
        toast.error("Payment details not found for this order.", {
          position: "bottom-center",
          theme: "dark",
        });
        return;
      }

      setPaymentMethod(paymentResponse.paymentMethod);

      navigate(`/delivery`, {
        state: {
          orderId,
          paymentMethod: paymentResponse.paymentMethod,
          paymentId: paymentResponse._id,
        },
      });
    } catch (error) {
      toast.error("Failed to fetch payment details.", {
        position: "bottom-center",
        theme: "dark",
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/v1/user/getOrderByUserId", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error);
      setOrders([]);
    }
  };

  const handleCancelOrder = (orderId) => {
    setModal({
      show: true,
      message: "Are you sure you want to cancel this order?",
      action: async () => {
        try {
          // Fetch payment method to determine refund message
          const paymentResponse = await axios.post(
            "/api/v1/user/getPaymentByOrderId",
            { orderId },
            { withCredentials: true }
          );

          const paymentMethod = paymentResponse.data.data?.paymentMethod;

          // Cancel the order
          const response = await axios.put(
            "/api/v1/user/updateOrderStatus",
            { orderId, status: "Cancelled" },
            { withCredentials: true }
          );

          if (response.status === 200) {
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order._id === orderId
                  ? { ...order, orderStatus: "Cancelled" }
                  : order
              )
            );
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
              },
              isSuccess: true,
              refundMessage:
                paymentMethod === "Digital"
                  ? "Your amount will be refunded to your account within the next 7 days."
                  : null,
            });
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to cancel order.",
            {
              position: "bottom-center",
              theme: "dark",
            }
          );
          setModal({
            show: false,
            message: "",
            action: null,
            isSuccess: false,
            refundMessage: null,
          });
        }
      },
      isSuccess: false,
      refundMessage: null,
    });
  };

  const handleSave = async () => {
    if (address.length > 0) {
      for (const addr of address) {
        if (!addr.details || addr.details.trim() === "") {
          toast.error("Address details cannot be empty.");
          return;
        }
      }
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone || "");
      formData.append("address", JSON.stringify(address));
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await axios.put(
        "/api/v1/user/updateUserDetails",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Update response:", response.data);

      setIsEditing(false);
      setProfileImage(null);
      await fetchUser();

      const newProfileImage = response.data.data.profileImage;
      if (newProfileImage) {
        setPreviewImage(applyCloudinaryTransform(newProfileImage, 160, 160));
      } else {
        setPreviewImage(defaultProfileImage);
      }
    } catch (error) {
      const errorMsg =
        typeof error.response?.data === "string" &&
        error.response.data.includes("Error:")
          ? error.response.data.match(/Error:.*?<br>/)[0].replace(/<br>/, "")
          : "Failed to update profile";
      toast.error(errorMsg);
    }
  };

  const deleteUserAccount = async (userId) => {
    try {
      await axios.delete("/api/v1/user/deleteUserAccount", {
        data: { _id: userId },
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Account deleted successfully. Redirecting to login...", {
        position: "bottom-center",
        autoClose: 2000,
        style: { background: "black", color: "white" },
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
    }
  };

  const handleDeleteAccount = (userId) => {
    setModal({
      show: true,
      message: "Are you sure you want to delete your account?",
      action: () => {
        deleteUserAccount(userId);
        setModal({
          show: false,
          message: "",
          action: null,
          isSuccess: false,
          refundMessage: null,
        });
      },
      isSuccess: false,
      refundMessage: null,
    });
  };

  const logout = async () => {
    return axios.post(
      "/api/v1/user/logout",
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout Successful!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "300px" },
      });
      setModal({
        show: false,
        message: "",
        action: null,
        isSuccess: false,
        refundMessage: null,
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      toast.error("Logout Failed. Please try again.");
    }
  };

  const initiateLogout = () => {
    setModal({
      show: true,
      message: "Are you sure you want to logout?",
      action: () => {
        handleLogout();
      },
      isSuccess: false,
      refundMessage: null,
    });
  };

  const toggleEditing = () => {
    if (isEditing) {
      handleSave();
    }
    setIsEditing(!isEditing);
  };

  const updateAddress = (index, field, value) => {
    const newAddress = [...address];
    newAddress[index][field] = value;
    setAddress(newAddress);
  };

  const addAddress = () => {
    setAddress([...address, { type: "Home", details: "" }]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) {
    return (
      <div className="text-center mt-8 text-gray-800">Loading user data...</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex justify-center py-12">
      <div className="w-4/5 flex">
        {/* Left Sidebar */}
        <aside className="w-1/4 h-[80vh] bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={
                user.profileImage
                  ? applyCloudinaryTransform(user.profileImage, 64, 64)
                  : defaultProfileImage
              }
              alt="User Profile"
              className="h-16 w-16 rounded-full border-2 border-black"
              onError={(e) => (e.target.src = defaultProfileImage)}
            />
            <div>
              <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          </div>
          <nav className="space-y-4 flex-1">
            {[
              { label: "Profile", value: "userInfo" },
              { label: "Orders", value: "userOrders" },
              { label: "Change Password", value: "ChangePassword" },
              {
                label: "Delete Account",
                value: "Delete Account",
                onClick: () => handleDeleteAccount(user._id),
              },
              { label: "Logout", value: "Logout", onClick: initiateLogout },
            ].map(({ label, value, onClick }) => (
              <button
                key={value}
                onClick={() => {
                  setSelected(value);
                  if (onClick) onClick();
                }}
                className={`w-full py-3 px-4 rounded-lg text-left transition-all ${
                  selected === value
                    ? "bg-black text-white font-semibold"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Content */}
        <main className="w-3/4 ml-6">
          {/* Profile Info Section */}
          {selected === "userInfo" && (
            <div className="bg-white rounded-xl shadow-lg p-6 h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Profile Details
                </h1>
                <button
                  onClick={toggleEditing}
                  className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg"
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2">
                <div className="flex gap-6">
                  <div className="w-2/3 space-y-4">
                    {[
                      {
                        label: "Name",
                        value: name,
                        setter: setName,
                        type: "text",
                      },
                      {
                        label: "Email",
                        value: email,
                        setter: setEmail,
                        type: "email",
                      },
                      {
                        label: "Phone",
                        value: phone,
                        setter: setPhone,
                        type: "text",
                      },
                    ].map(({ label, value, setter, type }) => (
                      <div key={label}>
                        <label className="block text-gray-700 font-semibold mb-1">
                          {label}
                        </label>
                        <input
                          type={type}
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          className={`w-full p-3 rounded-lg border ${
                            isEditing
                              ? "border-black bg-white outline-none"
                              : "border-gray-300 bg-gray-100"
                          }`}
                          disabled={!isEditing}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Profile Image */}
                  <div className="w-1/3 flex flex-col items-center mt-5">
                    <div className="relative h-40 w-40 rounded-full overflow-hidden ring-4 ring-black transform hover:scale-105 transition-transform duration-300 mb-4">
                      <img
                        src={
                          previewImage ||
                          (user.profileImage
                            ? user.profileImage
                            : defaultProfileImage)
                        }
                        alt="User Profile"
                        className="h-full w-full object-cover"
                        onError={(e) => (e.target.src = defaultProfileImage)}
                      />
                    </div>
                    {isEditing && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                          Change Profile Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full p-2 border rounded-lg text-gray-700"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Saved Addresses */}
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-black mb-4">
                    Saved Addresses
                  </h2>
                  {address && address.length > 0 ? (
                    address.map((addr, index) => (
                      <div key={index} className="mb-4 flex space-x-4">
                        <select
                          value={addr.type}
                          onChange={(e) =>
                            updateAddress(index, "type", e.target.value)
                          }
                          className={`border rounded-lg p-2 ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                          disabled={!isEditing}
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                        <input
                          type="text"
                          value={addr.details}
                          onChange={(e) =>
                            updateAddress(index, "details", e.target.value)
                          }
                          className={`text-gray-700 border rounded-lg p-3 w-full ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                          disabled={!isEditing}
                          placeholder="Enter address details"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No addresses saved.</p>
                  )}
                  {isEditing && (
                    <button
                      onClick={addAddress}
                      className="mt-2 text-black hover:text-gray-800 font-semibold"
                    >
                      + Add New Address
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Change Password Section */}
          {selected === "ChangePassword" && (
            <div className="bg-white rounded-xl shadow-lg p-6 h-[80vh] flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 text-center mt-10">
                Change Password
              </h1>
              <div className="flex-1 flex items-center justify-center">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 w-full max-w-md"
                >
                  {[
                    {
                      label: "Email",
                      name: "email",
                      type: "email",
                      disabled: true,
                    },
                    {
                      label: "Current Password",
                      name: "currentPassword",
                      type: "password",
                    },
                    {
                      label: "New Password",
                      name: "newPassword",
                      type: "password",
                    },
                    {
                      label: "Confirm New Password",
                      name: "confirmPassword",
                      type: "password",
                    },
                  ].map(({ label, name, type, disabled }) => (
                    <div key={name}>
                      <label className="block text-gray-700 font-semibold mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={passwordFormData[name]}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border border-black outline-none focus:border-gray-800"
                        required
                        disabled={disabled}
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="w-full p-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors font-semibold"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Orders Section */}
          {selected === "userOrders" && (
            <div className="bg-white rounded-xl shadow-lg p-6 h-[80vh] flex flex-col">
              <div className="flex justify-between items-center ">
                <h1 className="text-2xl font-bold text-gray-800">
                  Your Orders
                </h1>
                <div className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium ">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {orders.length > 0 ? (
                  sortedOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-lg shadow-md p-6 border-l-4 mt-6 border-black hover:border-gray-800 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-black">
                          Order #{order._id}
                        </h3>
                        <span className="bg-gray-100 text-black px-2 py-1 rounded-full text-xs font-medium">
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="mb-4 border-b pb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-bold text-black">
                            ₹{order.totalOrderAmount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="text-gray-700">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="text-gray-700">
                            {order.createdAt.split("T")[1].split(".")[0]}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-black">
                          Order Items:
                        </p>
                        {order.orderItems.map((item) => (
                          <div
                            key={item._id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-700">
                              {item.productId?.name || "Unknown Item"}
                            </span>
                            <span className="text-gray-600">
                              {item.quantity} pcs
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.orderStatus !== "Delivered" &&
                        order.orderStatus !== "Cancelled" && (
                          <div className="mt-4 pt-2 flex justify-end gap-4">
                            <button
                              className="bg-black hover:bg-gray-800 text-white px-4 py-1 rounded text-sm transition-colors"
                              onClick={() => trackOrder(order._id)}
                            >
                              Track Order
                            </button>
                            <button
                              className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-1 rounded text-sm transition-colors"
                              onClick={() => handleCancelOrder(order._id)}
                              disabled={
                                order.orderStatus === "Cancelled" ||
                                order.orderStatus === "Delivered"
                              }
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-center">
                      No orders found.
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Start Ordering
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
      {/* Modal Popup */}
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
                  className="bg-gray-300 text-black font-bold py-2 px-4 rounded hover:bg-gray-600 hover:text-white"
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

      {/* ToastContainer */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        style={{ width: "300px" }}
      />
    </div>
  );
}

export default Profile;
