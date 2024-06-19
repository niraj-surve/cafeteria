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
  orderId: { type: String },
  products: [orderProductSchema],
  name: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "pending" },
  paymentOption: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
});

// Pre-save hook to generate a unique orderId
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = mongoose.Types.ObjectId().toString();
  }
  next();
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cart: [cartItemSchema],
  orders: [orderSchema],
});

const User = mongoose.model("User", userSchema);

export default User;