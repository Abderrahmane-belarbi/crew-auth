import express from "express";
import { forgotPassword, login, logout, resetPassword, signup, verificationEmail } from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verification-email", verificationEmail)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;