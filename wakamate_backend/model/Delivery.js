const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    estimatedCost: { type: Number, required: true },
    deliveryDate: { type: Date, default: Date.now },
    priority: { type: String, enum:["Low priority", "Medium priority", "High priority"], required: true },
    additionalNotes: { type: String },
});

module.exports = mongoose.model("Delivery", deliverySchema);