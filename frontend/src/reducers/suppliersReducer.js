import { GET_SUPPLIERS } from "../actions/types";

const INITIAL_VALUES = {};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case GET_SUPPLIERS:
      return { ...state, suppliers: action.payload };
    default:
      return state;
  }
};
