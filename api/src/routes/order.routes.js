const express = require("express")
const Order = require('../models/Order.js')
const { getOrders, ordenes, getIncome, getWeek, lastOrders, statusOrder } = require("../controllers/order.controller.js")

const router = express.Router();

const { isAdmin, verifyToken } = require("../middlewares/auth.middleware")

//router.get("/order", isAdmin, getStats)

router.get("/", lastOrders)
router.get("/ordenes", ordenes)
router.get("/stats", [verifyToken, isAdmin], getOrders)
router.get("/income/stats", getIncome)
router.get("/week-sales", getWeek)
router.put("/:id", [verifyToken, isAdmin], statusOrder)


router.get("/findOne/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        

        res.status(200).send(order)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;