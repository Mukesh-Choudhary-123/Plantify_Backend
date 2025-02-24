import express from "express";
import {
  createOrder,
  fetchOrderBySellerId,
  fetchOrderByUserId,
  updateOrder,
} from "../controllers/Order.controller.js";

const router = express.Router();

router.route("/").post(createOrder);
router.route("/").put(updateOrder);
router.route("/").get(fetchOrderBySellerId);
router.route("/").get(fetchOrderByUserId);

export default router;
