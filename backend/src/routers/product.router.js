import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,  
  getProductsTags,  
  toggleFavourite,
  updateProduct,
} from "../services/productService.js";

const router = Router();

// Route to get all products
router.get("/", getProducts);

// Route to get all product tags
router.get("/tags", getProductsTags);

// Route to get a product by ID
router.get("/product/:id", getProductById);

// Route to add a new product
router.post("/product/add", addProduct);

// Route to update an existing product
router.patch("/product/update/:id", updateProduct);

// Route to delete an existing product
router.delete("/product/delete/:id", deleteProduct);

// Route to toggle favorite status
router.post("/product/favourite", toggleFavourite);

export default router;