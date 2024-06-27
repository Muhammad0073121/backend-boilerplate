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

const googleOAuthUser = mongoose.model("googleOAuthUser", gOAuthSchema);

module.exports.googleOAuthUser = googleOAuthUser;
module.exports.gOAuthSchema = gOAuthSchema;
