import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom"; // Import Link for navigation

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    let newErrors = {};

    Object.keys(formData).forEach((fields) => {
      if (!formData[fields]) {
        newErrors[fields] = `*Please Enter Your ${
          fields.charAt(0).toUpperCase() + fields.slice(1)
        }`;
      }
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "*Password does not match";
    }

    if (formData.phone.length !== 10 || /[^0-9]/.test(formData.phone)) {
      newErrors.phone = "*Please enter a valid 10-digit phone number";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const { confirmPassword, ...dataToSend } = formData;
    try {
      const response = await axios.post("/api/v1/user/register", dataToSend);
      toast.success(response.data.message || "Registration Successful!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "300px" },
      });
      setError({});
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "User Already Exists with this Email or Phone Number!";
      setError({ ApiError: errorMessage });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex rounded-lg overflow-hidden">
        {/* Left Side - Image with Orange Curved Background */}
        <div
          className="md:w-1/2 relative hidden md:block"
          style={{ minHeight: "400px" }}
        >
          <div
            className="absolute inset-0 bg-orange-400"
            style={{
              clipPath: "ellipse(80% 100% at 20% 50%)",
              backgroundImage:
                "url('https://img.artiversehub.ai/online/2025/5/8/220a4fd9-3e79-4cd9-8dd6-dcde303e005a_175111179.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl text-gray-800 mb-6 text-center">
              Registration
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(formData).map((fields) => (
                <div key={fields}>
                  <label className="block text-gray-800 text-sm mb-1">
                    {fields.charAt(0).toUpperCase() + fields.slice(1)}
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                    type={fields.includes("password") ? "password" : "text"}
                    value={formData[fields]}
                    name={fields}
                    onChange={handleInputChange}
                    placeholder={`Enter Your ${
                      fields.charAt(0).toUpperCase() + fields.slice(1)
                    }`}
                  />
                  <span className="block text-red-500 text-xs mt-1">
                    {error[fields]}
                  </span>
                </div>
              ))}

              {/* API Error Message */}
              {error.ApiError && (
                <div className="text-red-500 text-sm text-center mb-4">
                  {error.ApiError}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-gray-100 py-2 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200"
                >
                  Register
                </button>
              </div>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-black font-semibold hover:text-gray-800 hover:font-bold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
