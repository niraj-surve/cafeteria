import { Router } from "express";
import { authenticateUser } from "../services/userService.js";

const router = Router();

// Route to get a session key for payments
// router.post("/get-sessionKey", authenticateUser, getSessionKey);

export default router;
