import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgetPassword,
  getUserDetails,
  updateUserDetails,
  deleteUserAccount,
  changePassword,
  refreshToken,
} from "../controllers/user.controller.js";
import {
  addToCart,
  getCart,
  // removeFromCart,
  clearCart,
  updateQuantity,
  productExistsInCart,
} from "../controllers/cart.controller.js";
import {
  createOrder,
  deleteOrder,
  getOrderByUserId,
  getOrderById,
  updateOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import {
  getAllProduct,
  getAllProductBySearch,
  getProductById,
  getAllCategory,
  getAllProductByCategory,
  getAllProductByPrice,
  getAllProductByRating,
  getAllProductByAvailability,
  getProductByName,
} from "../controllers/product.controller.js";
import {
  createStripeCheckoutSession,
  verifyStripePayment,
  getPaymentByOrderId,
  updatePaymentMethod,
  verifyCashOnDeliveryPayment,
} from "../controllers/payment.controller.js";
import { createFeedback } from "../controllers/feedback.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import {
  requestOTP,
  verifyOTP,
  resetPassword,
} from "../controllers/forgetPassword.controller.js";

const router = Router();

router.route("/register").post(upload.single("profileImage"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(varifyJWT, logoutUser);
router.route("/forgetPassword").post(forgetPassword); //baki
router.route("/getUserDetails").get(varifyJWT, getUserDetails);
router
  .route("/updateUserDetails")
  .put(varifyJWT, upload.single("profileImage"), updateUserDetails);
router.route("/deleteUserAccount").delete(varifyJWT, deleteUserAccount); //baki
router.route("/addToCart").post(varifyJWT, addToCart);
router.route("/getCart").get(varifyJWT, getCart);
// router.route("/removeFromCart").delete(varifyJWT, removeFromCart);
router.route("/clearCart").delete(varifyJWT, clearCart);
router.route("/updateQuantity").put(varifyJWT, updateQuantity);
router.route("/productExistsInCart").get(varifyJWT, productExistsInCart);
router.route("/createOrder").post(varifyJWT, createOrder);
router.route("/deleteOrder").delete(varifyJWT, deleteOrder);
router.route("/getOrderByUserId").get(varifyJWT, getOrderByUserId);
router.route("/createFeedback").post(varifyJWT, createFeedback);
router.route("/getAllProduct").get(getAllProduct);
router.route("/getAllProductBySearch").post(getAllProductBySearch);
router.route("/getOrderById").post(varifyJWT, getOrderById);
router.route("/updateOrder").put(varifyJWT, updateOrder);
router.route("/getProductById/:id").get(getProductById);
router.route("/getAllCategory").get(getAllCategory);
router.route("/getAllProductByCategory").get(getAllProductByCategory);
router.route("/getAllProductByPrice").get(getAllProductByPrice);
router.route("/getAllProductByRating").get(getAllProductByRating);
router.route("/getAllProductByAvailability").get(getAllProductByAvailability);
router.route("/getProductByName").get(getProductByName);
router.route("/changePassword").post(changePassword);
router.route("/refreshToken").post(refreshToken);
router
  .route("/createStripeCheckoutSession")
  .post(varifyJWT, createStripeCheckoutSession);
router.route("/verifyStripePayment").post(varifyJWT, verifyStripePayment);
router.route("/getPaymentByOrderId").post(varifyJWT, getPaymentByOrderId);
router.route("/updatePaymentMethod").put(varifyJWT, updatePaymentMethod);
router
  .route("/verifyCashOnDeliveryPayment")
  .post(varifyJWT, verifyCashOnDeliveryPayment);

router.route("/updateOrderStatus").put(varifyJWT, updateOrderStatus);
router.route("/requestOTP").post(requestOTP);
router.route("/verifyOTP").post(verifyOTP);
router.route("/resetPassword").post(resetPassword);

export default router;
