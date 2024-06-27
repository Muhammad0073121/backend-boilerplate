const mongoose = require("mongoose");

const gOAuthSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
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

const gOAuth = mongoose.model("gOAuth", gOAuthSchema);

module.exports.gOAuth = gOAuth;
module.exports.gOAuthSchema = gOAuthSchema;
