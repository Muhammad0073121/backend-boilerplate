const mongoose = require("mongoose");

const stripeAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const stripeAccount = mongoose.model("stripeAccount", stripeAccountSchema);

module.exports.stripeAccount = stripeAccount;
module.exports.stripeAccountSchema = stripeAccountSchema;
