import express from "express";
import cors from "cors";
import productRouter from "./src/routers/product.router.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use("/api/v1/products", productRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Listening on port ", PORT);
});
