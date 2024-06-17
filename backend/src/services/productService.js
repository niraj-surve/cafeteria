import { coffeeData } from "../data/data.js";

// Get all products
export const getProducts = (req, res) => {
    res.send(coffeeData);
}

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