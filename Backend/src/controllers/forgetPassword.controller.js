import { User } from "../models/user.models.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a 6-digit OTP
const generateOTP = () => {
  const otp = Math.floor(Math.random() * 1000000);

  // Pad with leading zeros if necessary to ensure 6 digits
  return otp.toString().padStart(6, "0");
};

// Request OTP Controller
export const requestOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    throw new ApiError(404, "No account associated with this email found");
  }

  try {
    // Generate OTP
    const otp = generateOTP();

    // Hash the OTP before saving (for security)
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    // Save OTP and expiration
    user.resetOTP = hashedOTP;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Prepare email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP for Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center;">Password Reset Code</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Hello ${user.name || "User"},
            </p>
            
            <p style="color: #666; line-height: 1.6;">
               We received a request to reset the password for your QuickBuyz account. Please use the OTP below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="
                display: inline-block; 
                padding: 15px 30px; 
                background-color: #f0f0f0; 
                border: 1px dashed #999;
                border-radius: 5px;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 5px;
              ">${otp}</div>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              This code will expire in 10 minutes for security reasons.
            </p>
            
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              If you did not request a password reset, you can safely ignore this email.
            </p>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              © ${new Date().getFullYear()} QuickBuyz
            </div>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success (don't send actual OTP in response for security)
    return res
      .status(200)
      .json(
        new ApiResponce(
          200,
          { email: user.email },
          "OTP sent to your email successfully"
        )
      );
  } catch (error) {
    // Remove OTP if email sending fails
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    throw new ApiError(500, "Error sending OTP email", error);
  }
});

// Verify OTP and Reset Password Controller
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Validate inputs
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }

  try {
    // Find user with the email
    const user = await User.findOne({
      email,
      resetOTPExpires: { $gt: new Date() },
    });

    // Check if user exists and OTP hasn't expired
    if (!user || !user.resetOTP) {
      throw new ApiError(400, "Invalid request or OTP expired");
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, user.resetOTP);
    if (!isValidOTP) {
      throw new ApiError(400, "Invalid OTP");
    }

    // Don't clear OTP yet since we'll need it for the reset password step

    // Respond with success
    return res
      .status(200)
      .json(
        new ApiResponce(200, { verified: true }, "OTP verified successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Error verifying OTP", error);
  }
});

// Modify your existing verifyOTPAndResetPassword to handle the final step
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP, and new password are required");
  }

  const user = await User.findOne({
    email,
    resetOTPExpires: { $gt: new Date() },
  });

  if (!user || !user.resetOTP) {
    throw new ApiError(400, "Invalid request or OTP expired");
  }

  const isValidOTP = await bcrypt.compare(otp, user.resetOTP);
  if (!isValidOTP) {
    throw new ApiError(400, "Invalid OTP");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Use updateOne to avoid pre-save hook
  await User.updateOne(
    { _id: user._id },
    {
      $set: { password: hashedPassword },
      $unset: { resetOTP: "", resetOTPExpires: "" },
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponce(
        200,
        { message: "Password reset successful" },
        "Password has been reset successfully"
      )
    );
});

export default {
  requestOTP,
  verifyOTP,
  resetPassword,
};
