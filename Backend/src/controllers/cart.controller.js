import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.models.js";
import { Product } from "../models/product.models.js";
import { ApiResponce } from "../utils/ApiResponce.js";

const addToCart = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const { _id, quantity = 1 } = req.body;
  if (!_id) throw new ApiError(400, "product ID is required");
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ApiError(400, "Quantity must be a positive integer");
  }

  try {
    console.log("Fetching product with ID:", _id);
    const product = await Product.findById(_id);
    if (!product || !product.isAvailable) {
      throw new ApiError(404, "product not found or not available");
    }

    if (product.stock < quantity) {
      throw new ApiError(400, "Requested quantity exceeds available stock");
    }

    console.log("Fetching cart for user:", req.user._id);
    let cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        customerId: req.user._id,
        items: [],
        totalCartAmount: 0,
      });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find((item) =>
      item.productId.equals(product._id)
    );

    if (existingItem) {
      throw new ApiError(400, "product already exists in cart");
    }

    cart.items.push({
      productId: product._id,
      quantity: 1,
      totalPrice: product.price * quantity,
    });

    cart.totalCartAmount += product.price * quantity;

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "name price image isAvailable",
    });

    return res
      .status(200)
      .json(
        new ApiResponce(
          200,
          populatedCart,
          "product added to cart successfully"
        )
      );
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to add product to cart", error);
  }
});

const getCart = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const cart = await Cart.findOne({ customerId: req.user._id }).populate({
      path: "items.productId",
      select: "name price ProductImage isAvailable",
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, cart, "Cart Founded Successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to get cart", error);
  }
});

const clearCart = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const cart = await Cart.findOne({ customerId: req.user._id });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    cart.items = [];
    await cart.save();

    return res
      .status(200)
      .json(new ApiResponce(200, cart, "Cart cleared successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to clear cart", error);
  }
});

const updateQuantity = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const { _id, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ customerId: req.user._id }).populate({
      path: "items.productId",
      select: "name price ProductImage isAvailable",
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const product = await Product.findById(_id);
    if (!product || !product.isAvailable) {
      throw new ApiError(404, "product not found or not available");
    }

    if (product.stock < quantity) {
      throw new ApiError(400, "Requested quantity exceeds available stock");
    }

    const item = cart.items.find((item) => item.productId.equals(product._id));

    if (!item) {
      throw new ApiError(404, "Item not found in cart");
    }

    if (quantity <= 0) {
      cart.items.splice(cart.items.indexOf(item), 1);
      await cart.save();
      return res
        .status(200)
        .json(
          new ApiResponce(200, cart, "Item removed from cart successfully")
        );
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { customerId: req.user._id, "items.productId": product._id },
      {
        $set: {
          "items.$.quantity": quantity,
          "items.$.totalPrice": Number((product.price * quantity).toFixed(2)),
        },
      },
      { new: true }
    ).populate({
      path: "items.productId",
      select: "name price ProductImage isAvailable",
    });

    // Recalculate totalCartAmount from scratch
    updatedCart.totalCartAmount = Number(
      updatedCart.items
        .reduce((sum, item) => sum + item.totalPrice, 0)
        .toFixed(2)
    );
    await updatedCart.save();

    return res
      .status(200)
      .json(
        new ApiResponce(200, updatedCart, "Item quantity updated successfully")
      );
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to update item quantity", error);
  }
});

const productExistsInCart = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }
  try {
    const cart = await Cart.findOne({ customerId: req.user._id }).populate({
      path: "items.productId",
      select: "name price ProductImage isAvailable",
    }); // Populate the productId field

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const { productId } = req.body; // Get the productId from the request body

    // Check if the product exists in the cart
    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) {
      throw new ApiError(404, "product not found or not available");
    }

    const item = cart.items.find((item) => item.productId.equals(productId));

    return res
      .status(200)
      .json(new ApiResponce(200, item, "Item Founded Successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to check product in cart", error);
  }
});

export { addToCart, getCart, clearCart, updateQuantity, productExistsInCart };
