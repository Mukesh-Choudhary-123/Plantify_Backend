import express from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  fetchAllProduct,
  fetchProductByID,
  fetchProductBySellerID,
} from "../controllers/Product.controller.js";
import sellerAuthenticated from "../middlewares/SellerAuth.js";
import userAuthenticated from "../middlewares/UserAuth.js";

const router = express.Router();

router.route("/").get( userAuthenticated ,fetchAllProduct).post( sellerAuthenticated , createProduct);
router
  .route("/:id")
  .get(fetchProductByID)
  .put(editProduct)
  .delete(deleteProduct);
router.route("/:sellerId").get(fetchProductBySellerID);

export default router;
