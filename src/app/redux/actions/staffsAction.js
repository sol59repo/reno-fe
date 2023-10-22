import {
    SET_STAFF_LISTS
} from "../types";


export const setStaffLists = (staffslists) => ({
    type: SET_STAFF_LISTS,
    payload: staffslists,
  });