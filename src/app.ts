import express from "express";
import { productRouter } from "./modules/product/product.router";
import { categoryRouter } from "./modules/category/category.router";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/product", productRouter);
app.use("/category", categoryRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});


export default app;