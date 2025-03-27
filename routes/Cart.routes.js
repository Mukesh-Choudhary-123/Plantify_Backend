import express from "express";
import {
  addToCart,
  fetchCart,
  removeFromCart,
  updateCart,
} from "../controllers/Cart.controller.js";

const router = express.Router();

router.route("/:id").get(fetchCart);
router.route("/:id").post(addToCart);
router.route("/:id").put(updateCart);
router.route("/:id").delete(removeFromCart);

export default router;
