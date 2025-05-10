import mongoose, { Schema } from "mongoose";
import { Product } from "./product.models.js";

const orderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalOrderAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    charges: {
      type: Number,
      default: 0,
    },
    orderItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },

        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    orderStatus: {
      type: String,
      // required: true,
      enum: [
        "Pending",
        "Order Placed",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    deliveryAddress: {
      type: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, // Optional field
      },
    },
  },
  {
    timestamps: true,
  }
);
export const Order = mongoose.model("Order", orderSchema);
