const express = require("express");
const router = express.Router();

const { createProduct, getAllProducts, sellProduct, restockProduct, getWeeklySummary } = require("../controller/productController");

router.post("/products", createProduct);
router.get("/products/getAll", getAllProducts);
router.put("/products/:id/sell", sellProduct);
router.put("/products/:id/restock", restockProduct);
router.get("/summary", getWeeklySummary);

module.exports = router;