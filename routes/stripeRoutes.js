var express = require("express");
const stripeController = require("../controllers/stripeController");
const auth = require("../middleware/auth");

var router = express.Router();

router.get("/auth", stripeController.auth);
router.post("/create-customer", auth, stripeController.createCustomer);

module.exports = router;
