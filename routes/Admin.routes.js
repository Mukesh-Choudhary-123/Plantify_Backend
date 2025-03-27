import express from "express";
import { fetchAllSeller, login, logout, signup, updateSeller } from "../controllers/Admin.controller.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/seller").get(fetchAllSeller)
router.route("/:id").put(updateSeller)

export default router;
