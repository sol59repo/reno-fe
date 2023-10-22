import {
    SET_OVERLAY_STATE
} from "../types";


export const setOverlayState = (states) => ({
    type: SET_OVERLAY_STATE,
    payload: states,
  });