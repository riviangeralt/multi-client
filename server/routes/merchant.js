const express = require("express");
const {
  dashboard,
  createService,
  updateService,
  deleteService,
  updateOrder,
  addSocialMedia,
  getSocialMedia,
  getOrders,
  getServices,
} = require("../controllers/merchant");
const { isAuthenticated } = require("../middlewares/authenticated");
const router = express.Router();

router.route("/dashboard").get(isAuthenticated, dashboard);
router
  .route("/service")
  .post(isAuthenticated, createService)
  .get(isAuthenticated, getServices);
router
  .route("/service/:id")
  .put(isAuthenticated, updateService)
  .delete(isAuthenticated, deleteService);
router.route("/update/:id").put(isAuthenticated, updateOrder);
router.route("/add/social").post(isAuthenticated, addSocialMedia);
router.route("/socials").get(isAuthenticated, getSocialMedia);
router.route("/orders").get(isAuthenticated, getOrders);

module.exports = router;
