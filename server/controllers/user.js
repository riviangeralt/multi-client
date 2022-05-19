const User = require("../models/user");
const Merchant = require("../models/merchant");
const Service = require("../models/services");
const Order = require("../models/order");
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

exports.createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let allServices = [];
    for (let i = 0; i < req.body.services.length; i++) {
      let service = await Service.findById(req.body.services[i]).populate(
        "merchant"
      );
      allServices.push(service);
    }
    //now checking if all the services are of same merchant
    let merchant = allServices[0].merchant;
    for (let i = 1; i < allServices.length; i++) {
      if (allServices[i].merchant.id !== merchant.id) {
        return res.status(400).json({
          message: "You can only have services of same merchant",
          status: "error",
        });
      }
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "error",
      });
    }
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    var options = {
      amount: req.body.amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: uuidv4(),
    };
    for (let i = 0; i < allServices.length; i++) {
      options.amount = allServices[i].price * 100;
      options.receipt = uuidv4();
      options.currency = "INR";
      options.notes = {
        merchant: allServices[i].merchant._id,
        service: allServices[i]._id,
      };
      instance.orders.create(options, async function (err, order) {
        if (err) {
          return res.status(500).json({
            message: err.message,
            status: "error",
          });
        }
        //creating order in db
        const orderData = {
          amount: order.amount,
          receipt: order.receipt,
          user: user._id,
          merchant: allServices[i].merchant._id,
          services: req.body.services,
        };
        const createdOrder = await Order.create(orderData);
        user.servicesBooked.push(createdOrder._id);
        allServices[i].merchant.orders.push(createdOrder._id);
        await user.save();
        await allServices[i].merchant.save();
        await allServices[i].save();
      });
      //sending mail to merchant
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: allServices[i].merchant.email,
        subject: "YooHoo! A new order has been placed",
        text: `Hi ${allServices[i].merchant.name}, you have received a new order.
        Someone has booked your service. Please login to your account to view the order.`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return res.status(201).json({
        message: "Order created",
        status: "success",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};
