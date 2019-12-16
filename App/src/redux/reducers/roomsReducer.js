import { REHYDRATE } from "redux-persist";
import get from "lodash/get";

const UPDATE = "rooms/UPDATE";
const REQUEST_ERROR = "rooms/REQUEST_ERROR";
const REQUEST = "rooms/REQUEST";

const initialState = {
  rooms: {},
  errorMessage: "",
  isFetching: false
};

const RoomsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        rooms: get(action, "payload.rooms", [])
      };
    case REQUEST:
      return { ...state, isFetching: true };
    case UPDATE:
      return {
        ...state,
        rooms: { ...state.rooms, ...action.payload.room },
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

const update = room => ({
  type: UPDATE,
  payload: {
    room
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

export const updateRoomsReducer = (room = {}) => dispatch => {
  dispatch(update(room));
};

export default RoomsReducer;
