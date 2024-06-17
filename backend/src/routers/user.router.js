import { Router } from "express";
import { login } from "../services/userService.js";

const router = Router();

router.post("/login", login);

export default router;