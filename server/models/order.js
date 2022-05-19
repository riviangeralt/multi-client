const mongoose = require("mongoose");

//an order is request of service to merchant, which he can accept or reject, and the order will have amount
//that is the price of the service, this will be added to user's servicesbooked array and merchants order array
//an order can have multiple services of same merchant
const orderSchema = new mongoose.Schema(
  {
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    merchant: {
      //merchant whos service is requested
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
    },
    user: {
      //user who requested service
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
