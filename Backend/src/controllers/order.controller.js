import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.models.js";
import { Product } from "../models/product.models.js";
import { Order } from "../models/order.models.js";
import { User } from "../models/user.models.js";
import { Payment } from "../models/payment.models.js";

// const createOrder = asyncHandler(async (req, res) => {
//   if (!req.user?._id) {
//     throw new ApiError(401, "User not authenticated");
//   }

//   const addressIndex = req.body.addressIndex ?? 0;

//   const cart = await Cart.findOne({ customerId: req.user._id });
//   if (!cart) {
//     throw new ApiError(404, "Cart not found");
//   }

//   if (cart.items.length === 0) {
//     throw new ApiError(400, "Cart is empty");
//   }

//   const user = await User.findById(req.user._id);
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   let charges;
//   if (cart.totalCartAmount < 100) {
//     charges = cart.totalCartAmount * 0.15;
//   } else if (cart.totalCartAmount >= 100 && cart.totalCartAmount < 500) {
//     charges = cart.totalCartAmount * 0.1;
//   } else {
//     charges = 0;
//   }

//   if (
//     !user.address ||
//     user.address.length === 0 ||
//     !user.address[addressIndex]
//   ) {
//     throw new ApiError(400, "Invalid delivery address selection");
//   }

//   try {
//     const orderItems = cart.items.map((item) => ({
//       productId: item.productId,
//       quantity: item.quantity,
//       totalPrice: item.totalPrice,
//     }));

//     const order = await Order.create({
//       customerId: req.user._id,
//       orderItems,
//       totalOrderAmount: cart.totalCartAmount + charges,
//       orderStatus: "Pending",
//       deliveryAddress: {
//         type: user.address[addressIndex]?.type,
//         details: user.address[addressIndex]?.details,
//       },
//       charges,
//     });

//     const payment = await Payment.create({
//       orderId: order._id,
//       customerId: req.user._id,
//       paymentMethod: "Digital",
//       amount: order.totalOrderAmount,
//       paymentStatus: "Pending",
//     });

//     return res
//       .status(201)
//       .json(new ApiResponce(201, order, "Order created successfully"));
//   } catch (error) {
//     console.error("Error details:", error);
//     throw new ApiError(500, "Failed to create order", error);
//   }
// });

const createOrder = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const addressIndex = req.body.addressIndex ?? 0;

  const cart = await Cart.findOne({ customerId: req.user._id });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  if (cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  console.log("Cart Items:", cart.items);
  console.log("Total Cart Amount:", cart.totalCartAmount);

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const orderItems = cart.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    totalPrice: Number(item.totalPrice.toFixed(2)),
  }));

  // Recalculate totalOrderAmount based on orderItems
  const itemsTotal = Number(
    orderItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
  );

  let charges;
  if (itemsTotal < 100) {
    charges = Number((itemsTotal * 0.15).toFixed(2));
  } else if (itemsTotal >= 100 && itemsTotal < 500) {
    charges = Number((itemsTotal * 0.1).toFixed(2));
  } else {
    charges = 0;
  }

  const totalOrderAmount = Number((itemsTotal + charges).toFixed(2));

  if (
    !user.address ||
    user.address.length === 0 ||
    !user.address[addressIndex]
  ) {
    throw new ApiError(400, "Invalid delivery address selection");
  }

  try {
    const order = await Order.create({
      customerId: req.user._id,
      orderItems,
      totalOrderAmount,
      orderStatus: "Pending",
      deliveryAddress: {
        type: user.address[addressIndex]?.type,
        details: user.address[addressIndex]?.details,
      },
      charges,
    });

    const payment = await Payment.create({
      orderId: order._id,
      customerId: req.user._id,
      paymentMethod: "Digital",
      amount: totalOrderAmount,
      paymentStatus: "Pending",
    });

    return res
      .status(201)
      .json(new ApiResponce(201, order, "Order created successfully"));
  } catch (error) {
    console.error("Error details:", error);
    throw new ApiError(500, "Failed to create order", error);
  }
});

const updateOrder = asyncHandler(async (req, res) => {
  const { orderId, addressIndex } = req.body;

  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const user = await User.findById(req.user._id);
  if (!user || !user.address || !user.address[addressIndex]) {
    throw new ApiError(400, "Invalid address selection");
  }

  order.deliveryAddress = {
    type: user.address[addressIndex].type,
    details: user.address[addressIndex].details,
  };

  await order.save();

  return res
    .status(200)
    .json(new ApiResponce(200, order, "Order updated successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, orderId } = req.body;
  if (!status) {
    throw new ApiError(400, "Order status is required");
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    order.orderStatus = status;
    await order.save();

    return res
      .status(200)
      .json(new ApiResponce(200, order, "Order status updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to update order status", error);
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const order = await Order.findOneAndDelete(req.body.orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    return res
      .status(200)
      .json(new ApiResponce(200, order, "Order deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to delete order", error);
  }
});

const getOrderByUserId = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const orders = await Order.find({ customerId: req.user?._id })
      .populate({
        path: "orderItems.productId",
        select: "name price ProductImage isAvailable",
      })
      .populate({
        path: "customerId",
        select: "name email",
      });

    if (!orders.length) {
      throw new ApiError(404, "No orders found for this user");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, orders, "Orders retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve orders: " + error.message);
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const order = await Order.findById(req.body.orderId)
      .populate({
        path: "orderItems.productId",
        select: "name price ProductImage isAvailable restaurantId",
      })
      .populate({
        path: "customerId",
        select: "name email phone ProductImage",
      });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, order, "Order fetched successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to get order", error, {
      orderId: req.body.orderId,
    });
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "orderItems.productId",
        select: "name price ProductImage isAvailable",
      })
      .populate({
        path: "customerId",
        select: "name email",
      });

    if (!orders) {
      throw new ApiError(404, "Orders not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, orders, "Orders Founded Successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to get orders", error);
  }
});

const getOrdersByStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) {
    throw new ApiError(400, "Order status is required");
  }

  try {
    const orders = await Order.find({ status })
      .populate({
        path: "orderItems.productId",
        select: "name price ProductImage isAvailable",
      })
      .populate({
        path: "customerId",
        select: "name email",
      });

    if (!orders) {
      throw new ApiError(404, "Orders not found");
    }
    return res
      .status(200)
      .json(new ApiResponce(200, orders, "Orders Founded Successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to get orders", error);
  }
});

const getAllStatus = asyncHandler(async (req, res) => {
  try {
    const statusEnum = Order.schema.path("orderStatus").enumValues;
    console.log("Enum statuses:", statusEnum);

    return res
      .status(200)
      .json(new ApiResponce(200, statusEnum, "Statuses fetched successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to get statuses", error.message || error);
  }
});

export {
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderByUserId,
  getAllOrders,
  getOrdersByStatus,
  getOrderById,
  getAllStatus,
};
