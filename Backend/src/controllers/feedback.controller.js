import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { Feedback } from "../models/feedback.models.js";
import { User } from "../models/user.models.js";
import { Product } from "../models/product.models.js";
import { Order } from "../models/order.models.js";

const createFeedback = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const { rating, review, productId } = req.body;

  try {
    const previousOrder = await Order.findOne({
      customerId: req.user._id,
      orderItems: { $elemMatch: { productId: productId } }, // Keep this as ProductId if your order schema uses it
      orderStatus: "Delivered",
    });

    if (!previousOrder) {
      throw new ApiError(
        400,
        "You can only give feedback on products you have previously ordered and received."
      );
    }

    const existingFeedback = await Feedback.findOne({
      customerId: req.user._id,
      productId: productId,
    });

    if (existingFeedback) {
      throw new ApiError(
        400,
        "You have already given feedback for this product."
      );
    }

    const feedback = await Feedback.create({
      customerId: req.user._id,
      productId: productId,
      rating,
      review,
    });

    await Product.findByIdAndUpdate(
      productId,
      { $push: { feedback: feedback._id } },
      { new: true }
    );

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate({ path: "customerId", select: "name profileImage" })
      .populate({ path: "productId", select: "name description price" });

    return res
      .status(201)
      .json(
        new ApiResponce(
          201,
          populatedFeedback,
          "Feedback received successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Failed to create feedback", error);
  }
});

const getFeedback = asyncHandler(async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate({
        path: "customerId",
        select: "name profileImage email",
      })
      .populate({
        path: "productId",
        select: "name ProductImage",
      });

    return res
      .status(200)
      .json(new ApiResponce(200, feedback, "Feedback Founded Successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to get feedback", error);
  }
});

export { createFeedback, getFeedback };
