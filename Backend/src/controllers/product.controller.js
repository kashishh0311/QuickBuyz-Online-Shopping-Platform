import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import { Feedback } from "../models/feedback.models.js";
import mongoose from "mongoose";

// Add Product
const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, isAvailable, Fabric } = req.body;

  if (
    [name, description, price, category, isAvailable].some(
      (field) => field?.trim() === ""
    ) ||
    !Fabric
  ) {
    throw new ApiError(400, "All fields are required, including Fabric");
  }

  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    throw new ApiError(409, "Product already exists with this name");
  }

  const FabricArray = Fabric.split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  const productImageLocalPath = req.file?.path;
  let productImage;
  if (productImageLocalPath) {
    try {
      productImage = await uploadOnCloudinary(productImageLocalPath);
    } catch (uploadError) {
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    isAvailable,
    ProductImage: productImage?.url || "",
    Fabric: FabricArray,
  });

  const addedProduct = await Product.findById(product._id);
  if (!addedProduct) {
    if (productImage?.public_id) {
      await deleteFromCloudinary(productImage.public_id);
    }
    throw new ApiError(500, "Failed to add product");
  }

  return res
    .status(201)
    .json(new ApiResponce(201, addedProduct, "Product added successfully"));
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { _id, name, description, price, category, isAvailable, Fabric } =
    req.body;

  if (!_id) {
    throw new ApiError(400, "Product ID is required");
  }
  let FabricArray;
  if (Fabric) {
    FabricArray = Fabric.split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }

  const productImageLocalPath = req.file?.path;
  let productImage;
  if (productImageLocalPath) {
    try {
      productImage = await uploadOnCloudinary(productImageLocalPath);
    } catch (uploadError) {
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  const existingProduct = await Product.findById(_id);
  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  const updatedProductImage = productImage?.url || existingProduct.ProductImage;

  const updatedProduct = await Product.findByIdAndUpdate(
    _id,
    {
      $set: {
        name,
        description,
        price,
        category,
        isAvailable,
        ProductImage: updatedProductImage,
        ...(Fabric && { Fabric: FabricArray }),
      },
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, updatedProduct, "Product updated successfully"));
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  const product = await Product.findByIdAndDelete(_id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, product, "Product deleted successfully"));
});

// Get All Products
const getAllProduct = asyncHandler(async (req, res) => {
  const products = await Product.find();
  if (!products) {
    throw new ApiError(404, "No products found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, products, "Products retrieved successfully"));
});

// Get Product By Name
const getProductByName = asyncHandler(async (req, res) => {
  const { name } = req.query;

  const product = await Product.findOne({ name }).populate({
    path: "feedback",
    populate: { path: "customerId", select: "name" },
    select: "customerId rating review",
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, product, "Product found successfully"));
});

// Get Product By ID
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate({
    path: "feedback",
    populate: { path: "customerId", select: "name profileImage" },
    select: "customerId rating review",
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, product, "Product found successfully"));
});

// Get Product By Category
const getAllProductByCategory = asyncHandler(async (req, res) => {
  const { category } = req.query;

  const products = await Product.find({ category }).populate({
    path: "feedback",
    populate: { path: "customerId", select: "name" },
    select: "customerId rating review",
  });

  if (products.length === 0) {
    throw new ApiError(404, "No product found in this category");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, products, "Products found successfully"));
});

// Get Product By Price Range
const getAllProductByPrice = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  const query = {};
  if (minPrice && maxPrice) {
    query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  } else if (minPrice) {
    query.price = { $gte: Number(minPrice) };
  } else if (maxPrice) {
    query.price = { $lte: Number(maxPrice) };
  }

  const products = await Product.find(query).populate({
    path: "feedback",
    populate: { path: "customerId", select: "name" },
    select: "customerId rating review",
  });

  if (products.length === 0) {
    throw new ApiError(404, "No products found in this price range");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, products, "Products found successfully"));
});

// Get Product By Rating
const getAllProductByRating = asyncHandler(async (req, res) => {
  const { rating } = req.query;
  const targetRating = Number(rating);

  if (!targetRating || targetRating < 1 || targetRating > 5) {
    throw new ApiError(400, "Please provide a valid rating between 1 and 5");
  }

  const products = await Product.aggregate([
    {
      $lookup: {
        from: "feedbacks",
        localField: "feedback",
        foreignField: "_id",
        as: "feedback",
      },
    },
    {
      $addFields: {
        avgRating: {
          $cond: {
            if: { $gt: [{ $size: "$feedback" }, 0] },
            then: { $avg: "$feedback.rating" },
            else: null,
          },
        },
      },
    },
    {
      $match: {
        avgRating: {
          $gte: targetRating - 0.5,
          $lte: targetRating + 0.5,
        },
      },
    },
  ]);

  const populatedProducts = await Product.populate(products, [
    {
      path: "feedback",
      populate: { path: "customerId", select: "name" },
      select: "customerId rating review",
    },
  ]);

  if (!populatedProducts.length) {
    throw new ApiError(404, "No products found with this rating");
  }

  return res
    .status(200)
    .json(
      new ApiResponce(200, populatedProducts, "Products found successfully")
    );
});

// Get Product By Availability
const getAllProductByAvailability = asyncHandler(async (req, res) => {
  const { isAvailable } = req.query;
  const available = isAvailable === "true";

  const products = await Product.find({ isAvailable: available }).populate({
    path: "feedback",
    populate: { path: "customerId", select: "name" },
    select: "customerId rating review",
  });

  if (products.length === 0) {
    throw new ApiError(404, "No product found with this availability");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, products, "Products found successfully"));
});

// Get All Categories
const getAllCategory = asyncHandler(async (req, res) => {
  const categories = Product.schema.path("category").enumValues;

  if (!categories || categories.length === 0) {
    throw new ApiError(404, "Categories not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, categories, "Categories found successfully"));
});

// Search Products
const getAllProductBySearch = asyncHandler(async (req, res) => {
  const { search } = req.body;

  if (!search || search.length < 2) {
    return res.json({ data: [] });
  }

  const products = await Product.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ],
  }).populate({
    path: "feedback",
    populate: { path: "customerId", select: "name" },
    select: "customerId rating review",
  });

  if (!products) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, products, "Products found successfully"));
});

export {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getProductByName,
  getProductById,
  getAllProductByCategory,
  getAllProductByPrice,
  getAllProductByRating,
  getAllProductByAvailability,
  getAllCategory,
  getAllProductBySearch,
};
