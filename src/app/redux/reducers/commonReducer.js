import {
    SET_OVERLAY_STATE
} from "../types";

const initialState = {
    overlayLoader: {
        active :false,
        text: "Loading your content..."
    }
  }

  const commonReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_OVERLAY_STATE:
            return {...state, overlayLoader: action.payload};
        default:
            return state;
    }
  };
  
  export default commonReducer;
  