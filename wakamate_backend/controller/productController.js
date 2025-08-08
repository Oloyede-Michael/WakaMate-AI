const Product = require("../model/Product");
const { checkStockAlert } = require("../utils/stockNotifier");

//add a product
exports.createProduct = async (req, res) => {
    try {
        const { name, category, costPrice, sellingPrice, stock = 0, minStock = 0 } = req.body;
        const product = new Product({ name, category, costPrice, sellingPrice, stock, minStock, user: req.user._id });
        await product.save();
        res.status(201).json({ message: "Product created", product})
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

//get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user._id });
        const withStockAlert = products.map(prod => ({ ...prod._doc, lowStock: checkStockAlert(prod) }));
        res.status(200).json(withStockAlert);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

//sell a product
exports.sellProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const product = await Product.findOne({ _id: id, user: req.user._id });
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        const totalAmount = quantity * product.sellingPrice;
        product.stock -= quantity;
        product.unitsSold += quantity;

        product.sales.push({
            quantity,
            price: product.sellingPrice,
            amountMade: totalAmount,
        });
        await product.save();

        res.status(200).json({
            message: "Sale recorded",
            product,
            lowStock: checkStockAlert(product)
        });
    } catch (err) {
        console.error("Sell error:", err)
        res.status(500).json({ error: "Sale error" });
    }
};

//restock 
exports.restockProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, costPrice } = req.body;

        const product = await Product.findOne({ _id: id, user: req.user._id });
        if (!product) 
            return res.status(404).json({ message: "Product not found" });

        product.stock += quantity;
        //optionally update cost price
        if (costPrice && costPrice > 0) {
            product.costPrice = costPrice
        }
        await product.save();
        res.status(200).json({ message: "Product restocked", product });
    } catch (err) {
        console.error("Restock error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getWeeklySummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date();
    endOfWeek.setHours(23, 59, 59, 999);

    const products = await Product.find({ user: req.user._id });

    const summary = products.map(product => {
      const weeklySales = product.sales.filter(sale =>
        new Date(sale.date) >= startOfWeek && new Date(sale.date) <= endOfWeek
      );

      const totalSoldThisWeek = weeklySales.reduce((sum, sale) => sum + sale.quantity, 0);
      const totalRevenueThisWeek = weeklySales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);

      return {
        name: product.name,
        unitsSoldThisWeek: totalSoldThisWeek,
        totalRevenueThisWeek: totalRevenueThisWeek,
        sellingPrice: product.sellingPrice,
        currentStock: product.stock,
        minStock: product.minStock,
        lowStock: product.stock <= product.minStock,
        user: req.user._id
      };
    });

    res.status(200).json({
      week: `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`,
      summary
    });
  } catch (err) {
    res.status(500).json({ error: "Error generating weekly summary" });
  }
};
