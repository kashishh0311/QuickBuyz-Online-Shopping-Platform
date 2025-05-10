import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.models.js";
import { Order } from "../models/order.models.js";
import { User } from "../models/user.models.js";
import { Payment } from "../models/payment.models.js";

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  try {
    // Total Counts
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalPayments = await Payment.countDocuments();

    // Debug: Log user count and all users
    const users = await User.find({}, { name: 1, email: 1 });
    console.log("User Count:", totalUsers);
    console.log("Users in database:", users);

    // Revenue Summary
    const revenue = await Payment.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);

    // Debug: Log payment aggregation
    console.log("Revenue Aggregation:", revenue);

    // Order Status Breakdown (for bar chart)
    const orderStatusBreakdown = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } },
    ]);

    // Top Products (by quantity sold, with sales value)
    const topProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productId",
          totalQuantity: { $sum: "$orderItems.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          totalQuantity: 1,
          price: "$product.price",
          totalSales: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$product.price", null] },
                  { $ne: ["$product.price", undefined] },
                ],
              },
              then: { $multiply: ["$product.price", "$totalQuantity"] },
              else: 0,
            },
          },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);

    // Debug: Log top products to check prices
    console.log("Top Products:", topProducts);

    const analytics = {
      totalProducts,
      totalOrders,
      totalUsers,
      totalPayments,
      totalRevenue: revenue[0]?.totalRevenue || 0,
      orderStatusBreakdown,
      topProducts,
    };

    // Debug: Log full analytics
    console.log("Analytics Data:", analytics);

    return res
      .status(200)
      .json(
        new ApiResponce(
          200,
          analytics,
          "Dashboard analytics fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error in getDashboardAnalytics:", error);
    throw new ApiError(500, "Failed to fetch dashboard analytics", error);
  }
});

export { getDashboardAnalytics };
