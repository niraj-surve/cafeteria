import { Router } from "express";
import { authenticateUser } from "../services/userService.js";
import { addOrder, cancelOrder, getOrderById, getOrders } from "../services/orderService.js";

const router = Router();

// Route to get the user's orders
router.get("/", authenticateUser, getOrders);

// Route to get an order by ID
router.get("/order/:orderId", authenticateUser, getOrderById);

// Route to add an order
router.post("/add", authenticateUser, addOrder);

// Route to cancel an order by orderId
router.delete("/cancel/:orderId", authenticateUser, cancelOrder);

export default router;