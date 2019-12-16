var express = require("express");
var router = express.Router();
var _chatRoom = require("./chatRoom.js");

// Create Chat Room
router.post("/createChatRoom", _chatRoom.createChatRoom);

//Add Participant To Chat Room
router.post("/addParticipantToChatRoom", _chatRoom.addParticipantToChatRoom);

// Create Chat Room
router.get("/getChatRooms", _chatRoom.getChatRooms);

module.exports = router;
