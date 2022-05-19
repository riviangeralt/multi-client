const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema(
  {
    socialName: {
      type: String,
      required: [true, "Please add a social name"],
    },
    socialLink: {
      type: String,
      required: [true, "Please add a social link"],
    },
    slug: {
      type: String,
      required: [true, "Please add a slug"],
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Social", socialSchema);
