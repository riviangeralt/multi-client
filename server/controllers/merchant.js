const Merchant = require("../models/merchant");
const Order = require("../models/order");
const Service = require("../models/services");
const Social = require("../models/social");
const { errorHandler } = require("../helpers/errors.js");

exports.dashboard = async (req, res) => {
  try {
    // sending total earnings in current month, total order, total services, orders according to status
    //total earnings will be calculated by summing up all the orders which are accepted in the current month
    const totalEarnings = await Order.find({
      merchant: req.user.id,
      status: "accepted",
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
    }).then((orders) => {
      return orders.reduce((acc, order) => {
        return acc + order.amount;
      }, 0);
    });

    const totalServices = await Merchant.findById(req.user.id).then(
      (merchant) => {
        return merchant.services ? merchant.services.length : 0;
      }
    );
    const pendingOrders = await Order.find({
      merchant: req.user.id,
      status: "pending",
    }).then((orders) => {
      return orders.length;
    });
    const acceptedOrders = await Order.find({
      merchant: req.user.id,
      status: "accepted",
    }).then((orders) => {
      return orders.length;
    });
    const rejectedOrders = await Order.find({
      merchant: req.user.id,
      status: "rejected",
    }).then((orders) => {
      return orders.length;
    });

    res.status(200).json({
      message: "Merchant dashboard",
      status: "success",
      data: {
        totalEarnings,
        totalServices,
        pendingOrders,
        acceptedOrders,
        rejectedOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.createService = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.user.id);
    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found",
        status: "error",
      });
    }
    const service = await Service.create({
      ...req.body,
      merchant: req.user.id,
    });
    merchant.services.push(service._id);
    merchant.save();
    res.status(201).json({
      message: "Service created successfully",
      status: "success",
      data: {
        service,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: errorHandler(error),
      status: "error",
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.user.id);
    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found",
        status: "error",
      });
    }
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (merchant._id.toString() !== service.merchant.toString()) {
      return res.status(404).json({
        message: "Service not found",
        status: "error",
      });
    }
    res.status(200).json({
      message: "Service updated successfully",
      status: "success",
      data: {
        service,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.user.id);
    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found",
        status: "error",
      });
    }
    const service = await Service.findById(req.params.id);
    if (merchant._id.toString() !== service.merchant.toString()) {
      return res.status(404).json({
        message: "Service not found",
        status: "error",
      });
    }
    const index = merchant.services.indexOf(service.id);
    merchant.services.splice(index, 1);
    await merchant.save();
    await service.remove();
    res.status(200).json({
      message: "Service deleted successfully",
      status: "success",
      data: {
        service,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ merchant: req.user.id }).select(
      "-merchant"
    );
    if (!services) {
      return res.status(404).json({
        message: "Services not found",
        status: "error",
      });
    }
    res.status(200).json({
      message: "Services fetched successfully",
      status: "success",
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: "error",
      });
    }
    const merchant = await Merchant.findById(req.user.id);
    if (merchant._id.toString() !== order.merchant.toString()) {
      return res.status(404).json({
        message: "Order not found",
        status: "error",
      });
    }
    order.status = req.body.status;
    await order.save();
    res.status(200).json({
      message: "Order updated successfully",
      status: "success",
      data: {
        order,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.addSocialMedia = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.user.id).populate("social");
    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found",
        status: "error",
      });
    }
    const socialMedia = await Social.create({
      ...req.body,
      merchant: req.user.id,
    });
    await merchant.social.push(socialMedia._id);
    await merchant.save();
    const socials = await Social.find({ merchant: req.user.id });
    res.status(201).json({
      message: "Social media added successfully",
      status: "success",
      data: socials,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.getSocialMedia = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.user.id).populate("social");
    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found",
        status: "error",
      });
    }
    res.status(200).json({
      message: "Social media found",
      status: "success",
      data: merchant.social,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Merchant.findById(req.user.id)
      .populate({
        path: "orders",
        populate: {
          path: "services",
          select: "name price description",
        },
      })
      .populate({
        path: "orders",
        populate: {
          path: "user",
          select: "name email",
        },
      });

    if (!orders) {
      return res.status(404).json({
        message: "Orders not found",
        status: "error",
      });
    }
    res.status(200).json({
      message: "Orders found",
      status: "success",
      data: orders.orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};
