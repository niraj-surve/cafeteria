import { Router } from "express";
import { authenticateUser, login, register, toggleFavorite, updateProfile } from "../services/userService.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/profile/update", authenticateUser, updateProfile);
router.put("/favorites/:productId", authenticateUser, toggleFavorite);

export default router;
