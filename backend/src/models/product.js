import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  cookTime: Number,
  price: Number,
  favourite: Boolean,
  origins: [String],
  stars: Number,
  image: String,
  tags: [String],
  description: String,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
