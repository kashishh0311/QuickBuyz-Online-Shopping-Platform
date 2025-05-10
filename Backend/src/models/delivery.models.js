import mongoose, { Schema } from "mongoose";

const deliverySchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    estimatedTime: {
      type: Date,
    },
    actualTime: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ["Assigned", "Picked Up", "Delivered"],
      default: "Assigned",
    },
  },
  {
    timestamps: true,
  }
);
export const Delivery = mongoose.model("Delivery", deliverySchema);
