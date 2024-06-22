import { Router } from "express";
import {
  authenticateUser,
  forgotPassword,
  login,
  register,
  resetPassword,
  toggleFavorite,
  updateProfile,
} from "../services/userService.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/profile/update", authenticateUser, updateProfile);
router.put("/favorites/:productId", authenticateUser, toggleFavorite);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
