import { REHYDRATE } from "redux-persist";
import get from "lodash/get";

const LOAD = "messages/LOAD";
const UPDATE = "messages/UPDATE";
const REQUEST_ERROR = "messages/REQUEST_ERROR";
const REQUEST = "messages/REQUEST";

const initialState = {
  messages: {},
  errorMessage: "",
  isFetching: false
};

const RoomsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        messages: get(action, "payload.messages", [])
      };
    case REQUEST:
      return { ...state, isFetching: true };
    case LOAD:
      return {
        ...state,
        messages: action.payload.messages,
        isFetching: false
      };
    case UPDATE:
      return {
        ...state,
        messages: { ...state.messages, ...action.payload.message },
        isFetching: false
      };
    case REQUEST_ERROR:
      return {
        ...state,
        errorMessage: action.payload.error,
        isFetching: false
      };
    default:
      return state;
  }
};

const load = messages => ({
  type: LOAD,
  payload: {
    messages
  }
});

const update = message => ({
  type: UPDATE,
  payload: {
    message
  }
});

const request = () => ({
  type: REQUEST
});

const requestError = error => ({
  type: REQUEST_ERROR,
  payload: {
    error
  }
});

export const updateMessagesReducer = (message = {}) => dispatch => {
  dispatch(update(message));
};

export const loadMessagesReducer = (messages = {}) => dispatch => {
  dispatch(load(messages));
};

export default RoomsReducer;
