import express from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  fetchAllProduct,
  fetchAllProductByCategory,
  fetchProductByID,
  fetchProductBySellerID,
} from "../controllers/Product.controller.js";
import sellerAuthenticated from "../middlewares/SellerAuth.js";
import userAuthenticated from "../middlewares/UserAuth.js";

const router = express.Router();

router.route("/").get(fetchAllProduct).post(createProduct);
router.route("/category").get(fetchAllProductByCategory)
router
  .route("/:id")
  .get(fetchProductByID)
  .put(editProduct)
  .delete(deleteProduct);
router.route("/seller/:sellerId").get(fetchProductBySellerID);

export default router;
