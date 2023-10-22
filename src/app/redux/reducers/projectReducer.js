import {
    SET_PROJECTMODEL_LISTS
} from "../types";

const initialState = {
    projectList: []
  }

  const projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROJECTMODEL_LISTS:
            return {...state, projectList: action.payload};
        default:
            return state;
    }
  };
  
  export default projectReducer;
  