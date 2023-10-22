import {
    SET_ITEMS_LISTS
} from "../types";


export const setConsumablesLists = (lists) => ({
    type: SET_ITEMS_LISTS,
    payload: lists,
  });