import express from "express";
import {
  createOrder,
  fetchOrderBySellerId,
  fetchOrderByUserId,
  updateOrder,
} from "../controllers/Order.controller.js";

const router = express.Router();

router.route("/:id").post(createOrder);

router.route("/:orderId").put(updateOrder);

router.route("/user/:userId").get(fetchOrderByUserId);

router.route("/seller/:sellerId").get(fetchOrderBySellerId);

export default router;
