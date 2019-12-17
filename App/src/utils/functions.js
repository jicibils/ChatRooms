// Helper utility functions
import owasp from "owasp-password-strength-test";
import get from "lodash/get";
import capitalize from "lodash/capitalize";
import some from "lodash/some";

import size from "lodash/size";

function queueSetState(component, fields, callback) {
  // Usage: queueSetState(this, {myState})
  if (!component || !component.setState) {
    throw new Error("queueSetState requires a react component as first param");
  }

  return component.setState(updateState(fields), callback);
}

function updateState(fields) {
  // Use for a setState function such as this.setState(updateState({myState}));
  return (state, props) => fields;
}

function isAPassword(password = "") {
  const owaspPaswordValidation = owasp.test(password);
  return owaspPaswordValidation.errors && owaspPaswordValidation.errors.length
    ? () => owaspPaswordValidation.errors
    : null;
}

const FirstElementOfAnObject = obj => obj[Object.keys(obj)[0]];

const getUserLetter = userData => {
  if (!userData) return " - ";
  return (
    capitalize(get(userData, "nickname.0", "")) + get(userData, "nickname.1")
  );
};

const getCreatorStr = (userId, room) => {
  const isOwner = getIsOwner(userId, room);
  return `Created by ${isOwner ? "you" : `${room.creator_name}`}`;
};

const getIsOwner = (userId, room) => {
  return +userId === +room.creator_id;
};

const getIsParticipant = (userId, room) => {
  return some(room.participants, participant => participant === userId);
};

const getIsAuthor = (userId, message) => {
  return +userId === +message.sender_id;
};

const getParticipantsStr = room => {
  return `Participants: ${size(room.participants)}`;
};

export {
  queueSetState,
  updateState,
  isAPassword,
  FirstElementOfAnObject,
  getUserLetter,
  getCreatorStr,
  getIsOwner,
  getIsParticipant,
  getIsAuthor,
  getParticipantsStr
};
