import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash on Delivery", "Digital"],
      default: "Cash on Delivery",
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    transactionId: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    stripeSessionId: { type: String },
  },
  {
    timestamps: true,
  }
);
export const Payment = mongoose.model("Payment", paymentSchema);
