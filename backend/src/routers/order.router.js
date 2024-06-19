import { Router } from "express";
import { authenticateUser } from "../services/userService.js";
import { addOrder, cancelOrder, getOrders } from "../services/orderService.js";

const router = Router();

// Route to get the user's orders
router.get("/", authenticateUser, getOrders);

// Route to add an order
router.post("/add", authenticateUser, addOrder);

// Route to cancel an order by orderId
router.delete("/cancel/:orderId", authenticateUser, cancelOrder);

export default router;