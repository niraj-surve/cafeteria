import { Router } from "express";
import { authenticateUser } from "../services/userService.js";
import { createPaymentSession, validatePayment } from "../services/paymentService.js";

const router = Router();

// Route to create session for payment
router.post("/session/create", authenticateUser, createPaymentSession);

// Route to validating the payment
router.post("/:merchantTransactionId", validatePayment)


export default router;
