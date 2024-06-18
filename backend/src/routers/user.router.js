import { Router } from "express";
import { authenticateUser, login, register, toggleFavorite } from "../services/userService.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.put("/favorites/:productId", authenticateUser, toggleFavorite);

export default router;
