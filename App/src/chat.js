import io from "socket.io-client";
import { updateMessage } from "redux/reducers/messagesReducer";
import first from "lodash/first";
import map from "lodash/map";

import config from "./api/config";

let socket = null;

export function emitMessage(message) {
  if (socket) {
    socket.emit("message", message);
  }
}

export default function(store) {
  socket = io.connect(config.socket_url, { reconnect: true });
  console.log("TCL: socket", socket);

  socket.on("message", data => {
    console.log("TCL: data", data);
    const storeObj = store.getState();
    const message = first(map(data.data));

    const messages = map(storeObj.messages.messages);
    const firstMessage = first(messages);
    const roomId = +firstMessage.room_id;
    if (+message.room_id === roomId) store.dispatch(updateMessage(data.data));
  });
}
