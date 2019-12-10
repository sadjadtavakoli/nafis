import { GET_PRODUCT_FIELDS } from "../actions/types";

const INITIAL_VALUES = {};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case GET_PRODUCT_FIELDS:
      return { ...state, productFields: action.payload};
    default:
      return state;
  }
};