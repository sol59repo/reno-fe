import {
  SET_IS_LOGGED,
  SET_LOGGED_DATA,
  SET_IS_INITIALIZE
} from "../types";

export const setIsLogged = (bool) => ({
  type: SET_IS_LOGGED,
  payload: bool,
});

export const setLoggedData = (data) => ({
  type: SET_LOGGED_DATA,
  payload: data,
});

export const setIsInitialize = (bool) => ({
  type: SET_IS_INITIALIZE,
  payload: bool,
});





