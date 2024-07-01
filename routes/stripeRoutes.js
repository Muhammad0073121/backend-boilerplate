var express = require("express");
const stripeController = require("../controllers/stripeController");

var router = express.Router();

router.get("/auth", stripeController.auth);

module.exports = router;
