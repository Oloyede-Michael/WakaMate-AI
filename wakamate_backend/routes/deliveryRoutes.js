const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createDelivery, getDeliveryById, updateDelivery, deleteDelivery, getAllDeliveries } = require("../controller/deliveryController");

router.use(protect);

//create new delivery
router.post("/deliveries", createDelivery);

//getalldeliveries
router.get("/getdeliveries", getAllDeliveries);

//getsingledelivery
router.get("/deliveries/:id", getDeliveryById);

//update delivery
router.put("/updeliveries/:id", updateDelivery);

//delete delivery
router.delete("/deletedeliveries/:id", deleteDelivery);

module.exports = router;