import { tags } from "../data/data.js";
import Product from "../models/product.js";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch products", error: error.message });
  }
};

// Get all products tags (assuming static data)
export const getProductsTags = (req, res) => { 
  res.send(tags);
};

// Get a product by id
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch product", error: error.message });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  const productData = req.body;
  try {
    // Check if product already exists by name
    const existingProduct = await Product.findOne({ name: productData.name });
    if (existingProduct) {
      return res.status(400).send({ message: "Product already exists" });
    }

    const newProduct = await Product.create(productData);
    res.status(201).send(newProduct);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Failed to create product", error: error.message });
  }
};

// Update a product by id
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const productData = req.body;
  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
      new: true,
    });
    res.send(updatedProduct);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Failed to update product", error: error.message });
  }
};

// Delete a product by id
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);
    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Failed to delete product", error: error.message });
  }
};