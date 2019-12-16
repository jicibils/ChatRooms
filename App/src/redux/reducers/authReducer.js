import { REHYDRATE } from "redux-persist";
import get from "lodash/get";

import { AUTHENTICATION_TYPES } from "utils/types";

//API
import { confirmUser } from "api/services/login";

const LOGIN = "auth/LOGIN";
const LOGOUT = "auth/LOGOUT";
const REQUEST_ERROR = "auth/REQUEST_ERROR";
const REQUEST = "auth/REQUEST";

const initialState = {
  isFetching: false,
  user: null,
  token: null,
  isAuthed: false,
  errorMessage: ""
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        user: get(action, "payload.user", {})
      };
    case REQUEST:
      return { ...state, isFetching: true, isAuthed: false };
    case LOGIN:
      return {
        ...state,
        isAuthed: true,
        token: action.payload.token,
        user: action.payload.user,
        errorMessage: "",
        isFetching: false
      };
    case LOGOUT:
      return {
        ...state,
        isAuthed: false,
        token: null,
        user: null,
        isFetching: false,
        errorMessage: ""
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

const login = (token, user) => ({
  type: LOGIN,
  payload: {
    token,
    user
  }
});

const logout = () => ({
  type: LOGOUT
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

export const signin = (
  email,
  password,
  { launchSnackBar, isFromRegister = false, userObj = {} } = {}
) => dispatch => {
  dispatch(request());
  if (isFromRegister) dispatch(login(userObj.token, userObj.userData));
  else {
    confirmUser({ email, password })
      .then(res => {
        if (res.data.type === AUTHENTICATION_TYPES.SUCCESS) {
          if (!!res.data.userData) launchSnackBar("Welcome!", "success");
          dispatch(login(res.data.token, res.data.userData));
        } else {
          launchSnackBar(res.data.message, "failure");
          dispatch(requestError(res.data.message));
        }
      })
      .catch(error => console.log(error));
  }
};

export const signout = () => dispatch => {
  dispatch(logout());
};

export default AuthReducer;
