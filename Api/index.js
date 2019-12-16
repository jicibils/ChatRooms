const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");

const Login = require("./modules/login/router.js");
const Register = require("./modules/register/router.js");
const User = require("./modules/user/router.js");
const ChatRoom = require("./modules/chatRoom/router.js");
const Messages = require("./modules/messages/router.js");

const config = require("./config");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Routers
app.use("/login", Login);

app.use("/register", Register);

app.use("/user", User);

app.use("/chat-room", ChatRoom);

app.use("/messages", Messages);

// web server
app.listen(process.env.PORT || config.serverPort, () =>
  console.log(
    `\n[API-Chat-Rooms] Web server listening on port ${process.env.PORT ||
      config.serverPort}!`
  )
);
