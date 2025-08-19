const Delivery = require("../model/Delivery");

//create new delivery
exports.createDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.create(req.body);
        res.status(201).json({
            success: true,
            message: "Delivery created sucessfully",
            data: delivery,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

//get deliveries
exports.getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find();
        res.status(200).json({ success: true, data: deliveries });
    } catch (err) {
        res.status(500).json({ sucess: false, error: err.message });
    }
};

//get single delivery by id
exports.getDeliveryById = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) {
            return res.status(404).json({ success: false, message: "Delvery not found" });
        } 
        res.status(200).json({ success: true, data: delivery });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

//update delivery 
exports.updateDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!delivery) {
            return res.status(404).json({ success: false, message: "Delivery not found"});
        }
        res.status(200).json({ success: true, message: "Delivery updated sucessfully", data: delivery });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

//delete a delivery
exports.deleteDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndDelete(req.params.id);
        if (!delivery) {
            return res.status(404).json({ success: false, message: "Delivery not found" });
        }
        res.status(200).json({ success: true, message: "Delivery deleted sucessfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};