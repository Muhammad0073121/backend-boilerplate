var express = require("express");
const gOAuthController = require("../controllers/googleOAuthController");
var router = express.Router();

router.get("/auth", gOAuthController.auth);
router.get("/auth/callback", gOAuthController.callback);

module.exports = router;
