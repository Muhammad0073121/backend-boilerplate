var express = require("express");
const auth = require("../middleware/auth");
const eventController = require("../controllers/eventController");
var router = express.Router();

router.post("/add-event", auth, eventController.addEvent);
router.get("/events", auth, eventController.getAllEvents);

module.exports = router;
