import {
    SET_MEETINGS_LISTS
} from "../types";

const initialState = {
    meetingList: []
  }

  const meetingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MEETINGS_LISTS:
            return {...state, meetingList: action.payload};
        default:
            return state;
    }
  };
  
  export default meetingReducer;
  