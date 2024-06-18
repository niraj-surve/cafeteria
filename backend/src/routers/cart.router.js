import { Router } from "express";
import { authenticateUser } from "../services/userService.js";
import { getCartItems, addToCart, removeFromCart, decreaseQuantity, increaseQuantity } from "../services/cartService.js";

const router = Router();

// Route to get the user's cart
router.get("/", authenticateUser, getCartItems);

// Route to add a product to the user's cart
router.post("/add", authenticateUser, addToCart);

// Route to remove a product from the user's cart
router.delete("/remove/:productId", authenticateUser, removeFromCart);

// Route to increase quantity of a product in the user's cart by 1
router.patch("/increase/:productId", authenticateUser, increaseQuantity);

// Route to decrease quantity of a product in the user's cart by 1
router.patch("/decrease/:productId", authenticateUser, decreaseQuantity);


export default router;