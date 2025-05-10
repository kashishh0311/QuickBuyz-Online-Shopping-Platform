import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

// export const varifyJWT = asyncHandler(async (req, _, next) => {
//   try {
//     const token = req.body?.accessToken || req.cookies?.accessToken;

//     if (!token) {
//       throw new ApiError(401, "Unauthorized");
//     }

//     const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findById(decodeToken._id).select(
//       "-password -refreshToken"
//     );

//     if (!user) {
//       throw new ApiError(401, "Unauthorized");
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     throw new ApiError(401, "Invalid accessToken");
//   }
// });

export const varifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Check both cookies and body for token (cookies should persist across refresh)
    const token = req.cookies?.accessToken || req.body?.accessToken;

    if (!token) {
      throw new ApiError(401, "No access token provided");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "User not found or unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid access token");
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }
    throw new ApiError(401, "Authorization failed");
  }
});

export const verifyAdminJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.body?.accessToken || req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check if the token belongs to the admin
    if (decodeToken.id !== "admin_unique_id") {
      throw new ApiError(403, "Forbidden: Admin access required");
    }

    req.admin = {
      _id: "admin_unique_id",
      email: process.env.ADMIN_EMAIL,
    };

    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired admin access token");
  }
});
