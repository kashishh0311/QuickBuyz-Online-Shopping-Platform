import { Router } from "express";

import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getProductByName,
  getAllCategory,
  getAllProductBySearch,
} from "../controllers/product.controller.js";
import {
  deleteUser,
  getAllUser,
  getUserById,
} from "../controllers/user.controller.js";
import {
  updateOrderStatus,
  getOrdersByStatus,
  getOrderByUserId,
  getAllOrders,
  getAllStatus,
} from "../controllers/order.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT, verifyAdminJWT } from "../middlewares/auth.middleware.js";
import {
  loginAdmin,
  adminLogout,
  fetchAdmin,
} from "../controllers/admin.controller.js";
import { getDashboardAnalytics } from "../controllers/dashboard.controller.js";
import { getFeedback } from "../controllers/feedback.controller.js";
import {
  requestOTP,
  verifyOTP,
  resetPassword,
} from "../controllers/forgetPassword.controller.js";
const router = Router();

router
  .route("/addProduct")
  .post(verifyAdminJWT, upload.single("ProductImage"), addProduct);
router
  .route("/updateProduct")
  .put(verifyAdminJWT, upload.single("ProductImage"), updateProduct);
router.route("/deleteProduct").delete(verifyAdminJWT, deleteProduct);
router.route("/deleteUser").delete(verifyAdminJWT, deleteUser);
router.route("/getAllProduct").get(verifyAdminJWT, getAllProduct);
router.route("/getAllUser").get(verifyAdminJWT, getAllUser);
router.route("/getProductByName").post(getProductByName);
router.route("/getUserById").post(getUserById);
router.route("/updateOrderStatus").put(verifyAdminJWT, updateOrderStatus);
router
  .route("/getOrderByUserId")
  .get(verifyAdminJWT, varifyJWT, getOrderByUserId);
router.route("/getAllOrders").get(verifyAdminJWT, getAllOrders);
router.route("/getOrdersByStatus").get(verifyAdminJWT, getOrdersByStatus);
router.route("/loginAdmin").post(loginAdmin);
router.route("/getAllCategory").get(getAllCategory);
router.route("/getAllProductBySearch").post(getAllProductBySearch);
router.route("/adminLogout").post(adminLogout);
router.route("/fetchAdmin").get(verifyAdminJWT, fetchAdmin);
router.route("/getAllStatus").get(getAllStatus);
router.route("/getFeedback").get(getFeedback);
router.route("/getDashboardAnalytics").get(getDashboardAnalytics);
router.route("/requestOTP").post(requestOTP);
router.route("/verifyOTP").post(verifyOTP);
router.route("/resetPassword").post(resetPassword);
export default router;
