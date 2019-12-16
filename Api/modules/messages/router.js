var express = require("express");
var router = express.Router();
var _messages = require("./messages.js");

// Create Message
router.post("/createMessage", _messages.createMessage);

//Add Participant To Chat Room
router.post("/getMessages", _messages.getMessages);

module.exports = router;
