const express = require("express");

module.exports = function (app) {
  app.use("/public/", express.static("public/"));
};
