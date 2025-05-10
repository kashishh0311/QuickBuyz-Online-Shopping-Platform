import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import jwt from "jsonwebtoken"; // For token generation

// Utility function to generate access and refresh tokens
const generateAccessAndRefreshToken = async (adminId) => {
  const accessToken = jwt.sign(
    { id: adminId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "20d" }
  );
  const refreshToken = jwt.sign(
    { id: adminId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "20d" }
  );
  return { accessToken, refreshToken };
};

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Check against .env credentials
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail) {
    throw new ApiError(404, "Admin not found");
  }

  // If password in .env is plain text
  if (password !== adminPassword) {
    throw new ApiError(401, "Invalid password");
  }
  const admin = {
    _id: "admin_unique_id", // Static ID since no DB
    email: adminEmail,
  };

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    admin._id
  );

  // Simulated logged-in admin data (excluding sensitive fields)
  const loggedInAdmin = {
    _id: admin._id,
    email: admin.email,
  };

  // Set cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // Send response with tokens in cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponce(
        200,
        { admin: loggedInAdmin, accessToken, refreshToken },
        "Admin logged in successfully"
      )
    );
});

const adminLogout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .json(new ApiResponce(200, null, "Admin logged out successfully"));
});

const fetchAdmin = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponce(200, req.admin, "Admin fetched"));
});

export { loginAdmin, adminLogout, fetchAdmin };
