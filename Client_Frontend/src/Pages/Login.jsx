import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleValidation = () => {
    let newError = { email: "", password: "" };

    if (!email) {
      newError.email = "*Please Enter Your Email";
    } else if (!validateEmail(email)) {
      newError.email = "Please enter a valid email";
    }
    if (!password) newError.password = "*Please Enter Your Password";

    setErrors(newError);
    return !newError.email && !newError.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    try {
      await login({ email, password });

      const toastId = toast.success("Login Successful!", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        style: { backgroundColor: "black", color: "white", width: "400px" },
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        style: { backgroundColor: "black", color: "white", width: "400px" },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex rounded-lg overflow-hidden">
        {/* Left Side - Image with Orange Curved Background */}
        <div className="w-1/2 relative hidden md:block">
          <div
            className="absolute inset-0 bg-black"
            style={{
              clipPath: "ellipse(80% 100% at 20% 50%)",
              backgroundImage:
                "url('https://img.artiversehub.ai/online/2025/5/8/c669f4dd-518b-4a80-b558-6bdaff7c7d7f_175227192.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
              Sign in
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-800 text-sm mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-800  rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                />
                <span className="block text-blue-500 text-xs mt-1">
                  {errors.email}
                </span>
              </div>

              <div className="relative">
                <label className="block text-gray-800 text-sm mb-1">
                  password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 border border-gray-800  rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />

                <span className="block text-blue-500 text-xs mt-1">
                  {errors.password}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-black transition-colors duration-300 uppercase"
              >
                Submit
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Just discovered QuickBuyz?{" "}
              <Link
                to="/signup"
                className=" font-semibold text-black  hover:text-gray-8000 hover:font-bold transition-colors"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-center text-sm text-gray-600 mt-2">
              <Link
                to="/forgetPassword"
                className=" font-semibold text-black  hover:text-gray-8000 hover:font-bold transition-colors"
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
