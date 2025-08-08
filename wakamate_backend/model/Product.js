const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    costPrice: { type:Number, required: true }, 
    sellingPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    unitsSold: { type: Number, default: 0 },
    minStock: { type: Number, default: 0 },
    sales: [
        {
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            amountMade: Number,
            date: { type: Date, default: Date.now}
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);

