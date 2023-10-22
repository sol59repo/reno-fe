import {
    SET_STAFF_LISTS
} from "../types";



const initialState = {
    staffLists: []
  }

  const staffsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STAFF_LISTS:
            return {...state, staffLists: action.payload};
        default:
            return state;
    }
  };
  
  export default staffsReducer;
  