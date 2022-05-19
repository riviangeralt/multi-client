const express = require("express");
const { createOrder } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/authenticated");
const router = express.Router();

router.route("/order").post(isAuthenticated, createOrder);

module.exports = router;
