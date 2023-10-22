import {
    SET_MEETINGS_LISTS
} from "../types";


export const setMeetingLists = (lists) => ({
    type: SET_MEETINGS_LISTS,
    payload: lists,
  });