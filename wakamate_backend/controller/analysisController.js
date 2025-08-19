const mongoose = require("mongoose");
const Product = require("../model/Product");

// Get all profit/loss analysis
exports.getAllProfitLossAnalysis = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user._id });

        if (!products.length) {
            return res.status(404).json({ message: "No products found" });
        }

        // Breakdown per product
        const breakdown = products.map(product => {
            const unitsSold = product.sales.reduce((sum, s) => sum + (s.quantity || 0), 0);
            const revenue = product.sales.reduce((sum, s) => sum + ((s.quantity || 0) * (s.price || 0)), 0);
            const cost = product.sales.reduce((sum, s) => sum + ((s.quantity || 0) * (product.costPrice || 0)), 0);
            const profit = revenue - cost;
            const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(2) + "%" : "0%";

            return {
                product: product.name,
                unitsSold,
                revenue,
                cost,
                profit,
                margin,
                status: profit > 0 ? "Profitable" : profit < 0 ? "Loss" : "Break-even",
                stock: product.stock,
                minStock: product.minStock,
                lowStock: product.stock <= product.minStock,
            };
        });

        // Totals
        const totalRevenue = breakdown.reduce((sum, item) => sum + item.revenue, 0);
        const totalCost = breakdown.reduce((sum, item) => sum + item.cost, 0);
        const totalProfit = breakdown.reduce((sum, item) => sum + item.profit, 0);

        res.status(200).json({
            summary: {
                totalRevenue,
                totalCost,
                totalProfit,
                overallMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) + "%" : "0%"
            },
            breakdown
        });
    } catch (err) {
        console.error("Get all profit/loss analysis error:", err);
        res.status(500).json({ message: "Error fetching profit/loss analysis", error: err.message });
    }
};

// Get product profit/loss
exports.getProductProfitLoss = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findOne({
            _id: productId,
            user: req.user._id,
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const unitsSold = product.sales.reduce((sum, s) => sum + (s.quantity || 0), 0);
        const revenue = product.sales.reduce(
            (sum, s) => sum + (s.quantity || 0) * (s.price || 0),
            0
        );
        const cost = product.sales.reduce(
            (sum, s) => sum + (s.quantity || 0) * (product.costPrice || 0),
            0
        );
        const profit = revenue - cost;
        const margin = revenue > 0 ? ((profit / revenue) * 100) : 0;

        const analysis = {
            productId: product._id,
            name: product.name,
            category: product.category,
            unitsSold,
            revenue,
            cost,
            profit,
            margin: margin.toFixed(2) + "%",
            status: profit > 0 ? "Profitable" : profit < 0 ? "Loss" : "Break-even",
            stock: product.stock,
            minStock: product.minStock,
            lowStock: product.stock <= product.minStock,
        };

        res.status(200).json({ analysis });
    } catch (err) {
        console.error("Single product profit/loss error:", err);
        res.status(500).json({ message: "Error fetching product analysis", error: err.message });
    }
};

// Get monthly analysis for all products
exports.getAllProductMonthlyProfitLoss = async (req, res) => {
    try {
        const monthlyData = await Product.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
            { $unwind: { path: "$sales", preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    "sales.date": { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: {
                        productId: "$_id",
                        name: "$name",
                        month: { $month: "$sales.date" },
                        year: { $year: "$sales.date" },
                    },
                    totalRevenue: { 
                        $sum: { 
                            $multiply: [
                                { $ifNull: ["$sales.quantity", 0] },
                                { $ifNull: ["$sales.price", 0] }
                            ] 
                        } 
                    },
                    totalCost: { 
                        $sum: { 
                            $multiply: [
                                { $ifNull: ["$sales.quantity", 0] },
                                { $ifNull: ["$costPrice", 0] }
                            ] 
                        } 
                    },
                    totalUnitsSold: { $sum: { $ifNull: ["$sales.quantity", 0] } }
                },
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id.productId",
                    productName: "$_id.name",
                    month: "$_id.month",
                    year: "$_id.year",
                    totalRevenue: 1,
                    totalCost: 1,
                    totalUnitsSold: 1,
                    profit: { $subtract: ["$totalRevenue", "$totalCost"] },
                    margin: {
                        $cond: [
                            { $gt: ["$totalRevenue", 0] },
                            {
                                $concat: [
                                    {
                                        $toString: {
                                            $round: [
                                                {
                                                    $multiply: [
                                                        { 
                                                            $divide: [
                                                                { $subtract: ["$totalRevenue", "$totalCost"] }, 
                                                                "$totalRevenue"
                                                            ] 
                                                        },
                                                        100
                                                    ]
                                                },
                                                2
                                            ]
                                        }
                                    },
                                    "%"
                                ]
                            },
                            "0%"
                        ]
                    },
                },
            },
            { $sort: { year: 1, month: 1, productName: 1 } },
        ]);

        if (!monthlyData.length) {
            return res.status(404).json({ message: "No sales data found" });
        }

        res.status(200).json(monthlyData);
    } catch (err) {
        console.error("Get all monthly profit/loss error:", err);
        res.status(500).json({ message: "Error fetching monthly profit/loss analysis", error: err.message });
    }
};

// Get monthly analysis for specific product
exports.getProductMonthlyProfitLoss = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const monthlyData = await Product.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(productId),
                    user: new mongoose.Types.ObjectId(req.user._id),
                },
            },
            { $unwind: { path: "$sales", preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    "sales.date": { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: {
                        productId: "$_id",
                        name: "$name",
                        month: { $month: "$sales.date" },
                        year: { $year: "$sales.date" },
                    },
                    totalRevenue: { 
                        $sum: { 
                            $multiply: [
                                { $ifNull: ["$sales.quantity", 0] },
                                { $ifNull: ["$sales.price", 0] }
                            ] 
                        } 
                    },
                    totalCost: { 
                        $sum: { 
                            $multiply: [
                                { $ifNull: ["$sales.quantity", 0] },
                                { $ifNull: ["$costPrice", 0] }
                            ] 
                        } 
                    },
                    totalUnitsSold: { $sum: { $ifNull: ["$sales.quantity", 0] } }
                },
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id.productId",
                    productName: "$_id.name",
                    month: "$_id.month",
                    year: "$_id.year",
                    totalRevenue: 1,
                    totalCost: 1,
                    totalUnitsSold: 1,
                    profit: { $subtract: ["$totalRevenue", "$totalCost"] },
                    margin: {
                        $cond: [
                            { $gt: ["$totalRevenue", 0] },
                            {
                                $concat: [
                                    {
                                        $toString: {
                                            $round: [
                                                {
                                                    $multiply: [
                                                        { 
                                                            $divide: [
                                                                { $subtract: ["$totalRevenue", "$totalCost"] }, 
                                                                "$totalRevenue"
                                                            ] 
                                                        },
                                                        100
                                                    ]
                                                },
                                                2
                                            ]
                                        }
                                    },
                                    "%"
                                ]
                            },
                            "0%"
                        ]
                    },
                },
            },
            { $sort: { year: 1, month: 1 } },
        ]);

        if (!monthlyData.length) {
            return res.status(404).json({ message: "No sales data found for this product" });
        }

        res.status(200).json(monthlyData);
    } catch (err) {
        console.error("Get product monthly profit/loss error:", err);
        res.status(500).json({ message: "Error fetching monthly profit/loss for product", error: err.message });
    }
};