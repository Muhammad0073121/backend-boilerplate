var express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
var router = express.Router();

router.put("/change-password", auth, userController.changePassword);
router.put("/edit", auth, userController.edit);
router.get("/get-user/:id", userController.userDetail);

module.exports = router;
