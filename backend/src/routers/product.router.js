import { Router } from "express";
import {
  getProductById,
  getProducts,  
  toggleFavourite,
} from "../services/productService.js";

const router = Router();

// Route to get all products
router.get("/", getProducts);

// Route to get a product by ID
router.get("/product/:id", getProductById);

// Route to toggle favorite status
router.post("/product/favourite", toggleFavourite);

export default router;