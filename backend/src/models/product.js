import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cookTime: { type: Number, required: true },
  price: { type: Number, required: true },
  favourite: { type: Boolean, required: true },
  origins: { type: [String], required: true },
  stars: { type: Number, required: true },
  image: { type: String, required: true },
  tags: { type: [String], required: true },
  description: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

export default Product;