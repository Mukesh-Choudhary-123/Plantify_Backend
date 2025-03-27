import express from "express";
import { login, logout, signup, updateUser } from "../controllers/User.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/:id",updateUser)
router.post("/logout", logout); 

export default router;
