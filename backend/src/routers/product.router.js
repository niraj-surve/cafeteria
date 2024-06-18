import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,  
  getProductsTags,  
  updateProduct,
} from "../services/productService.js";
import { authenticateAdmin } from "../services/userService.js";

const router = Router();

// Route to get all products
router.get("/", getProducts);

// Route to get all product tags
router.get("/tags", getProductsTags);

// Route to get a product by ID
router.get("/product/:id", getProductById);

// Route to add a new product
router.post("/product/add", authenticateAdmin, addProduct);

// Route to update an existing product
router.patch("/product/update/:id", authenticateAdmin, updateProduct);

// Route to delete an existing product
router.delete("/product/delete/:id", authenticateAdmin, deleteProduct);

export default router;