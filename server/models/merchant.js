const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    phone: {
      type: String,
      required: [true, "Please add a phone number"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    // payment: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Payment",
    // },
    type: {
      default: "merchant",
      type: String,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    social: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Social",
      },
    ],
    provider: {
      type: String,
      default: "self",
      enum: ["self", "google.com"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Merchant", merchantSchema);
