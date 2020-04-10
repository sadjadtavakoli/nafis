import { FETCHING } from "../actions/types";

const INITIAL_VALUES = {
  fetching: null,
};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case FETCHING:
      return {
        ...state,
        fetching: action.payload,
      };
    default:
      return state;
  }
};
