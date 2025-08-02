const express = require("express");
const router = express.Router();

const { createProduct, getAllProducts, sellProduct, restockProduct, getWeeklySummary } = require("../controller/productController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect); //protect routes

router.post("/products", createProduct);
router.get("/products/getAll", getAllProducts);
router.put("/products/:id/sell", sellProduct);
router.put("/products/:id/restock", restockProduct);
router.get("/summary", getWeeklySummary);

module.exports = router;