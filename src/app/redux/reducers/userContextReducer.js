import {
  SET_IS_LOGGED,
  SET_LOGGED_DATA,
  SET_IS_INITIALIZE
} from "../types";

const initialState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null
};

const userContextReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_LOGGED:
      return { ...state, isAuthenticated: action.payload };
    case SET_LOGGED_DATA:
      return { ...state, user: action.payload };
    case SET_IS_INITIALIZE:
      return { ...state, isInitialised: action.payload };
    default:
      return state;
  }
};

export default userContextReducer;
