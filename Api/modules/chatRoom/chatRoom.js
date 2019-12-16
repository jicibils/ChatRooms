const { db } = require("../../config/db_connection");
const isEmpty = require("lodash/isEmpty");

const createChatRoom = async (req, res) => {
  try {
    const { roomName, user } = req.body;
    const results = await db.query(`SELECT * FROM rooms WHERE (name = $1)`, [
      roomName
    ]);
    if (!isEmpty(results.rows)) {
      return res.status(200).json({
        type: "chatRoomFailure",
        message: "There is already a room with this name."
      });
    }
    const values = [roomName, user.nickname, user.id, [user.id], new Date()];
    const text =
      "INSERT INTO rooms ( name, creator_name,creator_id,participants,created) VALUES ($1,$2,$3,$4,$5) RETURNING *";

    return db.query(text, values, async (err, results) => {
      if (err) {
        console.log("createChatRoomsError -> err", err);
        res.status(200).json({
          type: "chatRoomFailure",
          message: "Oops something went wrong, Try Again"
        });
      } else {
        res.status(200).json({
          type: "Success",
          message: "Chat Room created successfully!",
          chatRoom: results.rows
        });
      }
    });
  } catch (err) {
    console.log("TCL: createChatRoom -> err", err);
    res.status(200).json({
      type: "chatRoomFailure",
      message: "Oops something went wrong, Try Again"
    });
  }
};

const getChatRooms = async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM rooms");
    res.status(200).json(results.rows);
  } catch (err) {
    console.log("TCL: createChatRoom -> err", err);
    res.status(200).json({
      type: "chatRoomFailure",
      message: "Oops something went wrong, Try Again"
    });
  }
};

const addParticipantToChatRoom = async (req, res) => {
  try {
    const { roomId, newParticipantId } = req.body;
    const results = await db.query(`SELECT * FROM rooms WHERE (id = $1)`, [
      roomId
    ]);
    if (isEmpty(results.rows)) {
      return res.status(200).json({
        type: "addParticipantToChatRoomFailure",
        message: "Something went wrong fetching the room. Try again"
      });
    }
    const roomObj = results.rows[0];
    const participants = roomObj.participants;
    participants.push(newParticipantId);
    const values = [participants, roomId];
    const text = `UPDATE rooms SET participants=$1 WHERE id = $2 RETURNING *`;
    return db.query(text, values, async (err, results) => {
      if (err) {
        console.log("addParticipantToChatRoomError -> err", err);
        res.status(200).json({
          type: "addParticipantToChatRoomFailure",
          message: "Oops something went wrong, Try Again"
        });
      } else {
        res.status(200).json({
          type: "Success",
          message: "Added successfully!",
          chatRoom: results.rows
        });
      }
    });
  } catch (err) {
    console.log("TCL: addParticipantToChatRoom -> err", err);
    res.status(200).json({
      type: "chatRoomFailure",
      message: "Oops something went wrong, Try Again"
    });
  }
};

module.exports = {
  createChatRoom,
  getChatRooms,
  addParticipantToChatRoom
};
