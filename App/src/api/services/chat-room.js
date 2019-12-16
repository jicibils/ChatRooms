import API from "../api";

const PREFIX = "/chat-room";

export const createChatRoom = data =>
  API.post(PREFIX + "/createChatRoom", data);

export const addParticipantToChatRoom = data =>
  API.post(PREFIX + "/addParticipantToChatRoom", data);

export const getChatRooms = () => API.get(PREFIX + "/getChatRooms");
