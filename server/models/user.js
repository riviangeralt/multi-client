const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
    servicesBooked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    type: {
      default: "user",
      type: String,
    },
    isVerified: {
      default: false,
      type: Boolean,
    },
    provider: {
      type: String,
      default: "self",
      enum: ["self", "google.com"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
