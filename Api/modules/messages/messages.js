const { db } = require("../../config/db_connection");
const isEmpty = require("lodash/isEmpty");

const createMessage = async (req, res) => {
  try {
    const { roomId, user, message } = req.body;
    const values = [roomId, user.nickname, user.id, message, new Date()];
    const text =
      "INSERT INTO messages ( room_id, sender_name,sender_id,message,created) VALUES ($1,$2,$3,$4,$5) RETURNING *";
    return db.query(text, values, async (err, results) => {
      if (err) {
        console.log("createMessage -> err", err);
        res.status(200).json({
          type: "chatRoomFailure",
          message: "Oops something went wrong, Try Again"
        });
      } else {
        res.status(200).json({
          type: "Success",
          message: results.rows
        });
      }
    });
  } catch (err) {
    console.log("TCL: createMessage -> err", err);
    res.status(200).json({
      type: "chatRoomFailure",
      message: "Oops something went wrong, Try Again"
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { roomId } = req.body;
    const results = await db.query(
      "SELECT * FROM messages WHERE room_id = $1",
      [roomId]
    );
    res.status(200).json(results.rows);
  } catch (err) {
    console.log("TCL: getMessages -> err", err);
    res.status(200).json({
      type: "chatRoomFailure",
      message: "Oops something went wrong, Try Again"
    });
  }
};

const callBot = async (req, res) => {
  try {
    const { roomId, user, message } = req.body;
    // TODO: Get the csv param, parse it and return the real answer
    const botMessage = {
      id: -1,
      room_id: roomId,
      sender_name: "RabbitMQ",
      sender_id: -1,
      message: "APPL.US quote is $93.42 per share",
      created: new Date()
    };
    res.status(200).json({
      type: "Success",
      message: [botMessage]
    });
  } catch (err) {
    console.log("TCL: callBot -> err", err);
    res.status(200).json({
      type: "callBotFailure",
      message: "Oops something went wrong, Try Again"
    });
  }
};
module.exports = {
  createMessage,
  getMessages,
  callBot
};
