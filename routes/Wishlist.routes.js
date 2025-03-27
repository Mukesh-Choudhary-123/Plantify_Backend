import express from "express";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "../controllers/Wishlist.controller.js";

const router = express.Router();

router.route("/:id").post(addToWishlist);
router.route("/:id").delete(removeFromWishlist);
router.route("/:id").get(fetchWishlist);

export default router;
