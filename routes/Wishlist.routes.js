import express from "express";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "../controllers/Wishlist.controller.js";

const router = express.Router();

router.route("/").post(addToWishlist);
router.route("/").delete(removeFromWishlist);
router.route("/").get(fetchWishlist);

export default router;
