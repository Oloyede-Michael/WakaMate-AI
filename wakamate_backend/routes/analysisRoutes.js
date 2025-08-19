const express = require("express");
const router = express.Router();
const { getAllProfitLossAnalysis, getProductProfitLoss, getAllProductMonthlyProfitLoss, getProductMonthlyProfitLoss } = require("../controller/analysisController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

//all products
router.get("/analysis", getAllProfitLossAnalysis);

//single product
router.get("/analysis/:productId", getProductProfitLoss);

//monthly
router.get("/monthly", getAllProductMonthlyProfitLoss);

//per product monthly
router.get("/monthly/:productId", getProductMonthlyProfitLoss)
module.exports = router;