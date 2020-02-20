import { GET_ACTIVE_BILL } from "../actions/types";

const INITIAL_VALUES = {};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case GET_ACTIVE_BILL:
      return { ...state, activeBills: action.payload };
    default:
      return state;
  }
};
