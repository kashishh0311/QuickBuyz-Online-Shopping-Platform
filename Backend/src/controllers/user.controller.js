import { ApiResponce } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Validate input fields
  if (
    [name, email, password, phone, address].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existUser) {
    throw new ApiError(
      409,
      "User already exists with this email or phone number"
    );
  }
  console.log("Uploaded File:", req.files); // Check if file is received
  console.log("Profile Image Path:", req.files?.profileImage?.[0]?.path);

  // Handle profile image upload
  let profileImage;
  // const profileImageLocalPath = req.files?.profileImage?.[0]?.path;
  const profileImageLocalPath = req.file?.path;
  console.log(profileImageLocalPath);

  if (profileImageLocalPath) {
    try {
      profileImage = await uploadOnCloudinary(profileImageLocalPath);
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    password, // Consider adding password hashing middleware
    // address: JSON.parse(req.body.address),
    profileImage: profileImage?.url || "",
  });

  // Retrieve created user without sensitive information
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    // If user creation fails, delete uploaded image
    if (profileImage?.public_id) {
      await deleteFromCloudinary(profileImage.public_id);
    }
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponce(201, createdUser, "User registered successfully"));
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error.message ||
        "Something went wrong while generating refresh and access token"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure in production
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponce(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findOneAndUpdate(
    req.user._id,

    {
      $unset: { refreshToken: undefined },
    },

    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure in production
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce(200, "User logged out successfully"));
});

const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Refresh Token");
  }

  try {
    const decodeToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodeToken?._id);

    if (!user) {
      throw new ApiError(401, "Unauthorized User");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is Expired or Used");
    }

    const options = {
      httpOnly: true,
      //secure: process.env.NODE_ENV === "production", // Only secure in production
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponce(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Invalid Refresh Token");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  // Validate input
  if (!email || !oldPassword || !newPassword) {
    throw new ApiError(
      400,
      "Email, old password, and new password are required"
    );
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  // Verify old password
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password");
  }

  // Update password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  // Send response
  return res
    .status(200)
    .json(new ApiResponce(200, null, "Password changed successfully"));
});
const getUserDetails = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponce(200, req.user, "User details fetched successfully"));
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  user.otp = otp;
  await user.save({ validateBeforeSave: false });

  // await nodemailerMessage(user.email, otp);

  return res
    .status(200)
    .json(new ApiResponce(200, { otp }, "OTP sent to your email successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  console.log("Request body:", { name, email, phone, address });
  console.log("File:", req.file);

  // Validate required fields
  if (!name || !email) {
    throw new ApiError(400, "Name and email are required");
  }

  // Validate user authentication
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "User not authenticated or ID missing");
  }

  // Handle profile image upload if provided
  let profileImage;
  const profileImageLocalPath = req.file?.path;
  if (profileImageLocalPath) {
    try {
      profileImage = await uploadOnCloudinary(profileImageLocalPath);
      if (!profileImage?.url) {
        throw new ApiError(
          500,
          "Cloudinary upload succeeded but no URL returned"
        );
      }
      console.log("Uploaded to Cloudinary:", profileImage.url);
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  // Parse and validate address
  let parsedAddress = req.user.address || []; // Default to existing address or empty array
  if (address && address !== "undefined" && address !== "") {
    try {
      parsedAddress = JSON.parse(address); // Parse stringified array
      if (!Array.isArray(parsedAddress)) {
        throw new Error("Address must be an array");
      }
      if (parsedAddress.length > 0) {
        parsedAddress.forEach((addr) => {
          if (!addr.type || !["Home", "Work", "Other"].includes(addr.type)) {
            throw new Error(
              `Invalid address type: ${addr.type}. Must be one of "Home", "Work", "Other"`
            );
          }
          if (
            !addr.details ||
            typeof addr.details !== "string" ||
            addr.details.trim() === ""
          ) {
            throw new Error(
              "Address details are required and must be a non-empty string"
            );
          }
        });
      }
    } catch (parseError) {
      console.error("Address parsing error:", parseError);
      throw new ApiError(400, `Invalid address format: ${parseError.message}`);
    }
  }

  try {
    console.log("Updating user with ID:", req.user._id);
    console.log("Parsed address for update:", parsedAddress);

    const updateData = {
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      address: parsedAddress, // Use parsed array
    };
    if (profileImage) {
      updateData.profileImage = profileImage.url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      console.log("No user found with ID:", req.user._id);
      throw new ApiError(404, "User not found in database");
    }

    console.log("User updated successfully:", updatedUser);
    return res
      .status(200)
      .json(
        new ApiResponce(
          200,
          updatedUser,
          "Account details updated successfully"
        )
      );
  } catch (error) {
    console.error(
      "Database update error:",
      error.name,
      error.message,
      error.stack
    );
    throw new ApiError(500, error.message || "Failed to update user details");
  }
});
const deleteUserAccount = asyncHandler(async (req, res) => {
  try {
    await User.findOneAndDelete(req.user._id);

    return res
      .status(200)
      .json(new ApiResponce(200, "User Account deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to delete User Account");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  try {
    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, user, "User deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to delete User");
  }
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.find();

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, user, "User Founded Successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to Found user");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  try {
    const user = await User.findOne({ _id });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, user, "User Founded Successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to Found user");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUserDetails,
  forgetPassword,
  updateUserDetails,
  deleteUserAccount,
  deleteUser,
  getAllUser,
  getUserById,
  changePassword,
};
