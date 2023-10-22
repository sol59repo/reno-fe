import {
    SET_ITEMS_LISTS
} from "../types";



const initialState = {
    consumablesLists: []
}

const consumablesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ITEMS_LISTS:
            return { ...state, consumablesLists: action.payload };
        default:
            return state;
    }
};

export default consumablesReducer;
