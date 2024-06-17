import { Router } from "express";
import { getProductById, getProducts } from "../services/productService.js";

const router = Router();

// Route to get all products
router.get("/", getProducts);

// Route to get a product by ID
router.get("/product/:id", getProductById);

export default router;