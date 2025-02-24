import express from "express";
import {
  addToCart,
  fetchCart,
  removeFromCart,
  updateCart,
} from "../controllers/Cart.controller.js";

const router = express.Router();

router.route("/").post(addToCart);
router.route("/").put(updateCart);
router.route("/").get(fetchCart);
router.route("/").delete(removeFromCart);

export default router;
