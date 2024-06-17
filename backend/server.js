import express from "express";
import cors from "cors";
import productRouter from "./src/routers/product.router.js";
import cartRouter from "./src/routers/cart.router.js";
import userRouter from "./src/routers/user.router.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/user", userRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on url: http://localhost:${PORT}`);
});
