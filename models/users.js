const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Token } = require("../models/token");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    lastname: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 255,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "3d", // 3 days expiry time
  });
};

userSchema.methods.saveAuthToken = async function (token, userId) {
  const tokenDoc = await Token.create({
    token,
    user: userId,
  });
  return tokenDoc;
};

userSchema.methods.removeAuthToken = async function (userId) {
  const res = await Token.findOneAndDelete({ user: userId });
  return res;
};

const User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.userSchema = userSchema;
