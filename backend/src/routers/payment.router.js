import { Router } from "express";
import { authenticateUser } from "../services/userService.js";
import { getSessionKey, verifySessionKey } from "../services/paymentService.js";

const router = Router();

// Route to get a session key for payments
router.post("/get-sessionKey", authenticateUser, getSessionKey);

// Route to verify session key for payments
router.post("/session/verify", authenticateUser, verifySessionKey);

export default router;
