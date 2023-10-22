import {
    SET_PROJECTMODEL_LISTS
} from "../types";


export const setProjectLists = (lists) => ({
    type: SET_PROJECTMODEL_LISTS,
    payload: lists,
  });