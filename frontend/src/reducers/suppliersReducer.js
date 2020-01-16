import { GET_SUPPLIERS, GET_THE_SUPPLIER } from "../actions/types";

const INITIAL_VALUES = {};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case GET_SUPPLIERS:
      return { ...state, suppliers: action.payload };
    case GET_THE_SUPPLIER:
      return { ...state, supplier: action.payload };
    default:
      return state;
  }
};
