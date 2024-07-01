const mongoose = require("mongoose");

const gOAuthSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
