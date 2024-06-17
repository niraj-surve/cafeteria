import { coffeeData, tags } from "../data/data.js";

// Get all products
export const getProducts = (req, res) => {
  res.send(coffeeData);
};

// Get all products tags
export const getProductsTags = (req, res) => {
  res.send(tags);
};

// Get a product by id
export const getProductById = (req, res) => {
  const { id } = req.params;
  const product = coffeeData.find((product) => product.id === id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
};

// Toggle favorite status for a product
export const toggleFavourite = (req, res) => {
  const { id, favourite } = req.body;
  const product = coffeeData.find((product) => product.id === id);
  if (product) {
    product.favourite = favourite;
    res.status(200).send(product); // Sending back updated product
  } else {
    res.status(404).send({ message: "Product not found" });
  }
};