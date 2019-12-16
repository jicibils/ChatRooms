import API from "../api";

const PREFIX = "/messages";

export const createMessage = data => API.post(PREFIX + "/createMessage", data);

export const getMessages = data => API.post(PREFIX + "/getMessages", data);
