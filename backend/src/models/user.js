import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  quantity: { type: Number, default: 1 },
});

const orderProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  products: [orderProductSchema],
  name: { type: String, required: true },
  address: { type: String, required: true },
  paymentOption: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
});

// Pre-save hook to generate a unique orderId
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = new mongoose.Types.ObjectId().toString();
  }
  next();
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  isAdmin: { type: Boolean, default: false },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cart: [cartItemSchema],
  orders: [orderSchema],
});

const User = mongoose.model("User", userSchema);

export default User;