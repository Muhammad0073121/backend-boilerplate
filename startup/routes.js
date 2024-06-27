const morgan = require("morgan");
const express = require("express");

const auth = require("../routes/authRoutes");
const user = require("../routes/usersRoutes");
const gOAuth = require("../routes/googleOAuthRoutes");

module.exports = function (app) {
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use("/api/auth", auth);
  app.use("/api/users", user);
  app.use("/api/gOAuth", gOAuth);
};
