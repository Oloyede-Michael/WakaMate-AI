const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    costPrice: { type:Number, required: true }, 
    stock: { type: Number, default: 0 },
    unitsSold: { type: Number, default: 0 },
    minStock: { type: Number, default: 0 },
    sales: [
        {
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            date: { type: Date, default: Date.now}
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);

