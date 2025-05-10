import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "ELECTRONICS",
        "KIDS",
        "WOMENS",
        "MENS",
        "HOME_AND_FURNITURE",
        "BEAUTY",
        "SPORTS_AND_OUTDOORS",
        "GROCERY",
        "LUXURY",
        "PET_SUPPLIES",
      ],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    ProductImage: {
      type: String,
      required: true,
      trim: true,
    },

    Fabric: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    feedback: [
      {
        type: Schema.Types.ObjectId,
        ref: "Feedback",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", ProductSchema);
