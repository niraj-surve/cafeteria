// routes/cart.router.js

import { Router } from "express";
import {
  getCartItems,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../services/cartService.js";

const router = Router();

// Route to get all cart items
router.get("/", getCartItems);

// Route to add an item to the cart
router.post("/add", addToCart);

// Route to update item quantity in the cart
router.put("/update", updateQuantity);

// Route to remove an item from the cart
router.delete("/remove", removeFromCart);

// Route to clear the cart
router.delete("/clear", clearCart);

export default router;