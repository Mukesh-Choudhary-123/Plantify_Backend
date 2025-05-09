import express from "express";
import { login, logout, signup } from "../controllers/Seller.controller.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;
