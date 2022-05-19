const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Service name already exists"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Service", servicesSchema);
