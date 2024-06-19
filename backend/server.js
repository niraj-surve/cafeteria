import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import productRouter from "./src/routers/product.router.js";
import cartRouter from "./src/routers/cart.router.js";
import orderRouter from "./src/routers/order.router.js";
import userRouter from "./src/routers/user.router.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

// MongoDB connection setup
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/user", userRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on url: http://localhost:${PORT}`);
});